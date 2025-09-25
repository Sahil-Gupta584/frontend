import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import { disconnectProvider } from "../actions";

import { TPaymentProviders } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";

function DisconnectProvider({
  websiteId,
  provider,
  refetch,
}: {
  provider: TPaymentProviders;
  websiteId: string;
  refetch: () => void;
}) {
  const mutation = useMutation({
    mutationKey: ["handleDisconnectProvider"],
    mutationFn: () =>
      tryCatchWrapper({
        callback: async () => {
          await disconnectProvider(websiteId, provider);
          refetch();
        },
        warningMsg: `${provider} removed successfully`,
      }),
  });

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h2 className="inline-flex gap-2 items-center">
        <FaCircleCheck className="text-green-500" /> {provider} is connected
      </h2>
      <Button
        className="w-fit border-0 text-white"
        startContent={<RxCross2 />}
        variant="ghost"
        color="danger"
        onPress={() => mutation.mutateAsync()}
        isLoading={mutation.isPending}
      >
        Disconnect
      </Button>
    </div>
  );
}

export default DisconnectProvider;
