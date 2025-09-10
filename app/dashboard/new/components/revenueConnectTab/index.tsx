"use client";
import { database, databaseId, websitesTableId } from "@/appwrite/serverConfig";
import PolarLogo from "@/components/polarLogo";
import { Tab, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Query } from "node-appwrite";
import React from "react";
import { FaStripeS } from "react-icons/fa";
import PolarForm from "./polarForm";
import StripeForm from "./stripeForm";

export default function RevenueConnectTab({
  websiteId,
}: {
  websiteId: string;
}) {
  const { data: connectedProviders, refetch } = useQuery({
    queryKey: ["paymentProviders"],
    queryFn: async () => {
      const website = await database.getRow({
        databaseId,
        tableId: websitesTableId,
        rowId: websiteId,
        queries: [Query.select(["paymentProviders"])],
      });
      return website.paymentProviders as string[];
    },
    enabled: false,
  });
  refetch();

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
    </Tabs>
  );
}
