import { AddScriptCard } from "@/app/dashboard/new/components/addScriptCard";
import { Time } from "@/app/dashboard/new/components/newWebsite";
import { useTimeZones } from "@/lib/hooks";
import { tryCatchWrapper } from "@/lib/utils/client";
import { addWebsiteSchema } from "@/lib/zodSchemas";
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
} from "@heroui/react";
import router from "next/router";
import { useEffect, useState } from "react";
import { deleteWebsite, getWebsite, saveWebsiteData } from "../../actions";

export interface TWebsiteData {
  domain: string;
  timezone: string;
}
function GeneralTab({ websiteId }: { websiteId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<TWebsiteData>({
    domain: "",
    timezone: "",
  });
  const timeZones = useTimeZones();

  useEffect(() => {
    async function init() {
      const doc = await getWebsite(websiteId);
      if (doc) setWebsiteData(doc);
    }
    init();
  }, [websiteId]);

  async function handleDelete() {
    const value = prompt(`Are you sure you want to delete this website?
Please type 'delete' to confirm the deletion.
      `);

    setIsLoading(true);
    await deleteWebsite(websiteId);
    if (value == "delete") {
      router.push("/dashboard");
      addToast({
        color: "primary",
        description: "Website deleted successfully",
      });
    }
    setIsLoading(false);
  }

  async function saveField({ field }: { field: "domain" | "timezone" }) {
    tryCatchWrapper({
      callback: async () => {
        setIsLoading(true);

        const data = await addWebsiteSchema.parseAsync({
          ...websiteData,
        });
        await saveWebsiteData({ $id: websiteId, ...websiteData });
        setIsLoading(false);
      },
      successMsg: `${field} updated successfully.`,
    });
  }
  return (
    <>
      <Card>
        <CardHeader>Domain</CardHeader>
        <Divider />
        <CardBody className="">
          <Input
            variant="bordered"
            value={websiteData.domain}
            onValueChange={(v) =>
              setWebsiteData((prev) => ({ ...prev, domain: v }))
            }
            description={
              <p className="text-gray-400">
                Your website ID is
                <span className="m-1 font-semibold text-white hover:underline cursor-pointer">
                  {websiteId}
                </span>
              </p>
            }
          />
          <Button
            variant="ghost"
            className="w-fit self-end"
            onPress={() => saveField({ field: "domain" })}
            isLoading={isLoading}
          >
            Save
          </Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Timezone</CardHeader>
        <Divider />
        <CardBody>
          <Autocomplete
            labelPlacement="outside"
            label="Timezone"
            placeholder="Select timezone"
            isLoading={isLoading}
            inputValue={websiteData.timezone.replace("/", " - ")}
            description="This defines what 'today' means for your reports"
            selectedKey={websiteData.timezone}
            onValueChange={(v) =>
              setWebsiteData((prev) => ({ ...prev, timezone: v }))
            }
            // onSelectionChange={(key) => {
            //   setSelectedTimeZone(key?.toString() || "");
            // }}
            variant="bordered"
            classNames={{
              popoverContent: "border border-default-200",
            }}
            items={timeZones}
            endContent={<Time selectedTimeZone={websiteData.timezone} />}
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
            variant="ghost"
            className="w-fit self-end"
            onPress={() => saveField({ field: "timezone" })}
            isLoading={isLoading}
          >
            Save
          </Button>
        </CardBody>
      </Card>
      <AddScriptCard
        domain={websiteData.domain}
        title="Analytics script"
        websiteId={websiteId}
        Btn={
          <CardFooter>
            <p className="text-desc">
              Tip:
              <span className="underline">
                proxy the script through your own domain
              </span>
              &nbsp;to avoid ad blockers.
            </p>
          </CardFooter>
        }
      />
      <Button
        onPress={handleDelete}
        color="danger"
        className="w-full"
        isLoading={isLoading}
      >
        Delete
      </Button>
    </>
  );
}

export default GeneralTab;
