"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { CommonChart } from "../dashboard/[websiteId]/components/commonChart";
import LocationCharts from "../dashboard/[websiteId]/components/locationCharts";
import MainGraph from "../dashboard/[websiteId]/components/mainGraph";
import SystemCharts from "../dashboard/[websiteId]/components/systemCharts";
import { ReactQueryProvider } from "../providers";

import { GraphLoader, LocationSystemChartsLoader } from "@/components/loaders";
import MainGraphLoader from "@/components/loaders/mainGraph";
import Filters from "../dashboard/[websiteId]/components/filters";

function Page() {
  const websiteId = "68b2e27b000850428c13";
  const [duration, setDuration] = useState("last_7_days");

  const mainGraphQuery = useQuery({
    queryKey: ["mainGraph", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/main", { params: { duration, websiteId } })
      ).data;
    },
  });

  const otherGraphQuery = useQuery({
    queryKey: ["otherGraphs", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/others", {
          params: { duration, websiteId },
        })
      ).data;
    },
  });

  const {
    pageData,
    referrerData,
    mapData,
    countryData,
    regionData,
    cityData,
    browserData,
    deviceData,
    osData,
  } = otherGraphQuery.data || {};

  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      const res = await axios("/api/website", {
        params: { userId: "68c43d86288fed2fe824" },
      });

      return res.data?.websites;
    },
  });

  return (
    <section className="mb-6 max-w-6xl mx-auto p-4">
      <ReactQueryProvider>
        {getWebsitesQuery.data && (
          <Filters
            duration={duration}
            setDuration={setDuration}
            websiteId={websiteId}
            data={[getWebsitesQuery.data]}
            isLoading={getWebsitesQuery.isLoading}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(459px,auto)]">
          {/* Main Graph */}
          {mainGraphQuery.isLoading ? (
            <MainGraphLoader />
          ) : (
            mainGraphQuery.data && (
              <MainGraph
                chartData={mainGraphQuery.data?.dataset}
                duration={duration}
                avgSessionTime={mainGraphQuery.data?.avgSessionTime}
                bounceRate={mainGraphQuery.data?.bounceRate}
                websiteId={websiteId}
              />
            )
          )}

          {/* Pages */}
          <Card className="border border-[#373737]">
            <CardHeader>Page</CardHeader>
            <Divider />
            {otherGraphQuery.isLoading ? (
              <GraphLoader />
            ) : (
              pageData && <CommonChart data={pageData} />
            )}
          </Card>

          {/* Referrer */}
          <Card className="border border-[#373737]">
            <CardHeader>Referrer</CardHeader>
            <Divider />
            <CardBody className="p-0">
              {otherGraphQuery.isLoading ? (
                <GraphLoader />
              ) : (
                referrerData && <CommonChart data={referrerData} />
              )}
            </CardBody>
          </Card>

          {/* Location + System */}
          {otherGraphQuery.isLoading ? (
            <LocationSystemChartsLoader />
          ) : (
            <>
              {countryData && cityData && regionData && (
                <LocationCharts
                  mapData={mapData}
                  countryData={countryData}
                  regionData={regionData}
                  cityData={cityData}
                />
              )}
              {browserData && deviceData && osData && (
                <SystemCharts
                  browserData={browserData}
                  deviceData={deviceData}
                  osData={osData}
                />
              )}
            </>
          )}
        </div>
      </ReactQueryProvider>
    </section>
  );
}

export default Page;
