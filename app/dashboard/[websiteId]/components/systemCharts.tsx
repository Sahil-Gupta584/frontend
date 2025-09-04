"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { CommonChart, CommonChartProps } from "./commonChart";
import { classNames } from "./mapChart";

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
    <Card className="flex-1 border-neutral-700 ">
      <CardBody className="h-80 p-0">
        <Tabs
          aria-label="systemCharts"
          className=" border-b-[#ffffff26] border-b-[1px] rounded-none w-full"
          classNames={classNames}
          color="secondary"
        >
          <Tab key="browser" title={<span>Browser</span>}>
            <CommonChart data={browserData} renderFlag={true} />
          </Tab>
          <Tab key="OS" title="OS">
            <CommonChart data={osData} renderFlag={true} />
          </Tab>
          <Tab key="Device" title="Device">
            <CommonChart data={deviceData} renderFlag={true} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
