"use client";
import RevenueConnectTab from "@/app/dashboard/new/components/revenueConnectTab";
import { Tab, Tabs } from "@heroui/react";
import { useParams, useSearchParams } from "next/navigation";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import BackBtn from "../../components/backBtn";
import GeneralTab from "./generalTab";

const Settings = () => {
  const { websiteId } = useParams<{
    websiteId: string;
    domain: string;
  }>();
  const search = useSearchParams();
  const domain = search.get("domain");
  return (
    <>
      <BackBtn
        pathname={`/dashboard/${websiteId}`}
        text="Back"
        className="mb-1 py-2"
      />
      <h2 className="text-2xl font-extrabold mb-6">
        Settings for {(domain && domain.trim()) || websiteId}
      </h2>
      <div className="flex flex-1 flex-col gap-6 lg:flex-row w-full ">
        <Tabs
          aria-label="Options"
          isVertical
          classNames={{
            tabList: "bg-transparent lg:w-52",
            tab: "font-medium justify-start",
            panel: "max-w-lg flex-1 space-y-4",
            tabWrapper: "flex-1",
          }}
        >
          <Tab
            key="General"
            title={
              <div className="flex items-center gap-2">
                <IoSettingsSharp />
                <span>General</span>
              </div>
            }
          >
            <GeneralTab websiteId={websiteId} />
          </Tab>
          <Tab
            key="Revenue"
            title={
              <div className="flex items-center gap-2">
                <AiFillDollarCircle />
                <span>Revenue</span>
              </div>
            }
          >
            <RevenueConnectTab websiteId={websiteId} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
