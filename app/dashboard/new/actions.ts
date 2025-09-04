import {
  database,
  databaseId,
  websitesCollectionId,
} from "@/appwrite/serverConfig";
import { addToast } from "@heroui/react";
import { Query } from "appwrite";
import { ID } from "node-appwrite";
import { Dispatch, SetStateAction } from "react";
import z from "zod";

export async function handleAddWebsite({
  selectedTimeZone,
  setIsSubmitting,
  domain,
  userId,
}: {
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  selectedTimeZone: string;
  domain: string;
  userId: string;
}) {
  const addWebsiteSchema = z.object({
    domain: z
      .string()
      .min(1, "Domain is required")
      .refine((val) => {
        // Basic domain validation (you can enhance this)
        const domainRegex =
          /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
        return domainRegex.test(val);
      }, "Please enter a valid domain."),
    timeZone: z.string().min(1, "Timezone is required"),
  });

  try {
    setIsSubmitting(true);
    const formdata = addWebsiteSchema.parse({
      domain,
      timeZone: selectedTimeZone,
    });

    console.log("Submitting:", formdata);
    const isDomainExists = await database.listRows({
      databaseId,
      tableId: websitesCollectionId,
      queries: [Query.equal("domain", domain)],
    });
    if (isDomainExists.rows[0]?.$id) {
      addToast({
        color: "warning",
        title: "Warning",
        description: "Website already exists.",
      });
      return null;
    } else {
      const res = await database.createRow({
        databaseId: databaseId,
        tableId: websitesCollectionId,
        rowId: ID.unique(),
        data: {
          domain: formdata.domain,
          timezone: formdata.timeZone,
          userId,
        },
      });
      addToast({
        color: "success",
        title: "Website Added Successfully",
        description: `${formdata.domain} has been added to your dashboard.`,
      });
      return res;
    }
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      const firstError = `${error.issues[0].path}: ${error.issues[0].message}`;
      addToast({
        color: "danger",
        title: "Validation Error",
        description: firstError,
      });
    } else {
      // Handle other errors
      console.error("Submission error:", error);
      addToast({
        color: "danger",
        title: "Error",
        description: "Failed to add website. Please try again.",
      });
    }
  }
}
