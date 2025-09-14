"use client";
import { Card, CardBody, CardHeader, Checkbox } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getLiveVisitors } from "../actions";

import CommonTooltip from "./commonTooltip";

import { client } from "@/appwrite/clientConfig";
import { databaseId } from "@/appwrite/serverConfig";
import { getLabel } from "@/lib/utils/server";

type MainGraphProps = {
  chartData: {
    id: string;
    name: string;
    visitors: number;
    revenue: number;
    timestamp: string;
    renewalRevenue: number;
    refundedRevenue: number;
    customers: number;
    sales: number;
    goalCount: number;
  }[];
  duration: string;
  bounceRate: string;
  avgSessionTime: number;
  websiteId: string;
};
type TLiveVisitor = { visitorId: string; sessionId: string };
function MainGraph({
  chartData,
  duration,
  avgSessionTime,
  bounceRate,
  websiteId,
}: MainGraphProps) {
  const [isVisitorsSelected, setIsVisitorsSelected] = useState(true);
  const [isRevenueSelected, setIsRevenueSelected] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState<TLiveVisitor[]>([]);
  const data = useMemo(
    () =>
      chartData.map((d) => ({
        label: d.name,
        visitors: d.visitors,
        revenue: d.revenue,
        timestamp: d.timestamp,
        id: d.id,
      })),
    [chartData]
  );

  useEffect(() => {
    getLiveVisitors(websiteId).then((data) => {
      if (data) {
        setLiveVisitors(
          data.map((v) => ({ sessionId: v.sessionId, visitorId: v.visitorId }))
        );
      }
    });
    client.subscribe(
      `databases.${databaseId}.tables.heartbeat.rows`,
      ({ payload, events }: { payload: TLiveVisitor; events: string[] }) => {
        if (
          !events.includes(
            `databases.${databaseId}.tables.heartbeat.rows.*.create`
          )
        )
          return;

        setLiveVisitors((prev) => {
          const exists = prev.some(
            (v) =>
              v.sessionId === payload.sessionId &&
              v.visitorId === payload.visitorId
          );

          if (exists) return prev;

          return [...prev, payload];
        });
      }
    );
  }, []);

  function Tick({ x, y, index }: any) {
    const step = Math.ceil(data.length / 8);
    const isVisible = index % step === 0 || index === data.length - 1;

    if (!isVisible) return null;

    return (
      <g transform={`translate(${x},${y + 10})`}>
        <text textAnchor="middle" fill="#999" fontSize={12}>
          {data[index].label}
        </text>
      </g>
    );
  }

  const visitors = chartData.reduce((prev, cur) => prev + cur.visitors, 0);
  const revenue = chartData.reduce((prev, cur) => prev + cur.revenue, 0);

  const headerData = [
    {
      name: "",
      icon: (
        <Checkbox
          classNames={{
            base: "p-0 m-0 ",
            label: "text-neutral-400",
          }}
          radius="sm"
          isSelected={isVisitorsSelected}
          size="sm"
          onValueChange={setIsVisitorsSelected}
        >
          Visitors
        </Checkbox>
      ),
      value: visitors,
    },
    // only add revenue block if revenue > 0
    ...(revenue > 0
      ? [
          {
            name: "",
            icon: (
              <Checkbox
                color="secondary"
                radius="sm"
                classNames={{
                  base: "p-0 m-0  ",
                  label: "text-neutral-400",
                }}
                size="sm"
                isSelected={isRevenueSelected}
                onValueChange={setIsRevenueSelected}
              >
                Revenue
              </Checkbox>
            ),
            value: "$" + revenue,
          },
        ]
      : []),
    {
      name: "Revenue/visitor",
      value: visitors > 0 ? "$" + (revenue / visitors).toFixed(2) : "$0",
    },
    {
      name: "Conversion rate",
      value:
        visitors > 0 ? ((revenue / visitors) * 100).toFixed(2) + "%" : "0%",
    },
    {
      name: "Bounce rate",
      value: bounceRate + "%",
    },
    {
      name: "Session time",
      value: `${(avgSessionTime / 60).toFixed(2)} min`,
    },
  ];

  return (
    <Card className="mt-2 border border-[#373737] md:col-span-2">
      <CardHeader>
        <div className="grid grid-cols-3 md:grid-cols-7 items-center">
          {headerData.map((d) => (
            <ul
              className="px-4 pr-2 my-3.5 border-r-1.5 border-r-neutral-700"
              key={d.value}
            >
              <li className="flex items-center gap-2 text-sm text-neutral-400 ">
                {d.icon && <span>{d.icon}</span>}
                {d.name}
              </li>
              <li className="text-[1.2rem] font-extrabold">{d.value}</li>
            </ul>
          ))}
          <ul className="relative pl-2.5 my-3.5 group cursor-pointer">
            <li className="flex items-center gap-2 text-sm text-neutral-400">
              Visitors now
              <span className="relative flex size-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping bg-primary rounded-full opacity-75" />
                <span className="inline-flex size-2 rounded-full bg-primary items-center justify-center" />
              </span>
            </li>
            <li className="text-[1.5rem] font-bold">{liveVisitors.length}</li>

            <span className="absolute left-0 top-full mt-1 text-sm text-neutral-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Watch in real time
            </span>
          </ul>
        </div>
      </CardHeader>
      <CardBody className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} className="outline-none">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fd366e" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#fd366e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#333"
            />

            <XAxis
              dataKey="id"
              tickFormatter={(_, idx) => data[idx].label}
              tickLine={false}
              tick={<Tick />}
            />

            <YAxis stroke="#999" />

            <Tooltip
              content={({ payload }) => (
                <CommonTooltip
                  data={payload?.[0]?.payload}
                  label={getLabel(
                    String(payload?.[0]?.payload?.timestamp),
                    duration
                  )}
                />
              )}
            />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#fd366e"
              strokeWidth={2}
              fill="url(#lineGradient)"
              isAnimationActive
              activeDot={{ r: 6 }}
              hide={!isVisitorsSelected}
            />
            <Bar
              hide={!isRevenueSelected}
              dataKey="revenue"
              fill="#e78468"
              radius={[6, 6, 0, 0]}
              barSize={25}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export default MainGraph;
