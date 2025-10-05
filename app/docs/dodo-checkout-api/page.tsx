"use client";

import ChipComponent from "@/components/chip";
import CodeBlock from "@/components/codeBlock";

const codeSamples: Record<string, string> = {
  javascript: `// app/api/create-checkout/route.js
import DodoPayments from 'dodopayments';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  // If you're using Next.js 15+, use this instead:
  // const cookieStore = await cookies();
  

const client = new DodoPayments({
  bearerToken: 'My Bearer Token',
});

const checkoutSessionResponse = await client.checkoutSessions.create({
  product_cart: [...],
      metadata: {
      insightly_visitor_id: cookieStore.get('insightly_visitor_id')?.value,
      insightly_session_id: cookieStore.get('insightly_session_id')?.value,
    },
});

}`,
  python: `# app/api/create_checkout.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import DodoPayments  

app = FastAPI()

client = DodoPayments(
    bearer_token=os.getenv("DODO_BEARER_TOKEN")
)

@app.post("/api/create-checkout")
async def create_checkout(request: Request):
    cookies = request.cookies
    visitor_id = cookies.get("insightly_visitor_id")
    session_id = cookies.get("insightly_session_id")

    try:
        checkout_session = client.checkout_sessions.create({
            "product_cart": [
                # Example cart items
                {"id": "prod_xxxxx", "quantity": 1},
            ],
            "metadata": {
                "insightly_visitor_id": visitor_id,
                "insightly_session_id": session_id,
            },
        })
        return JSONResponse({"checkoutId": checkout_session["id"]})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)`,
};

function Page() {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-3xl ">
        Attribute revenue with DodoPayments Checkout API
      </h2>
      <li className="text-gray-400! mb-6">
        Pass metadata with
        <ChipComponent
          child="insightly_visitor_id"
          isMargin={true}
          classname="text-sm p-1 text-gray-200"
        />
        and
        <ChipComponent
          child="insightly_session_id"
          isMargin={true}
          classname="text-sm p-1 text-gray-200"
        />
        (cookies from Insightly) when creating a checkout session:
      </li>
      <CodeBlock codeSamples={codeSamples} />
      <p className="text-gray-400!">
        Once connected and metadata is properly passed, DataFast will
        automatically attribute revenue to the correct marketing channels.
        <b className="font-bold text-white"> No webhook setup is required.</b>
      </p>
    </section>
  );
}

export default Page;
