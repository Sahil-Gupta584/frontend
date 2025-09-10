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

import { stripeSchema, TStripeForm } from "@/lib/zodSchemas";
import LinkComponent from "@/components/link";

const stripeLink =
  "https://dashboard.stripe.com/apikeys/create?name=Insightly&permissions%5B%5D=rak_charge_read&permissions%5B%5D=rak_subscription_read&permissions%5B%5D=rak_customer_read&permissions%5B%5D=rak_payment_intent_read&permissions%5B%5D=rak_checkout_session_read&permissions%5B%5D=rak_invoice_read&permissions%5B%5D=rak_webhook_write";

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
      { validateStatus: () => true },
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
    <Card shadow="none" isDisabled={isDisabled} className="mt-4">
      <CardHeader className="font-bold px-0">2. Link with traffic</CardHeader>
      <CardFooter className="p-0">
        <p className="text-desc text-sm!">
          Make revenue-driven decisions by linking your revenue data with your
          traffic data.
          <LinkComponent
            text="Get started here"
            href="/docs/revenue-attribution-guide"
            isBold={true}
          />
          <span>(it takes 2 minutes).</span>
        </p>
      </CardFooter>
    </Card>
  );
}
