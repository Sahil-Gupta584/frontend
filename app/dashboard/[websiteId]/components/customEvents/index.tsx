import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { classNames } from "../charts/locationCharts";

function CustomEvents() {
  return (
    <Card className="border border-[#373737]">
      <CardBody className="h-80 overflow-hidden p-0">
        <Tabs
          aria-label="Options"
          className=" border-b-[#ffffff26] border-b-[1px] rounded-none w-full"
          classNames={classNames}
          color="secondary"
        >
            <Tab
            key='Goal'
            title='Goal'
            ></Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

export default CustomEvents;
