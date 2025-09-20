"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

import { CommonChart } from "../dashboard/[websiteId]/components/commonChart";
import LocationCharts from "../dashboard/[websiteId]/components/locationCharts";
import MainGraph from "../dashboard/[websiteId]/components/mainGraph";
import SystemCharts from "../dashboard/[websiteId]/components/systemCharts";
import { ReactQueryProvider } from "../providers";

import { GraphLoader, LocationSystemChartsLoader } from "@/components/loaders";
import MainGraphLoader from "@/components/loaders/mainGraph";
import Filters from "../dashboard/[websiteId]/components/filters";

function Page() {
  const websiteId = "68c43ddf0011d1180361";
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
    mapData,
    countryData,
    regionData,
    cityData,
    browserData,
    deviceData,
    osData,
  } = otherGraphQuery.data || {};

  useEffect(() => {
    mainGraphQuery.refetch();
    otherGraphQuery.refetch();
  }, [duration]);
  return (
    <section className="mb-6 max-w-6xl mx-auto p-4">
      <ReactQueryProvider>
        <Filters
          duration={duration}
          setDuration={setDuration}
          websiteId={"68c43d86288fed2fe824"}
          data={[{ $id: "68c43d86288fed2fe824", domain: "syncmate.xyz" }]}
          isLoading={mainGraphQuery.isFetching || otherGraphQuery.isFetching}
          refetchMain={mainGraphQuery.refetch}
          refetchOthers={otherGraphQuery.refetch}
        />
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
      </ReactQueryProvider>
    </section>
  );
}

export default Page;
