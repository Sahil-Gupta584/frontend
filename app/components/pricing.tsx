"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Stripe from "stripe";

import { MODE } from "@/appwrite/serverConfig";
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";
import { User } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";
import { polarBaseUrl } from "@/lib/utils/server";
async function createCheckoutSession(mode: string) {
  try {
    const stripe = new Stripe(
      "rk_test_51RxtB51tNDBT2PI2F7D7qtbXRbJdQE92ImqICUke2THpSPRf8MWFan3UKeatCOfJYWmmuqAABMNqPuDR1YTOi0Re00JY4ceKI8"
    );
    const session = await stripe.checkout.sessions.create({
      success_url: window.location.origin,
      // mode: "subscription",
      mode: mode === "p" ? "payment" : "subscription",
      // mode: "payment",
      line_items: [
        {
          // price: "price_1SAVJ51tNDBT2PI2VK95fv4P", // onetime
          // price: "price_1S9S6j1tNDBT2PI2q3pSFUct", // susb
          price:
            mode === "p"
              ? "price_1SAVJ51tNDBT2PI2VK95fv4P"
              : "price_1S9S6j1tNDBT2PI2q3pSFUct", // susb
          quantity: 1,
        },
      ],
      metadata: {
        insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
        insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
      },
    });

    console.log("Checkout session created:", session.id);
    if (session.url) {
      window.location.href = session.url;
    }

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
export default function Pricing({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleCheckout(plan: string) {
    tryCatchWrapper({
      callback: async () => {
        if (plan === "starter") {
          router.push("/dashboard");

          return;
        }
        const res = await axios.post(
          polarBaseUrl + "/checkouts",
          {
            metadata: {
              insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
              insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
            },
            products: ["313644f9-2a08-4510-b428-939d2ec5a493"],
          },
          {
            headers: {
              Authorization:
                "Bearer polar_oat_ldH0wkxQfUFmIiLw1HXlqcpW96LWxcVy7gGD70yV2ti",
            },
          }
        );

        if (res.data?.url) {
          window.location.href = res.data.url;
        }
      },
    });
  }

  return (
    <article id="pricing">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={async () => {
            if (!user?.$id) {
              router.push(`/auth?redirect=${encodeURIComponent("/#pricing")}`);

              return;
            }
            console.log({ MODE });

            const res = await axios.post("/api/checkout", {
              productCart: [
                {
                  product_id:
                    MODE === "prod"
                      ? "pdt_FCjy9waPRfLCYi4A9GOE9"
                      : "pdt_DSA9O6S2nmuxXO00BJo8U",
                  // product_id: "pdt_XGbXVXCAo3wFJI9AbIe1I",//ont time
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

            // if (res.data.error) throw new Error(res.data.error);
            // if (!res.data.url) throw new Error("Failed to create checkout session");
            // window.location.href = res.data.url;
            // const res = await axios.post(
            //   "https://sandbox-api.polar.sh/v1/checkouts",
            //   {
            //     // products: ["bff57802-3217-4433-a7c5-5bff599e7e19"],
            //     products: ["313644f9-2a08-4510-b428-939d2ec5a493"],
            //     metadata: {
            //       insightly_session_id: "s43bc4aed-a5ae-41d9-892d-787d9b6f1e79",
            //       insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
            //     },
            //     success_url: window.location.origin,
            //   },
            //   {
            //     headers: {
            //       Authorization: `Bearer polar_oat_DaBCXBUnW7zZDTVP8j58srAV10bOFtopwjMWz3T01OM`,
            //     },
            //   }
            // );
            if (res.data?.url) {
              window.location.href = res.data.url;
            } else {
              console.log(res.data);
            }
            // const res = await createCheckoutSession();
            // if (res.url) {
            //   window.location.href = res.url;
            // }
          }}
        >
          dodo subs
        </button>
        <button
          onClick={async () => {
            if (!user?.$id) {
              router.push(`/auth?redirect=${encodeURIComponent("/#pricing")}`);

              return;
            }
            const res = await axios.post("/api/checkout", {
              productCart: [
                {
                  // product_id:
                  // MODE === "prod"
                  //   ? "pdt_FCjy9waPRfLCYi4A9GOE9"
                  //   : "pdt_DSA9O6S2nmuxXO00BJo8U",
                  product_id: "pdt_XGbXVXCAo3wFJI9AbIe1I", //ont time
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

            if (res.data?.url) {
              window.location.href = res.data.url;
            } else {
              console.log(res.data);
            }
          }}
        >
          dodo onetime
        </button>
        <button onClick={async () => createCheckoutSession("")}>
          stripe subs
        </button>
        <button onClick={async () => createCheckoutSession("p")}>
          stripe pay
        </button>
        <button
          onClick={async () => {
            const res = await axios.post(
              polarBaseUrl + "/checkouts",
              {
                metadata: {
                  insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
                  insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
                },
                products: ["bff57802-3217-4433-a7c5-5bff599e7e19"],
              },
              {
                headers: {
                  Authorization:
                    "Bearer polar_oat_ldH0wkxQfUFmIiLw1HXlqcpW96LWxcVy7gGD70yV2ti",
                },
              }
            );

            if (res.data?.url) {
              window.location.href = res.data.url;
            }
          }}
        >
          polar subs
        </button>
        <button
          onClick={async () => {
            const res = await axios.post(
              polarBaseUrl + "/checkouts",
              {
                metadata: {
                  insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
                  insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
                },
                products: ["313644f9-2a08-4510-b428-939d2ec5a493"],
              },
              {
                headers: {
                  Authorization:
                    "Bearer polar_oat_ldH0wkxQfUFmIiLw1HXlqcpW96LWxcVy7gGD70yV2ti",
                },
              }
            );

            if (res.data?.url) {
              window.location.href = res.data.url;
            }
          }}
        >
          polar pay
        </button>
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
