import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export default function MainGraphLoader() {
  return (
    <Card className="mt-6 border border-[#373737] md:col-span-2">
      <CardHeader className="h-24">
        <div className="grid grid-cols-3 md:grid-cols-6 items-center w-full h-full gap-4">
          {Array.from({ length: 5 }).map((d, i) => (
            <Skeleton key={i} className="grow rounded-lg w-full h-full" />
          ))}
        </div>
      </CardHeader>
      <CardBody className="h-96">
        <Skeleton className="grow rounded-lg" />
      </CardBody>
    </Card>
  );
}
