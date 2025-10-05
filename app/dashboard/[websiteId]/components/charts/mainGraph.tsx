"use client";
import { Button, Card, CardBody, CardHeader, Checkbox } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
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

import CommonTooltip from "../commonTooltip";
import GlobalMap from "../globalMap";
import { subscribeToRealtime } from "../globalMap/actions";

import AnimatedCounter from "@/components/animatedCounter";
import { TLiveVisitor, TWebsite } from "@/lib/types";
import { getLabel } from "@/lib/utils/server";

interface MainGraphProps extends TWebsite {
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
  conversionRate: number;
  totalVisitors: number;
}

function MainGraph({
  chartData,
  duration,
  avgSessionTime,
  bounceRate,
  $id,
  domain,
  conversionRate,
  totalVisitors,
}: MainGraphProps) {
  const [isVisitorsSelected, setIsVisitorsSelected] = useState(true);
  const [isRevenueSelected, setIsRevenueSelected] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState<TLiveVisitor[]>([]);
  const searchParams = useSearchParams();
  setLiveVisitors;
  const router = useRouter();
  const [showMap, setShowMap] = useState(searchParams.get("realtime") === "1");

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
    subscribeToRealtime($id, setLiveVisitors);
  }, []);

  useEffect(() => {
    if (showMap) {
      const newParams = new URLSearchParams(searchParams.toString());

      newParams.set("realtime", "1");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    } else {
      const newParams = new URLSearchParams(searchParams.toString());

      newParams.delete("realtime");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [showMap]);

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
      value: totalVisitors,
    },
    // only add revenue block if revenue > 0
    ...(revenue > 0
      ? [
          {
            name: "Revenue/visitor",
            value:
              totalVisitors > 0
                ? "$" + (revenue / totalVisitors).toFixed(2)
                : "$0",
          },
        ]
      : []),
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
    {
      name: "Conversion rate",
      value: (conversionRate || 0).toFixed(2) + "%",
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
    <>
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
            <ul
              className="relative pl-2.5 my-3.5 group cursor-pointer"
              onClick={() => setShowMap(true)}
            >
              <li className="flex items-center gap-2 text-sm text-neutral-400">
                Visitors now
                <span className="relative flex size-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-primary rounded-full opacity-75" />
                  <span className="inline-flex size-2 rounded-full bg-primary items-center justify-center" />
                </span>
              </li>
              <li className="text-[1.5rem] font-bold">
                <AnimatedCounter value={liveVisitors.length} />
              </li>

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
      <AnimatePresence>
        {showMap && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlobalMap liveVisitors={liveVisitors} domain={domain} />
              <Button
                variant="light"
                onPress={() => setShowMap(false)}
                className="absolute top-4 right-4 "
              >
                ✕
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MainGraph;
