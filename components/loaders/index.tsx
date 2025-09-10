export function GraphLoader() {
  return (
    <div className="p-3 h-full w-full">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}
import { Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";

export function LocationSystemChartsLoader() {
  return (
    <>
      <Card className="border border-[#373737]">
        <CardHeader>
          <Skeleton className="h-6 w-32 rounded-md" />
        </CardHeader>
        <Divider />
        <CardBody className="flex justify-center items-center">
          <Skeleton className="h-72 w-full rounded-lg" />
        </CardBody>
      </Card>
      <Card className="border border-[#373737]">
        <CardHeader>
          <Skeleton className="h-6 w-32 rounded-md" />
        </CardHeader>
        <Divider />
        <CardBody className="flex justify-center items-center">
          <Skeleton className="h-72 w-full rounded-lg" />
        </CardBody>
      </Card>
    </>
  );
}
