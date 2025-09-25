"use client";
import { Tab, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FaStripeS } from "react-icons/fa";

import DodoForm from "./dodoForm";
import PolarForm from "./polarForm";
import StripeForm from "./stripeForm";

import { getWebsite } from "@/app/dashboard/[websiteId]/actions";
import PolarLogo from "@/components/polarLogo";
import { tryCatchWrapper } from "@/lib/utils/client";

export default function RevenueConnectTab({
  websiteId,
}: {
  websiteId: string;
}) {
  const { data: connectedProviders, refetch } = useQuery({
    queryKey: ["paymentProviders"],
    queryFn: async () => {
      return tryCatchWrapper({
        callback: async () => {
          const website = await getWebsite(websiteId);

          if (!website) throw new Error("Failed to get website");

          return website.paymentProviders as string[];
        },
      });
    },
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  function Title({ text, icon }: { text: string; icon: React.ReactNode }) {
    return (
      <div className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
      </div>
    );
  }

  return (
    <Tabs
      aria-label="payments"
      classNames={{
        cursor: "dark:bg-default-100",
        tabList: "dark:bg-default",
        base: "block",
        tab: "shadow-none!",
      }}
    >
      <Tab
        key="Stripe"
        title={
          <Title
            text="Stripe"
            icon={<FaStripeS className="fill-violet-500" />}
          />
        }
      >
        <StripeForm
          websiteId={websiteId}
          refetch={refetch}
          isConnected={
            connectedProviders ? connectedProviders.includes("Stripe") : false
          }
        />
      </Tab>
      <Tab key="polar" title={<Title text="Polar" icon={<PolarLogo />} />}>
        <PolarForm
          websiteId={websiteId}
          refetch={refetch}
          isConnected={
            connectedProviders ? connectedProviders.includes("Polar") : false
          }
        />
      </Tab>
      <Tab
        key="Dodo"
        title={
          <Title
            text="Dodo"
            icon={
              <img
                src="https://yt3.ggpht.com/eLGtrPf7cslZZVYuREq-NcOdKdJrsTkODlZaJUv0jvP1fmK0gCDEOR-6K37OvnA5mpnkJDx2GeM=s68-c-k-c0x00ffffff-no-rj"
                className="size-5 rounded-full"
                alt=""
              />
            }
          />
        }
      >
        <DodoForm
          websiteId={websiteId}
          refetch={refetch}
          isConnected={
            connectedProviders ? connectedProviders.includes("Dodo") : false
          }
        />
      </Tab>
    </Tabs>
  );
}
