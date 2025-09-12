import { Suspense } from "react";

import NewWebsite from "./components/newWebsite";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewWebsite />
    </Suspense>
  );
}

export const metadata = {
  title: "New Website",
};
