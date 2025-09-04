"use client";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MainGraphProps = {
  chartData: { label: string; value: number }[];
  duration: string;
};

function MainGraph({ chartData, duration }: MainGraphProps) {
  return (
    <Card className="mt-6 border-neutral-700">
      <CardHeader>
        <div className="flex flex-col">
          ☑️ Visitors
          <span>{chartData.reduce((acc, d) => acc + d.value, 0)}</span>
        </div>
      </CardHeader>
      <CardBody className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fd366e" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#fd366e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="label"
              stroke="#999"
              interval={
                duration === "last_30_days"
                  ? 4
                  : duration === "last_12_months"
                    ? 30
                    : 0
              }
            />
            <YAxis stroke="#999" />

            <Tooltip
              contentStyle={{
                background: "#1e1e1e",
                border: "1px solid #444",
                borderRadius: "8px",
              }}
              content={({ payload, label }) => {
                if (!payload || !payload.length) return null;
                return (
                  <Card className="p-4 bg-neutral-600 border-neutral-700 border-1">
                    <CardBody>
                      <div className="flex flex-col">
                        <span className="font-semibold">{label}</span>
                        <Divider className="my-2" />
                        <span className="text-sm">
                          {payload?.[0]?.payload?.value} Visitors
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#fd366e"
              strokeWidth={2}
              fill="url(#lineGradient)"
              isAnimationActive={true}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export default MainGraph;
