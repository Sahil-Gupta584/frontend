import z from "zod";

export const polarSchema = z.object({
  accessToken: z.string().min(1, "Access Token is required"),
  websiteId: z.string().min(1, "Website Id is required"),
});
export type TPolarForm = z.infer<typeof polarSchema>;

export const stripeSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  websiteId: z.string().min(1, "Website Id is required"),
});
export type TStripeForm = z.infer<typeof stripeSchema>;

export const addWebsiteSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .refine((val) => {
      const domainRegex =
        /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

      return domainRegex.test(val);
    }, "Please enter a valid domain."),
  timezone: z.string().min(1, "Timezone is required"),
});

export const dodoSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  websiteId: z.string().min(1, "Website Id is required"),
});
export type TDodoForm = z.infer<typeof dodoSchema>;

export type TAddWebsiteForm = z.infer<typeof addWebsiteSchema>;

export const eventExtraDataForm = z
  .record(
    z
      .string()
      .regex(/^[a-z0-9_-]+$/, {
        message:
          "Property names can only contain lowercase letters, numbers, underscores (_) or hyphens (-).",
      })
      .max(32, "Property names must be at most 32 characters."),
    z.string().max(255, "Property values must be at most 255 characters.")
  )
  .refine((obj) => Object.keys(obj).length <= 10, {
    message: "You can define a maximum of 10 custom parameters per event.",
  });

export const analyticsPayloadSchema = z.object({
  websiteId: z.string().min(10),
  duration: z.enum([
    "today",
    "yesterday",
    "last_24_hours",
    "last_7_days",
    "last_30_days",
    "last_12_months",
    "all_time",
  ]),
});

export type TDuration = z.infer<typeof analyticsPayloadSchema>["duration"];
