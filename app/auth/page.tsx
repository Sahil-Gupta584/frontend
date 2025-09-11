import { Suspense } from "react";

import AuthCard from "./components/authCard";

export default function Auth() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthCard />
      </Suspense>
    </section>
  );
}

export const metadata = {
  title: "Login to Insightly",
};
