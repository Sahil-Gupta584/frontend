import { addToast, Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";

import DisconnectProvider from "../disconnectProvider";

import { LinkWithTraffic, TProviderFormProps } from "./stripeForm";

import { dodoSchema, TDodoForm } from "@/lib/zodSchemas";
import LinkComponent from "@/components/link";

export default function DodoForm({
  websiteId,
  refetch,
  isConnected,
}: TProviderFormProps) {
  const dodoForm = useForm<TDodoForm>({
    resolver: zodResolver(dodoSchema),
    defaultValues: { websiteId },
  });
  const onDodoSubmit = async (data: TDodoForm) => {
    const res = await axios.post(
      "/api/payments/connect-dodo",
      {
        apiKey: data.apiKey,
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
    <form onSubmit={dodoForm.handleSubmit(onDodoSubmit)}>
      <ul>
        {isConnected ? (
          <DisconnectProvider
            provider="Dodo"
            refetch={refetch}
            websiteId={websiteId}
          />
        ) : (
          <li className="space-y-4">
            <h2 className="font-bold">1. Connect Dodo</h2>
            <p className="text-desc text-sm!">
              Create a
              <LinkComponent
                href="https://app.dodopayments.com/developer/api-keys"
                text="API key"
                isBold={false}
                isIcon
                blank
              />
              and paste it below:
            </p>
            <Input
              {...dodoForm.register("apiKey")}
              variant="bordered"
              placeholder="abcd1234.***********************"
              isInvalid={!!dodoForm.formState.errors.apiKey}
              errorMessage={dodoForm.formState.errors.apiKey?.message}
            />

            <Button
              type="submit"
              isLoading={dodoForm.formState.isSubmitting}
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
