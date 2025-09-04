"use client";
import { account } from "@/appwrite/clientConfig";
import { Button } from "@heroui/button";
import { OAuthProvider } from "appwrite";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

function Auth() {
  const search = useSearchParams();

  function handleAuth() {
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      failure: window.location.origin + "/auth",
      success: new URL(
        search.get("redirect") || "/dashboard",
        window.location.origin
      ).toString(),
    });
  }

  return (
    <div className="bg-[#19191C] flex items-center justify-center min-h-screen px-4">
      <div className="bg-[#222225] rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white">AnalyticsMate</h2>
        <p className="text-neutral-400 text-center text-sm">
          Sign up to access powerful analytics insights
        </p>
        <Button
          onPress={handleAuth}
          className="bg-neutral-700 text-white w-full flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-neutral-600 transition"
        >
          <FcGoogle size={20} />
          Sign up with Google
        </Button>
      </div>
    </div>
  );
}

export default Auth;
