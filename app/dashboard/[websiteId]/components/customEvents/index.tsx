import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, CommonChartProps } from "../charts/commonChart";
import { classNames } from "../charts/locationCharts";

function CustomEvents({
  goalsData,
  totalVisitors,
}: {
  goalsData: CommonChartProps["data"];
  totalVisitors: number;
}) {
  return (
    <Card className="border border-[#373737] mt-4">
      <CardBody className="h-80 overflow-hidden p-0">
        <Tabs
          aria-label="CustomEvents"
          className=" border-b-[#ffffff26] border-b-[1px] rounded-none w-full"
          classNames={classNames}
          color="secondary"
        >
          <Tab key="Goal" title="Goal" className="pr-4">
            {goalsData && (
              <CommonChart
                data={goalsData}
                totalVisitors={totalVisitors}
                showConversion={true}
              />
            )}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

export default CustomEvents;
