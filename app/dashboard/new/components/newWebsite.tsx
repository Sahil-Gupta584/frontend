"use client";

import {
  addToast,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosArrowRoundUp } from "react-icons/io";

import { useTimeZones, useUser } from "../../../../lib/hooks";
import BackBtn from "../../[websiteId]/components/backBtn";
import { createDomain, isDomainExists } from "../actions";

import { AddScriptCard } from "./addScriptCard";
import RevenueConnectTab from "./revenueConnectTab";
import Title from "./tabTitle";

import { tryCatchWrapper } from "@/lib/utils/client";
import { addWebsiteSchema, TAddWebsiteForm } from "@/lib/zodSchemas";

type WebsiteData = { websiteId: string; step: string; domain: string };

export default function NewWebsite() {
  const timeZones = useTimeZones();
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<null | WebsiteData>(null);
  const router = useRouter();
  const user = useUser();
  const search = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TAddWebsiteForm>({
    resolver: zodResolver(addWebsiteSchema),
    defaultValues: {
      domain: search.get("domain") || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const selectedTimeZone = watch("timezone");

  useEffect(() => {
    async function init() {
      const step = search.get("step");
      const websiteId = search.get("websiteId");
      const domain = search.get("domain");

      if (domain && domain.trim()) setValue("domain", domain);
      if (step && websiteId && domain) {
        setWebsiteData({ step, domain, websiteId });
      }
      setIsLoading(false);
    }
    init();
  }, [search, router]);

  const onSubmit = async (formdata: TAddWebsiteForm) => {
    if (!user?.$id) return;

    return tryCatchWrapper({
      callback: async () => {
        const isDomainExistsRes = await isDomainExists(formdata.domain);

        if (isDomainExistsRes && isDomainExistsRes.rows[0]?.$id) {
          addToast({
            color: "warning",
            title: "Warning",
            description: "Website already exists.",
          });

          return;
        }

        const res = await createDomain({
          domain: formdata.domain,
          timezone: formdata.timezone,
          userId: user.$id,
        });

        if (res && res?.$id) {
          router.push(
            `/dashboard/new?step=addScript&websiteId=${res.$id}&domain=${res.domain}`
          );
          addToast({
            color: "success",
            title: "Website Added Successfully",
            description: `${formdata.domain} has been added to your dashboard.`,
          });
        }
      },
      errorMsg: "Failed to add website. Please try again.",
    });
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
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
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <Input
                  {...register("domain")}
                  label="Domain"
                  labelPlacement="outside"
                  placeholder="unicorn.com"
                  variant="bordered"
                  isInvalid={!!errors.domain}
                  errorMessage={errors.domain?.message}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                />

                <Autocomplete
                  {...register("timezone")}
                  labelPlacement="outside"
                  label="Timezone"
                  placeholder="Select timezone"
                  isLoading={isLoading}
                  inputValue={selectedTimeZone.replace("/", " - ")}
                  description="This defines what 'today' means for your reports"
                  selectedKey={selectedTimeZone}
                  onInputChange={(val) => setValue("timezone", val)}
                  onSelectionChange={(key) =>
                    setValue("timezone", key?.toString() || "")
                  }
                  variant="bordered"
                  classNames={{
                    popoverContent: "border border-default-200",
                  }}
                  items={timeZones}
                  endContent={<Time selectedTimeZone={selectedTimeZone} />}
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

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full bg-pink-600 text-white hover:bg-pink-500 rounded-xl py-3 mt-6"
                >
                  Add website
                </Button>
              </form>
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
          <AddScriptCard
            title="Install the Insightly script"
            domain={websiteData?.domain as string}
            websiteId={websiteData?.websiteId as string}
            Btn={
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
                  endContent={
                    <IoIosArrowRoundUp className="rotate-90 size-6" />
                  }
                >
                  OK, I've installed the script
                </Button>
              </CardFooter>
            }
          />
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

export function Time({ selectedTimeZone }: { selectedTimeZone: string }) {
  let timeStr = "";

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
    console.log(error);

    console.log({ selectedTimeZone });
  }

  return (
    <span className="text-gray-400 text-nowrap ">where time is {timeStr}</span>
  );
}
