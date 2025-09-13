import { Favicon } from "@/components/favicon";
import { Button, Select, SelectItem, SelectSection } from "@heroui/react";
import Link from "next/link";
import { IoSettingsSharp } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";
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
  data,
  isLoading,
  refetchMain,
  refetchOthers,
}: {
  websiteId: string;
  duration: string;
  setDuration: (duration: string) => void;
  data: { $id: string; domain: string }[];
  isLoading: boolean;
  refetchMain?: () => void;
  refetchOthers?: () => void;
}) {
  return (
    <div className="flex gap-4 items-end">
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
        selectorIcon={<SelectorIcon />}
        items={data}
        isLoading={isLoading}
        maxListboxHeight={400}
        renderValue={(items) =>
          items.map((item) => {
            return (
              <div
                className="font-semibold text-md flex items-center gap-2"
                key={item.textValue}
              >
                <Favicon domain={item.textValue as string} />
                {item.textValue}
              </div>
            );
          })
        }
      >
        <SelectSection showDivider>
          {data &&
            data.map((website) => (
              <SelectItem key={website.$id} textValue={website.domain}>
                <div className="font-semibold text-md flex items-center gap-2">
                  <Favicon domain={website.domain} />
                  {website.domain}
                </div>
              </SelectItem>
            ))}
        </SelectSection>
        <SelectSection className="p-0">
          <SelectItem
            key="setting"
            endContent={<IoSettingsSharp />}
            as={Link}
            href={`/dashboard/${websiteId}/settings?domain=${data ? data.find((w) => w.$id === websiteId)?.domain : ""}`}
          >
            Settings
          </SelectItem>
        </SelectSection>
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
        onSelectionChange={(keys) => {
          setDuration(Array.from(keys)[0] as string);
        }}
        labelPlacement="outside-left"
        disallowEmptySelection
      >
        {durationOptions.map((d) => (
          <SelectItem key={d.key}>{d.label}</SelectItem>
        ))}
      </Select>
      <Button
        isLoading={isLoading}
        onPress={() => {
          if (refetchMain) refetchMain();
          if (refetchOthers) refetchOthers();
        }}
        spinner={<TfiReload className="animate-spinner-ease-spin" />}
        className="bg-transparent"
      >
        {!isLoading && <TfiReload />}
      </Button>
    </div>
  );
}

export const SelectorIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path d="M8 9l4 -4l4 4" />
      <path d="M16 15l-4 4l-4 -4" />
    </svg>
  );
};
export default Filters;
