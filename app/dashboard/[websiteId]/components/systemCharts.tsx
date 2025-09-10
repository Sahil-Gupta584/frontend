"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, CommonChartProps } from "./commonChart";
import { classNames } from "./locationCharts";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface SystemChartProps {
  browserData: CommonChartProps["data"];
  osData: CommonChartProps["data"];
  deviceData: CommonChartProps["data"];
}

export default function SystemCharts({
  browserData,
  deviceData,
  osData,
}: SystemChartProps) {
  return (
    <Card className="border border-[#373737]">
      <CardBody className="h-80 p-0">
        <Tabs
          aria-label="systemCharts"
          className=" border-b-[#ffffff26] border-b-[1px] rounded-none w-full"
          classNames={classNames}
          color="secondary"
        >
          <Tab key="browser" title={<span>Browser</span>}>
            <CommonChart data={browserData} />
          </Tab>
          <Tab key="OS" title="OS">
            <CommonChart data={osData} />
          </Tab>
          <Tab key="Device" title="Device">
            <CommonChart data={deviceData} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
