import { account } from "@/appwrite/clientConfig";
import {
  database,
  databaseId,
  websitesCollectionId,
} from "@/appwrite/serverConfig";
import { Favicon } from "@/components/favicon";
import { Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Query } from "node-appwrite";

export const durationOptions = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_24_hours", label: "Last 24 hours" },
  { key: "last_7_days", label: "Last 7 days" },
  { key: "last_30_days", label: "Last 30 days" },
  { key: "last_12_months", label: "Last 12 months" },
  { key: "all_time", label: "All time" },
];

function Filters({
  websiteId,
  duration,
  setDuration,
}: {
  websiteId: string;
  duration: string;
  setDuration: (duration: string) => void;
}) {
  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      const user = await account.get();
      return await database.listRows({
        tableId: websitesCollectionId,
        databaseId: databaseId,
        queries: [Query.equal("userId", user.$id)],
      });
    },
  });

  return (
    <div className="flex gap-4">
      {/* Website selector */}
      <Select
        variant="flat"
        className="max-w-3xs "
        classNames={{
          trigger: "bg-transparent cursor-pointer",
          value: "font-semibold text-lg",
        }}
        placeholder="Select website"
        defaultSelectedKeys={[websiteId]}
        disallowEmptySelection
        labelPlacement="outside-left"
        items={getWebsitesQuery.data ? getWebsitesQuery.data.rows : []}
        isLoading={getWebsitesQuery.isLoading}
        renderValue={(items) =>
          items.map((item) => (
            <div
              className="font-semibold text-md flex items-center gap-2"
              key={item.data?.$id || item.key}
            >
              <Favicon domain={item.data?.domain} />
              {item.data?.domain}
            </div>
          ))
        }
      >
        {(website) => (
          <SelectItem key={website.$id}>
            <div className="font-semibold text-md flex items-center gap-2">
              <Favicon domain={website.domain} />
              {website.domain}
            </div>
          </SelectItem>
        )}
      </Select>

      {/* Duration selector */}
      <Select
        className="max-w-3xs "
        classNames={{
          trigger: "bg-transparent cursor-pointer",
          value: "font-semibold text-md",
        }}
        placeholder="Duration"
        selectedKeys={[duration]}
        onSelectionChange={(keys) => setDuration(Array.from(keys)[0] as string)}
        labelPlacement="outside-left"
        disallowEmptySelection
      >
        {durationOptions.map((d) => (
          <SelectItem key={d.key}>{d.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default Filters;
