import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

function CommonTooltip({
  data,
  label,
}: {
  data: any;
  label: string | React.ReactNode;
}) {
  return (
    <Card className=" bg-neutral-700 border-neutral-600 border-1 min-w-3xs">
      <CardBody>
        <CardHeader className="text-sm font-medium p-0">{label}</CardHeader>
        <Divider className="my-2" />
        <ul className="text-sm flex justify-between">
          <li className="flex gap-2 items-center">
            <div className="size-5 bg-primary rounded-sm" />
            Visitors
          </li>
          <li>{data?.visitors}</li>
        </ul>

        {data?.revenue && data.revenue > 0 ? (
          <>
            <Divider className="my-2" />
            <ul className="text-sm flex justify-between">
              <li className="flex gap-2 items-center">
                <div className="size-5 bg-[#e78468] rounded-sm" />
                Revenue
              </li>
              <li>${data?.revenue}</li>
            </ul>
            <Divider className="my-2" />
            <ul className=" flex justify-between text-xs">
              <li>Revenue/visitor</li>
              <li>${(data?.visitors / data?.revenue).toFixed(2)}</li>
            </ul>
            <ul className=" flex justify-between text-xs">
              <li>Conversion rate</li>
              <li>${((data?.visitors / data?.revenue) * 100).toFixed(2)}</li>
            </ul>
          </>
        ) : (
          ""
        )}
      </CardBody>
    </Card>
  );
}

export default CommonTooltip;
