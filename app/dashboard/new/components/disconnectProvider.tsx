import { database, databaseId, websitesTableId } from "@/appwrite/serverConfig";
import { TPaymentProviders } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Query } from "node-appwrite";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

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
          const website = await database.getRow({
            databaseId,
            rowId: websiteId,
            tableId: websitesTableId,
            queries: [Query.select(["paymentProviders"])],
          });

          const updatedProviders = (website.paymentProviders || []).filter(
            (p: string) => p !== provider
          );

          // update row
          await database.updateRow({
            databaseId,
            rowId: websiteId,
            tableId: websitesTableId,
            data: {
              paymentProviders: updatedProviders,
            },
          });
          refetch();
        },
        successMsg: `${provider} removed successfully`,
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
