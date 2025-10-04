import { Alert } from "@heroui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";

import NextLink from "@/components/nextLink";
import { TWebsite } from "@/lib/types";

export default function WaitForFirstEvent({
  websiteId,
  currentWebsite,
}: {
  websiteId: string;
  currentWebsite?: TWebsite | null;
}) {
  return (
    <Alert
      color="warning"
      icon={<FiAlertTriangle />}
      hideIcon
      className="dark:bg-[#312107]  border-warning-100 border text-sm fixed bottom-5 left-5 w-fit __className_23ba4a z-50"
    >
      <div className="flex gap-3">
        <GoAlertFill className="mt-1 text-black" fill="#eab308" />
        <ul>
          <li className="flex gap-2 font-medium text-warning-600">
            Awaiting the first event...
            <span
              role="status"
              aria-label="Loading"
              className="inline-block w-3 h-3 rounded-full  border mt- border-current border-t-transparent animate-spin text-white"
            />
          </li>
          <ol className="list-decimal list-inside text-warning-500 ">
            <li className="flex">
              Install the script using the{" "}
              <NextLink
                text="tracking code"
                href={`/dashboard/${websiteId}/settings`}
                blank
              />
            </li>
            <li>
              Visit{" "}
              <NextLink
                text={currentWebsite ? currentWebsite.domain : ""}
                blank
                href={`https://${currentWebsite ? currentWebsite.domain : ""}`}
              />
              to register the first event yourself
            </li>
            <li>Refresh your dashboard</li>
            <li>
              Still not working?{" "}
              <NextLink
                text="Contact support"
                href="https://x.com/sahil_builds"
              />
            </li>
          </ol>
        </ul>
      </div>
    </Alert>
  );
}
