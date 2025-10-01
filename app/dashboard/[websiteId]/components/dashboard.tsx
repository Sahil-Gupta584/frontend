"use client";
import { Alert, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";

import { CommonChart } from "./charts/commonChart";
import LocationCharts from "./charts/locationCharts";
import MainGraph from "./charts/mainGraph";
import SystemCharts from "./charts/systemCharts";
import Filters from "./filters";

import { account } from "@/appwrite/clientConfig";
import { GraphLoader, LocationSystemChartsLoader } from "@/components/loaders";
import MainGraphLoader from "@/components/loaders/mainGraph";
import NextLink from "@/components/nextLink";

export type TWebsite = { $id: string; domain: string };
export default function Dashboard() {
  const { websiteId } = useParams<{ websiteId: string }>();
  const [duration, setDuration] = useState("last_7_days");

  const mainGraphQuery = useQuery({
    queryKey: ["mainGraph", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/main", { params: { duration, websiteId } })
      ).data;
    },
    enabled: false,
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
    enabled: false,
  });

  const {
    pageData,
    referrerData,
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
      const user = await account.get();
      const res = await axios("/api/website", {
        params: { userId: user.$id },
      });

      return res.data?.websites as TWebsite[];
    },
    enabled: false,
  });

  useEffect(() => {
    mainGraphQuery.refetch(),
      otherGraphQuery.refetch(),
      getWebsitesQuery.refetch();
  }, [duration]);
  const currentWebsite = useMemo(() => {
    return getWebsitesQuery.data
      ? getWebsitesQuery.data.find((w) => w?.$id === websiteId)
      : null;
  }, [getWebsitesQuery.data]);

  return (
    <section className="mb-6">
      {mainGraphQuery.data && mainGraphQuery.data?.isEmpty && (
        <Alert
          color="warning"
          icon={<FiAlertTriangle />}
          hideIcon
          className="dark:bg-[#312107]  border-warning-100 border text-sm fixed bottom-5 left-5 w-fit __className_23ba4a z-50"
        >
          <div className="flex gap-3">
            <GoAlertFill className="mt-1 text-black" fill="#eab308" />
            <ul>
              <li className="flex gap-2 font-medium text-warning-600">
                Awaiting the first event...
                <span
                  role="status"
                  aria-label="Loading"
                  className="inline-block w-3 h-3 rounded-full  border mt- border-current border-t-transparent animate-spin text-white"
                />
              </li>
              <ol className="list-decimal list-inside text-warning-500 ">
                <li className="flex">
                  Install the script using the{" "}
                  <NextLink
                    text="tracking code"
                    href={`/dashboard/${websiteId}/settings`}
                    blank
                  />
                </li>
                <li>
                  Visit{" "}
                  <NextLink
                    text={currentWebsite ? currentWebsite.domain : ""}
                    blank
                    href={`https://${currentWebsite ? currentWebsite.domain : ""}`}
                  />
                  to register the first event yourself
                </li>
                <li>Refresh your dashboard</li>
                <li>
                  Still not working?{" "}
                  <NextLink
                    text="Contact support"
                    href="https://x.com/sahil_builds"
                  />
                </li>
              </ol>
            </ul>
          </div>
        </Alert>
      )}
      {getWebsitesQuery.data && (
        <Filters
          duration={duration}
          setDuration={setDuration}
          websiteId={websiteId}
          data={getWebsitesQuery.data}
          isLoading={
            getWebsitesQuery.isFetching ||
            mainGraphQuery.isFetching ||
            otherGraphQuery.isFetching
          }
          refetchMain={mainGraphQuery.refetch}
          refetchOthers={otherGraphQuery.refetch}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(459px,auto)]">
        {mainGraphQuery.isFetching ? (
          <MainGraphLoader />
        ) : (
          mainGraphQuery.data && (
            <MainGraph
              chartData={mainGraphQuery.data?.dataset}
              duration={duration}
              avgSessionTime={mainGraphQuery.data?.avgSessionTime}
              bounceRate={mainGraphQuery.data?.bounceRate}
              websiteId={websiteId}
              conversionRate={otherGraphQuery.data?.overallConversionRate}
            />
          )
        )}

        <Card className="border border-[#373737]">
          <CardHeader>Page</CardHeader>
          <Divider />
          {otherGraphQuery.isFetching ? (
            <GraphLoader />
          ) : (
            pageData && <CommonChart data={pageData} />
          )}
        </Card>

        <Card className="border border-[#373737]">
          <CardHeader>Referrer</CardHeader>
          <Divider />
          <CardBody className="p-0">
            {otherGraphQuery.isFetching ? (
              <GraphLoader />
            ) : (
              referrerData && <CommonChart data={referrerData} />
            )}
          </CardBody>
        </Card>

        {otherGraphQuery.isFetching ? (
          <LocationSystemChartsLoader />
        ) : (
          <>
            {countryData && cityData && regionData && (
              <LocationCharts
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
    </section>
  );
}
