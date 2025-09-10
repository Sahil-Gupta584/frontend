import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { CopyBlock, dracula } from "react-code-blocks";

export function AddScriptCard({
  Btn,
  title,
  websiteId,
  domain,
}: {
  title: string;
  websiteId: string;
  Btn?: React.ReactNode;
  domain: string;
}) {
  return (
    <Card className="w-full">
      <CardBody className="p-0 w-full">
        <CardHeader className="block text-lg font-semibold p-4">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-tiny text-default-500 ">
            Paste the snippet in the {"<head>"} of your site. If you need more
            help.
          </p>
        </CardHeader>
        <Divider />
        <div className="p-4 md:text-sm text-xs">
          <CopyBlock
            text={`<script
  defer
  data-website-id="${websiteId}"
  data-domain="${domain}"
  src="https://${process.env.NEXT_PUBLIC_DOMAIN}/script.js">
  </script>`}
            language="html"
            theme={dracula}
            wrapLongLines={true}
          />
        </div>
      </CardBody>
      {Btn ? Btn : ""}
    </Card>
  );
}
