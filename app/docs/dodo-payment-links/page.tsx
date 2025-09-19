"use client";
import LinkComponent from "@/components/link";

const Page = () => {
  return (
    <section className="space-y-4 max-w-3xl">
      <h2 className="font-bold text-3xl ">
        Attribute revenue with DodoPayment Links
      </h2>
      <p className="text-gray-400! mb-6">
        In your
        <LinkComponent
          text="Dodo Payments Dashboard"
          href="https://app.dodopayments.com/products"
          isBold
        />
        , click on share button of your product.
      </p>
      <p className="text-gray-400!">add your website in "Redirect URL".</p>
      <img
        src="/images/payment-providers/checkout-images/dodo.png"
        alt=""
        className="rounded-2xl my-6"
      />
      <p className="text-gray-400!">
        Insightly will automatically track the payment.
      </p>
    </section>
  );
};

export default Page;
