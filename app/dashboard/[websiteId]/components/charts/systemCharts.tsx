"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, CommonChartProps } from "./commonChart";
import { classNames } from "./locationCharts";

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
    <Card className="border border-neutral-200 dark:border-[#373737]">
      <CardBody className="h-80 p-0">
        <Tabs
          aria-label="systemCharts"
          className=" border-b-[1px] rounded-none w-full border-b-neutral-200 dark:border-b-[#ffffff26]"
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
