"use client";
import { IoIosArrowRoundUp } from "react-icons/io";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Tab,
  Tabs,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { useTimeZones, useUser } from "../../../lib/hooks";
import BackBtn from "../[websiteId]/components/backBtn";
import { handleAddWebsite } from "./actions";
import RevenueConnectTab from "./components/revenueConnectTab";
import Title from "./components/tabTitle";

type WebsiteData = { websiteId: string; step: string; domain: string };
type PageProps = {
  search: Promise<WebsiteData>;
};

export default function AddWebsite() {
  const timeZones = useTimeZones();
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websiteData, setWebsiteData] = useState<null | WebsiteData>(null);
  const router = useRouter();
  const user = useUser();
  const search = useSearchParams();
  // console.log({ param, url: window.location.href });

  console.log(search);
  useEffect(() => {
    async function init() {
      const step = search.get("step");
      const websiteId = search.get("websiteId");
      const domain = search.get("domain");
      if (step && websiteId && domain) {
        console.log({ step, domain, websiteId });

        setWebsiteData({ step, domain, websiteId });
      }
      // Get user's current time zone
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSelectedTimeZone(userTimeZone);
      setIsLoading(false);
    }

    init();
  }, [search.size, router]);

  function Time() {
    let timeStr;
    try {
      const now = new Date();

      timeStr = selectedTimeZone
        ? now.toLocaleTimeString("en-US", {
            timeZone: selectedTimeZone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "";
    } catch (error) {
      console.log({ selectedTimeZone });
    }
    return (
      <span className="text-gray-400 text-nowrap ">
        where time is {timeStr}
      </span>
    );
  }
  return (
    <div className="flex flex-col items-center  max-w-lg mx-auto">
      <BackBtn text="Dashboard" pathname="/dashboard" />
      <Tabs
        aria-label="Options"
        selectedKey={websiteData?.step || "addSite"}
        onSelectionChange={(k) =>
          setWebsiteData((prev) => ({ ...prev, step: k }) as WebsiteData)
        }
        classNames={{
          base: "w-full py-4",
          tabList: ["bg-transparent px-0 "],
          tabContent: "group-data-[selected=true]:text-white",
          cursor: "bg-transparent!",
          panel: "p-0 w-full",
          tab: "opacity-100!",
        }}
      >
        <Tab
          key="addSite"
          isDisabled={Boolean(websiteData?.step)}
          title={
            <Title
              status={!websiteData?.step ? "active" : "completed"}
              text="Add site"
            />
          }
        >
          <Card className="w-full">
            <CardBody className="p-0 w-full">
              <CardHeader className="text-lg font-semibold p-4">
                Add a new website
              </CardHeader>
              <Divider />
              <div className="p-4 space-y-4">
                <Input
                  label="Domain"
                  labelPlacement="outside"
                  placeholder="unicorn.com"
                  value={domain}
                  variant="bordered"
                  onValueChange={setDomain}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                />

                <div className="flex flex-col gap-2">
                  <Autocomplete
                    labelPlacement="outside"
                    label="Timezone"
                    placeholder="Select timezone"
                    isLoading={isLoading}
                    inputValue={selectedTimeZone.replace("/", " - ")}
                    description="This defines what 'today' means for your reports"
                    selectedKey={selectedTimeZone}
                    onInputChange={setSelectedTimeZone}
                    onSelectionChange={(key) => {
                      setSelectedTimeZone(key?.toString() || "");
                    }}
                    variant="bordered"
                    classNames={{
                      popoverContent: "border border-default-200",
                    }}
                    items={timeZones}
                    endContent={<Time />}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value}>
                        <ul className="flex items-center justify-between">
                          <li>{item.value.replace("/", " - ")}</li>
                          <li className="text-gray-400">{item.label}</li>
                        </ul>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                <Button
                  onPress={async () => {
                    if (!user?.$id) return;
                    const res = await handleAddWebsite({
                      selectedTimeZone,
                      setIsSubmitting,
                      domain,
                      userId: user.$id,
                    });
                    setIsSubmitting(false);
                    if (res?.$id) {
                      router.push(
                        `/dashboard/new?step=addScript&websiteId=${res.$id}&domain=${res.domain}`,
                        {}
                      );
                    }
                  }}
                  isLoading={isSubmitting}
                  className="w-full bg-pink-600 text-white hover:bg-pink-500 rounded-xl py-3 mt-6"
                >
                  Add website
                </Button>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="addScript"
          title={
            <Title
              status={
                websiteData?.step === "addScript"
                  ? "active"
                  : websiteData?.step === "addSite"
                    ? "inactive"
                    : websiteData?.step === "revenue"
                      ? "completed"
                      : "inactive"
              }
              text="Install script"
            />
          }
          isDisabled={!websiteData?.step || websiteData?.step === "addSite"}
        >
          <Card className="w-full">
            <CardBody className="p-0 w-full">
              <CardHeader className="block text-lg font-semibold p-4">
                <p className="text-lg font-semibold">
                  Install the Insightly script
                </p>

                <p className="text-tiny text-default-500 ">
                  Paste the snippet in the {"<head>"} of your site. If you need
                  more help.
                </p>
              </CardHeader>
              <Divider />
              <div className="p-4 md:text-sm text-xs">
                <CopyBlock
                  text={`<script
  defer
  data-website-id="${websiteData?.websiteId}"
  data-domain="${websiteData?.domain}"
  src="https://${process.env.NEXT_PUBLIC_DOMAIN}/script.js">
  </script>`}
                  language="html"
                  theme={dracula}
                  wrapLongLines={true}
                />
              </div>
            </CardBody>
            <CardFooter>
              <Button
                onPress={() => {
                  const url = websiteData?.step
                    ? window.location.href.replace("addScript", "revenue")
                    : "/dashboard/new?step=revenue";
                  setWebsiteData(
                    (prev) => ({ ...prev, step: "revenue" }) as WebsiteData
                  );
                  router.push(url);
                }}
                isLoading={isSubmitting}
                className="w-full bg-pink-600 text-white hover:bg-pink-500 rounded-xl py-3 mt-6"
                endContent={<IoIosArrowRoundUp className="rotate-90 size-6" />}
              >
                OK, I've installed the script
              </Button>
            </CardFooter>
          </Card>
        </Tab>

        <Tab
          key="revenue"
          title={
            <Title
              status={websiteData?.step === "revenue" ? "active" : "inactive"}
              text="Attribute revenue (optional)"
            />
          }
          isDisabled={websiteData?.step !== "revenue"}
        >
          <Card className="w-full">
            <CardBody className="p-4 w-full">
              <RevenueConnectTab websiteId={websiteData?.websiteId as string} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
