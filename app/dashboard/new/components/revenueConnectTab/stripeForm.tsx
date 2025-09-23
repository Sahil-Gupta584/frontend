import {
  addToast,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Input,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";

import DisconnectProvider from "../disconnectProvider";

import LinkComponent from "@/components/link";
import NextLink from "@/components/nextLink";
import { stripeSchema, TStripeForm } from "@/lib/zodSchemas";

const stripeLink =
  "https://dashboard.stripe.com/apikeys/create?name=Insightly&permissions%5B%5D=rak_webhook_write";

export type TProviderFormProps = {
  websiteId: string;
  refetch: () => void;
  isConnected: boolean;
};

export default function StripeForm({
  websiteId,
  refetch,
  isConnected,
}: TProviderFormProps) {
  const stripeForm = useForm<TStripeForm>({
    resolver: zodResolver(stripeSchema),
    defaultValues: { websiteId },
  });

  const onStripeSubmit = async (data: TStripeForm) => {
    const res = await axios.post(
      "/api/payments/connect-stripe",
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
    <form onSubmit={stripeForm.handleSubmit(onStripeSubmit)}>
      <ul>
        {isConnected ? (
          <DisconnectProvider
            provider="Stripe"
            refetch={refetch}
            websiteId={websiteId}
          />
        ) : (
          <li className="space-y-4">
            <h2 className="font-bold">1. Connect Stripe</h2>
            <p className="text-desc text-sm!">
              Create a
              <LinkComponent
                href={stripeLink}
                text="restricted API key"
                isBold={false}
                isIcon
                blank
              />
              (do not change any permissions) and paste the API key below:
            </p>
            <Input
              {...stripeForm.register("apiKey")}
              variant="bordered"
              placeholder="rk_live_**************"
              isInvalid={!!stripeForm.formState.errors.apiKey}
              errorMessage={stripeForm.formState.errors.apiKey?.message}
            />

            <Button
              type="submit"
              isLoading={stripeForm.formState.isSubmitting}
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

export function LinkWithTraffic({ isDisabled }: { isDisabled: boolean }) {
  return (
    <Card shadow="none" isDisabled={isDisabled} className="mt-4 p-4 pt-0">
      <CardHeader className="font-bold px-0">2. Link with traffic</CardHeader>
      <CardFooter className="p-0">
        <p className="text-desc text-sm!">
          Make revenue-driven decisions by linking your revenue data with your
          traffic data.
          <NextLink
            text="Get started here"
            href="/docs/revenue-attribution-guide"
            className="font-semibold text-white"
            blank
          />
          <span>(it takes 2 minutes).</span>
        </p>
      </CardFooter>
    </Card>
  );
}
