"use client";
import NextLink from "@/components/nextLink";
import { addToast, Button, Input, Tab, Tabs } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { MdArrowRightAlt } from "react-icons/md";
import { z } from "zod";

const polarSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  accessToken: z.string().min(1, "Access Token is required"),
});

type PolarFormType = z.infer<typeof polarSchema>;

export default function RevenueConnectTab({
  websiteId,
}: {
  websiteId: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PolarFormType>({
    resolver: zodResolver(polarSchema),
  });

  const onSubmit = async (data: PolarFormType) => {
    console.log("Form submitted:", data);
    const res = await axios.post(
      "/api/payments/connect-polar",
      {
        token: data.accessToken,
        orgId: data.organizationId,
        websiteId,
      },
      { validateStatus: () => true }
    );

    if (res.data.error) {
      addToast({
        color: "danger",
        title: "Error",
        description: res.data.error,
      });
    }
  };

  return (
    <Tabs aria-label="payments">
      <Tab key="polar" title="Polar">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul>
            <li className="space-y-4">
              <h2 className="font-semibold">1. Connect Polar</h2>

              <Input
                {...register("organizationId")}
                variant="bordered"
                placeholder="your-organization-id"
                label="Organization ID"
                labelPlacement="outside-top"
                isInvalid={!!errors.organizationId}
                errorMessage={errors.organizationId?.message}
                classNames={{ description: "text-sm text-desc" }}
                description={
                  <p className="flex flex-wrap items-center gap-1">
                    Go to your{" "}
                    <NextLink
                      href="https://polar.sh/dashboard"
                      text="Polar Dashboard"
                    />
                    <MdArrowRightAlt />
                    Settings
                    <MdArrowRightAlt />
                    General
                    <MdArrowRightAlt />
                    Profile and find "identifier"
                  </p>
                }
              />

              <Input
                {...register("accessToken")}
                variant="bordered"
                placeholder="polar_pat_************"
                label="Access Token"
                labelPlacement="outside-top"
                isInvalid={!!errors.accessToken}
                errorMessage={errors.accessToken?.message}
                classNames={{ description: "text-sm text-desc" }}
                description={
                  <p className="text-sm text-desc">
                    Go to your Settings <MdArrowRightAlt className="inline" />{" "}
                    General <MdArrowRightAlt className="inline" /> Developer{" "}
                    <MdArrowRightAlt className="inline" />
                    <span className="whitespace-normal break-words">
                      Token (no expiration, select "All Scopes")
                    </span>
                  </p>
                }
              />

              <Button type="submit" isLoading={isSubmitting}>
                Connect
              </Button>
            </li>

            <li>
              <h2 className="font-semibold">2. Link with traffic</h2>
            </li>
          </ul>
        </form>
      </Tab>
    </Tabs>
  );
}
