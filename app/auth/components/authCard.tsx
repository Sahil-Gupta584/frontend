"use client";
import { Button, Card, CardBody } from "@heroui/react";
import { OAuthProvider } from "appwrite";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { account } from "@/appwrite/clientConfig";
import Logo from "@/components/logo";
import { useUser } from "@/lib/hooks";

function AuthCard() {
  const [domain, setDomain] = useState("");
  const user = useUser();
  const search = useSearchParams();

  useEffect(() => {
    const redirect = search.get("redirect");

    if (redirect) {
      const redirectParams = new URLSearchParams(redirect.split("?")[1]);

      setDomain(redirectParams.get("domain") || "");
    }
  }, [search]);

  function handleAuth() {
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      failure: window.location.origin + "/auth",
      success: new URL(
        search.get("redirect") || "/dashboard",
        window.location.origin,
      ).toString(),
      scopes: ["profile"],
    });
  }

  return (
    <Card className=" w-fit p-4 hover:border-primary/50 transition border border-neutral-500">
      <CardBody>
        <ul className="space-y-4 mb-4">
          <li>
            <Link
              href="/dashboard"
              className="flex gap-2 items-center font-bold text-white text-lg leading-normal"
            >
              <Logo className="h-9" />
            </Link>
          </li>
          <li className="font-extrabold text-2xl">Welcome to Insightly</li>
          <li className="text-lg text-gray-400 ">
            Create a free account to discover
            <p className="flex">
              {domain?.trim() ? (
                <p className="font-semibold flex items-center gap-[1px] text-white">
                  <img
                    className="size-2 mx-1"
                    src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
                    alt=""
                  />
                  {domain}
                </p>
              ) : (
                " your business"
              )}
              's best marketing channels.
            </p>
          </li>
        </ul>
        <Button startContent={<FcGoogle />} onPress={handleAuth}>
          Sign up with Google
        </Button>
      </CardBody>
    </Card>
  );
}

export default AuthCard;
