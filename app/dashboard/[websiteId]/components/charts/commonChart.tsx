import { CardBody } from "@heroui/react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CommonTooltip from "../commonTooltip";

import { Metric } from "@/lib/types";

function CustomBarShape({ x, y, width, height, bar, payload }: any) {
  const hasRevenue = payload?.revenue;

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      className="cursor-pointer"
    >
      <div
        className={`group-hover:opacity-40 hover:!opacity-100 flex items-center ${bar === "visitor" ? "" : "rounded-r-md"} ${!hasRevenue ? "rounded-r-md" : ""} h-full transition cursor-pointer ${bar == "visitor" ? "bg-[#fd366e]/50 mr-[2px]" : "bg-[#e78468]/50"} z-10 `}
      />
    </foreignObject>
  );
}

export interface CommonChartProps {
  data: Metric[];
}
export function CommonChart({ data }: CommonChartProps) {
  return (
    <CardBody className={`space-y-2 px-0 h-full`}>
      <ResponsiveContainer
        width="100%"
        height={data.length * 40}
        className="max-h-[381px]"
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barGap={4}
          className="group"
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" hide />

          <Bar
            legendType="cross"
            dataKey="visitors"
            stackId={"a"}
            shape={<CustomBarShape bar={"visitor"} />}
          />

          <Bar dataKey="revenue" shape={<CustomBarShape />} stackId="a" />

          <Bar
            dataKey="visitors"
            fill="transparent"
            isAnimationActive={false}
            stackId="a"
          >
            <LabelList
              content={({ height, y, value }) => (
                <foreignObject x={-5} y={y} width="100%" height={height}>
                  <div className="w-full h-full flex flex-col cursor-pointer">
                    <span className="self-end pr-2 mt-[2px]">{value}</span>
                  </div>
                </foreignObject>
              )}
              position="top"
              dataKey="visitors"
            />

            <LabelList
              content={({ height, y, value, index }) => {
                return (
                  <foreignObject x={10} y={y} width="100%" height={height}>
                    <div className="w-full h-full flex flex-col cursor-pointer z-100">
                      <span className="flex gap-2 items-center pt-1 text-white text-[14px]">
                        {index !== undefined && data[index].imageUrl && (
                          <img
                            className="size-[18px]"
                            alt=""
                            src={data[index].imageUrl}
                          />
                        )}

                        {value}
                      </span>
                    </div>
                  </foreignObject>
                );
              }}
              position="top"
              dataKey="label"
            />
          </Bar>
          <Tooltip
            cursor={{ fill: "none" }}
            content={({ payload }) => (
              <CommonTooltip
                data={payload?.[0]?.payload}
                label={payload?.[0]?.payload?.label}
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardBody>
  );
}
