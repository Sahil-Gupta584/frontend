import { User } from "@/lib/types";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoGlobe } from "react-icons/go";

function AddWebsiteForm({ user }: { user: User | null }) {
  const [website, setWebsite] = useState("");
  const router = useRouter();
  function handleAddWebsite(e: any) {
    e?.preventDefault();
    if (user && user.$id) {
      router.push(`/dashboard/new?domain=${website}`);
    } else {
      router.push(`/auth?redirect=/dashboard/new?domain=${website}`);
    }
  }
  return (
    <form className="w-64 space-y-2 mx-auto" onSubmit={handleAddWebsite}>
      <Input
        startContent={
          website.trim() ? (
            <img
              className="size-5"
              src={`https://icons.duckduckgo.com/ip3/${website}.ico`}
            />
          ) : (
            <GoGlobe />
          )
        }
        placeholder="unicorn.com"
        classNames={{ input: "pl-4!" }}
        variant="bordered"
        value={website}
        onValueChange={setWebsite}
      />
      <Button
        className="w-full shadow-none!"
        radius="sm"
        color="primary"
        type="submit"
        endContent={<FaArrowRightLong />}
      >
        Add my website
      </Button>
      <p className="text-sm text-neutral-400 text-center">Try for free!</p>
    </form>
  );
}

export default AddWebsiteForm;
