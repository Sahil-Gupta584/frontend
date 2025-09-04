import { CardBody } from "@heroui/react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

function CustomBarShape({ x, y, width, height }: any) {
  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      className="cursor-pointer"
    >
      <div
        className={`flex items-center rounded-md rounded-l-none px-2 h-full transition-all duration-200 cursor-pointer bg-[#fd366e]/40 hover:bg-[#fd366e]
        `}
      ></div>
    </foreignObject>
  );
}

export interface CommonChartProps {
  data: { label: string; value: number }[];
  renderFlag?: boolean;
  scale?: boolean;
}
export function CommonChart({ data, renderFlag, scale }: CommonChartProps) {
  return (
    <CardBody className={`space-y-2 pl-0 ${scale ? "scale-[1.03]" : ""}`}>
      <ResponsiveContainer width="100%" height={data.length * 40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" hide />

          <Bar dataKey="value" isAnimationActive={true} shape={CustomBarShape}>
            <LabelList
              content={({ height, x, y, value, index }) => (
                <foreignObject x={x} y={y} width="100%" height={height}>
                  <div className="w-full h-full flex flex-col cursor-pointer">
                    <span className="self-end pr-2 mt-[2px]">{value}</span>
                  </div>
                </foreignObject>
              )}
              position="top"
              dataKey="value"
            />

            <LabelList
              content={({ height, x, y, value, index }) => (
                <foreignObject x={x} y={y} width="100%" height={height}>
                  <div className="w-full h-full flex flex-col cursor-pointer">
                    <span className="pl-10 mt-[2px]">{value}</span>
                  </div>
                </foreignObject>
              )}
              position="top"
              dataKey="label"
            />

            {renderFlag && (
              <LabelList
                content={({ height, x, y, value, index }) => (
                  <foreignObject x={x} y={y} width="100%" height={height}>
                    <ol className="pl-4 mt-2 cursor-pointer">
                      <img
                        height={16}
                        width={18}
                        alt=""
                        src={value as string}
                      />{" "}
                    </ol>
                  </foreignObject>
                )}
                position="top"
                dataKey="imageUrl"
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardBody>
  );
}
