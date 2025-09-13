"use client";

import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import { account } from "@/appwrite/clientConfig";
import { Favicon } from "@/components/favicon";
import { useEffect } from "react";

export default function Dashboard() {
  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      const user = await account.get();
      const res = await axios("/api/website", {
        params: { userId: user.$id, events: true },
      });

      return res.data?.websites;
    },
    enabled: false,
  });

  useEffect(() => {
    getWebsitesQuery.refetch();
  }, []);
  function getEventsByDay(events: any) {
    // Example: group by weekday
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: Record<string, any> = {};

    if (Array.isArray(events)) {
      events.forEach((e: any) => {
        const date = new Date(e.$createdAt); // adjust field name if different
        const day = days[date.getDay()];

        counts[day] = (counts[day] || 0) + 1;
      });
    }

    // Ensure all days exist (optional, for fixed-length chart)
    return days.map((d) => ({
      day: d,
      value: counts[d] || 0,
    }));
  }

  return (
    <div className="min-h-screen w-full  text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Link href="/dashboard/new" className="self-end">
          <Button
            href="/dashboard/new"
            startContent={<FaPlus />}
            className="bg-primary cursor-pointer hover:border-primary-900 border-2 border-transparent 
             transition-transform duration-150 ease-in-out 
             translate-y-0 active:translate-y-1 
             text-white w-fit self-end"
          >
            Add Website
          </Button>
        </Link>

        {/* Website cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getWebsitesQuery.isFetching &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-700 bg-[#222225] p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-5 w-32 rounded" />
                </div>
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            ))}

          {Array.isArray(getWebsitesQuery.data) &&
            getWebsitesQuery.data?.map((website) => (
              <Link
                key={website.$id}
                href={`/dashboard/${website.$id}`}
                className="cursor-pointer rounded-xl border border-neutral-700 bg-[#222225] hover:border-primary-600 transition-colors shadow-sm p-4 flex gap-2"
              >
                <div className="self-start mt-[3px]">
                  <Favicon domain={website.domain} />
                </div>

                <div className="grow">
                  <h3 className=" font-semibold">{website.domain}</h3>
                  {/* Mini chart */}
                  <div className="relative h-20">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      style={{ pointerEvents: "none" }}
                    >
                      <LineChart
                        data={getEventsByDay(website.events)}
                        className="scale-[1.03] !cursor-pointer"
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#ec4899"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span className="font-semibold text-white">
                      {website.events.length}
                    </span>
                    visitors in last 24h
                  </div>
                </div>
              </Link>
            ))}

          {getWebsitesQuery.data &&
            Array.isArray(getWebsitesQuery.data) &&
            getWebsitesQuery.data.length === 0 && (
              <p className="col-span-full text-center text-neutral-400">
                No websites added yet. Click{" "}
                <Link
                  href="/dashboard/new"
                  className="text-primary hover:underline"
                >
                  Add Website
                </Link>{" "}
                to get started 🚀
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
