"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";
import { User } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";

export default function Pricing({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleCheckout() {
    tryCatchWrapper({
      callback: async () => {
        if (!user?.$id) {
          router.push("/auth?redirect=/#pricing");

          return;
        }
        const res = await axios.post("/api/checkout", {
          productCart: [
            {
              // product_id: "pdt_FCjy9waPRfLCYi4A9GOE9", //live
              product_id: "pdt_DSA9O6S2nmuxXO00BJo8U", //test
              quantity: 1,
              amount: 9,
            },
          ],
          customer: {
            email: user.email,
            name: user.name,
          },
          return_url: window.location.origin + "/dashboard",
        });

        if (res.data.error) throw new Error(res.data.error);
        if (!res.data.url) throw new Error("Failed to create checkout session");

        window.location.href = res.data.url;
      },
    });
  }

  return (
    <article id="pricing">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <PricingTableOne
          className="bg-transparent"
          onPlanSelect={handleCheckout}
          theme={"classic"}
          plans={plans}
        />
      </div>
    </article>
  );
}
