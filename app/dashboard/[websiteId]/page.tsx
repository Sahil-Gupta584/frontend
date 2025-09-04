"use client";
import { database, databaseId } from "@/appwrite/serverConfig";
import Flag from "@/components/flag";
import { bucketHour, getCountryName } from "@/lib/utils";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";
import axios from "axios";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { CommonChart } from "./components/commonChart";
import Filters from "./components/filters";
import MainGraph from "./components/mainGraph";
import MapChart from "./components/mapChart";
import SystemCharts from "./components/systemCharts";

export default function Page() {
  const { websiteId } = useParams<{ websiteId: string }>();
  const [duration, setDuration] = useState("last_7_days");

  const getEventsQuery = useQuery({
    queryKey: ["getEvents", websiteId],
    queryFn: async () => {
      await axios("/api/analytics/main", { params: { duration, websiteId } });
      return await database.listRows({
        databaseId,
        tableId: "events",
        queries: [Query.equal("website", websiteId)],
      });
    },
    enabled: !!websiteId,
  });

  const chartData = useMemo(() => {
    if (!getEventsQuery.data) return [];

    const events = getEventsQuery.data.rows;
    const now = new Date();
    let data: { label: string; value: number }[] = [];

    if (["today", "yesterday", "last_24_hours"].includes(duration)) {
      // ----- group by HOUR BUCKETS -----
      const counts: Record<string, number> = {};

      // pick group size
      let groupSize = 1;
      if (duration === "last_24_hours")
        groupSize = 3; // 3h buckets
      else if (duration === "today" || duration === "yesterday") {
        const hoursPassed = duration === "today" ? now.getHours() + 1 : 24; // yesterday is always full 24h
        if (hoursPassed <= 8)
          groupSize = 1; // keep hourly if few points
        else if (hoursPassed <= 16) groupSize = 2;
        else groupSize = 3;
      }

      events.forEach((e) => {
        const eventDate = new Date(e.$createdAt);

        let include = false;
        if (duration === "today") {
          include = eventDate.toDateString() === now.toDateString();
        } else if (duration === "yesterday") {
          const target = new Date(now);
          target.setDate(now.getDate() - 1);
          include = eventDate.toDateString() === target.toDateString();
        } else if (duration === "last_24_hours") {
          include = now.getTime() - eventDate.getTime() <= 24 * 60 * 60 * 1000;
        }

        if (include) {
          const bucket = bucketHour(eventDate, groupSize);
          const key = bucket.toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          });
          counts[key] = (counts[key] || 0) + 1;
        }
      });

      // fill buckets across the range
      const start = new Date(now);
      if (duration === "yesterday") start.setDate(now.getDate() - 1);
      if (duration === "last_24_hours")
        start.setHours(now.getHours() - 23, 0, 0, 0);
      else start.setHours(0, 0, 0, 0);

      const end =
        duration === "yesterday"
          ? new Date(start.getTime() + 24 * 60 * 60 * 1000)
          : now;

      const temp = new Date(start);
      while (temp <= end) {
        const key = temp.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });
        data.push({ label: key, value: counts[key] || 0 });
        temp.setHours(temp.getHours() + groupSize);
      }
    } else {
      // ----- group by DAY (same as before) -----
      let startDate = new Date();
      switch (duration) {
        case "last_7_days":
          startDate.setDate(now.getDate() - 6);
          break;
        case "last_30_days":
          startDate.setDate(now.getDate() - 29);
          break;
        case "last_12_months":
          startDate.setMonth(now.getMonth() - 11);
          break;
        default:
          startDate.setDate(now.getDate() - 6);
      }

      const counts: Record<string, number> = {};
      events.forEach((e) => {
        const eventDate = new Date(e.$createdAt);
        const key = eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        counts[key] = (counts[key] || 0) + 1;
      });

      const temp = new Date(startDate);
      while (temp <= now) {
        const key = temp.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        data.push({ label: key, value: counts[key] || 0 });
        temp.setDate(temp.getDate() + 1);
      }
    }

    return data;
  }, [getEventsQuery.data, duration]);

  const {
    pageData,
    referrerData,
    cityData,
    mapData,
    regionData,
    countryData,
    browserData,
    deviceData,
    osData,
  } = useMemo(() => {
    type MapDataType = { label: string; value: number; imageUrl: string };

    const mapMap = new Map<
      string,
      {
        countryCode: string;
        visitors: number;
      }
    >();

    const pageMap = new Map<string, MapDataType>();
    const referrerMap = new Map<string, MapDataType>();

    const countryMap = new Map<string, MapDataType>();
    const regionMap = new Map<string, MapDataType>();
    const cityMap = new Map<string, MapDataType>();
    const browserMap = new Map<string, MapDataType>();
    const osMap = new Map<string, MapDataType>();
    const deviceMap = new Map<string, MapDataType>();

    getEventsQuery.data?.rows.forEach((e) => {
      // Pages
      const url = new URL(e.href);
      const page = pageMap.get(url.pathname);

      if (page) {
        page.value += 1;
      } else {
        pageMap.set(url.pathname, {
          label: url.pathname,
          value: 1,
          imageUrl: "",
        });
      }
      // Referrer

      const referrer = referrerMap.get(e.referrer);
      if (referrer) {
        referrer.value += 1;
      } else {
        referrerMap.set(e.referrer, {
          label: e.referrer || "Direct/None",
          value: 1,
          imageUrl: `https://icons.duckduckgo.com/ip3/${e.refferer}.ico`,
        });
      }
      // Map
      const map = mapMap.get(e.countryCode);
      if (map) {
        map.visitors += 1;
      } else {
        mapMap.set(e.countryCode, {
          countryCode: e.countryCode,
          visitors: 1,
        });
      }

      // Country
      const country = countryMap.get(e.countryCode);
      if (country) {
        country.value += 1;
      } else {
        countryMap.set(e.countryCode, {
          label: getCountryName(e.countryCode),
          value: 1,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // Region
      const region = regionMap.get(e.region);
      if (region) {
        region.value += 1;
      } else {
        regionMap.set(e.region, {
          label: e.region,
          value: 1,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // City
      const city = cityMap.get(e.city);
      if (city) {
        city.value += 1;
      } else {
        cityMap.set(e.city, {
          label: e.city,
          value: 1,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // Browser
      const browser = browserMap.get(e.browser);
      if (browser) {
        browser.value += 1;
      } else {
        browserMap.set(e.browser, {
          label: e.browser,
          value: 1,
          imageUrl: `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/${(e.browser as string).toLowerCase()}/${(e.browser as string).toLowerCase()}_64x64.png`,
        });
      }

      // OS
      const os = osMap.get(e.os);
      if (os) {
        os.value += 1;
      } else {
        osMap.set(e.os, {
          label: e.os,
          value: 1,
          imageUrl: `/images/${(e.os as string).toLowerCase()}.png`,
        });
      }

      // Device
      const device = deviceMap.get(e.device);
      if (device) {
        device.value += 1;
      } else {
        deviceMap.set(e.device, {
          label: e.device,
          value: 1,
          imageUrl: `https://datafa.st/images/devices/${(e.device as string).toLowerCase()}.png`,
        });
      }
    });

    // Convert Maps → arrays
    const mapData = Array.from(mapMap.values());
    const countryData = Array.from(countryMap.values());
    const regionData = Array.from(regionMap.values());
    const cityData = Array.from(cityMap.values());
    const browserData = Array.from(browserMap.values());
    const osData = Array.from(osMap.values());
    const deviceData = Array.from(deviceMap.values());
    const pageData = Array.from(pageMap.values());
    const referrerData = Array.from(referrerMap.values());

    return {
      pageData,
      referrerData,
      countryData,
      regionData,
      cityData,
      mapData,
      browserData,
      osData,
      deviceData,
    };
  }, [getEventsQuery.data]);
  console.log({ referrerData });

  return (
    <section className="p-6">
      <Filters
        duration={duration}
        setDuration={setDuration}
        websiteId={websiteId}
      />
      {chartData && <MainGraph chartData={chartData} duration={duration} />}
      <div className="flex mt-4 gap-4 w-full">
        <Card className="flex-1">
          <CardHeader>Pages</CardHeader>
          <Divider />
          <CommonChart data={pageData} />
        </Card>
        <Card className="flex-1">
          <CardHeader>Referrer</CardHeader>
          <Divider />
          <CommonChart data={referrerData} />
        </Card>
      </div>
      <div className="flex mt-4 gap-4 w-full">
        {countryData && cityData && regionData && (
          <MapChart
            mapData={mapData}
            countryData={countryData}
            regionData={regionData}
            cityData={cityData}
          />
        )}
        <ReactTooltip
          id="map-tooltip"
          place="top"
          opacity="1"
          style={{
            padding: "0",
            background: "transparent",
            transition: "ease-in-out",
          }}
          className="p-0"
          render={({ content }) => {
            if (!content) return null;
            let parsed: { countryCode: string; visitors: number };
            try {
              parsed = JSON.parse(content);
            } catch {
              return content;
            }

            return (
              <Card className="p-4 bg-neutral-600 border-neutral-700 border-1">
                <CardBody>
                  <div className="flex flex-col">
                    <span className="font-semibold items-center flex gap-2">
                      <Flag countryCode={parsed.countryCode} />
                      {getCountryName(parsed.countryCode)}
                    </span>
                    <Divider className="my-2" />
                    <ul className="text-sm flex justify-between items-  ">
                      <li>Visitors</li>
                      <li>{parsed.visitors}</li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            );
          }}
        />

        <SystemCharts
          browserData={browserData}
          deviceData={deviceData}
          osData={osData}
        />
      </div>
    </section>
  );
}
