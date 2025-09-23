import { addToast, Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { MdArrowRightAlt } from "react-icons/md";

import DisconnectProvider from "../disconnectProvider";

import { LinkWithTraffic, TProviderFormProps } from "./stripeForm";

import LinkComponent from "@/components/link";
import { polarSchema, TPolarForm } from "@/lib/zodSchemas";

export default function PolarForm({
  websiteId,
  refetch,
  isConnected,
}: TProviderFormProps) {
  const polarForm = useForm<TPolarForm>({
    resolver: zodResolver(polarSchema),
    defaultValues: { websiteId },
  });

  const onPolarSubmit = async (data: TPolarForm) => {
    const res = await axios.post(
      "/api/payments/connect-polar",
      {
        token: data.accessToken,
        orgId: data.organizationId,
        websiteId: data.websiteId,
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
    refetch();
  };

  return (
    <form onSubmit={polarForm.handleSubmit(onPolarSubmit)}>
      <ul>
        {isConnected ? (
          <DisconnectProvider
            provider="Polar"
            refetch={refetch}
            websiteId={websiteId}
          />
        ) : (
          <li className="space-y-4">
            <h2 className="font-bold">1. Connect Polar</h2>

            <Input
              {...polarForm.register("organizationId")}
              variant="bordered"
              placeholder="your-organization-id"
              label="Organization ID"
              labelPlacement="outside-top"
              isInvalid={!!polarForm.formState.errors.organizationId}
              errorMessage={polarForm.formState.errors.organizationId?.message}
              classNames={{ description: "text-sm text-desc" }}
              description={
                <p className="flex flex-wrap items-center gap-1">
                  Go to your
                  <LinkComponent
                    href="https://polar.sh/dashboard"
                    isBold={false}
                    isIcon
                    blank
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
              {...polarForm.register("accessToken")}
              variant="bordered"
              placeholder="polar_pat_************"
              label="Access Token"
              labelPlacement="outside-top"
              isInvalid={!!polarForm.formState.errors.accessToken}
              errorMessage={polarForm.formState.errors.accessToken?.message}
              classNames={{ description: "text-sm text-desc" }}
              description={
                <p className="text-sm text-desc">
                  Go to your Settings <MdArrowRightAlt className="inline" />
                  General <MdArrowRightAlt className="inline" /> Developer
                  <MdArrowRightAlt className="inline" />
                  <span className="whitespace-normal break-words">
                    Token (no expiration, select "All Scopes")
                  </span>
                </p>
              }
            />

            <Button
              type="submit"
              isLoading={polarForm.formState.isSubmitting}
              className="w-full"
            >
              Connect
            </Button>
          </li>
        )}
        <LinkWithTraffic isDisabled={!isConnected} />
      </ul>
    </form>
  );
}
