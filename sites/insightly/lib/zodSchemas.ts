import z from "zod";

export const polarSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
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

export type TAddWebsiteForm = z.infer<typeof addWebsiteSchema>;
