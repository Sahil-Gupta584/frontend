"use client";
import ChipComponent from "@/components/chip";
import LinkComponent from "@/components/link";

const Page = () => {
  return (
    <section className="space-y-4 max-w-3xl">
      <h2 className="font-bold text-3xl ">
        Attribute revenue with Stripe Payment Links
      </h2>
      <p className="text-gray-400! mb-6">
        In your
        <LinkComponent
          text="Stripe Payment Links"
          href="https://dashboard.stripe.com/payment-links/"
          isBold
        />
        , select a product and go to the "After Payment" tab.
      </p>
      <p className="text-gray-400!">
        For "Confirmation page", choose to redirect customers to your website
        and add
        <ChipComponent
          child="?session_id={CHECKOUT_SESSION_ID}"
          isMargin={true}
          classname="text-sm p-1 text-gray-200"
        />
        to the URL.
      </p>
      <img
        src="/images/blog-payment-link-attribution.jpg"
        alt=""
        className="rounded-2xl my-6"
      />
      <p className="text-gray-400!">
        DataFast will automatically look for the
        <ChipComponent
          child="session_id"
          isMargin={true}
          classname="text-sm p-1 text-gray-200"
        />
        in the URL and track the payment.
      </p>
    </section>
  );
};

export default Page;
