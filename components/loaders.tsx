import { Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";
export function GraphLoader() {
  return (
    <div className="p-3 h-full w-full">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}

export function LocationSystemChartsLoader() {
  return (
    <>
      <Card className="border border-neutral-200 dark:border-[#373737]">
        <CardHeader>
          <Skeleton className="h-6 w-32 rounded-md" />
        </CardHeader>
        <Divider />
        <CardBody className="flex justify-center items-center">
          <Skeleton className="h-72 w-full rounded-lg grow" />
        </CardBody>
      </Card>
      <Card className="border border-neutral-200 dark:border-[#373737]">
        <CardHeader>
          <Skeleton className="h-6 w-32 rounded-md" />
        </CardHeader>
        <Divider />
        <CardBody className="flex justify-center items-center">
          <Skeleton className="h-72 w-full rounded-lg grow" />
        </CardBody>
      </Card>
    </>
  );
}

export function MainGraphLoader() {
  return (
    <Card className="mt-6 border border-neutral-200 dark:border-[#373737] md:col-span-2">
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

export function CustomEventsLoader() {
  return (
    <Card className="mt-6 border border-neutral-200 dark:border-[#373737] md:col-span-2">
      <CardHeader className="h-14">
        <div className="grid grid-cols-3 md:grid-cols-10 items-center w-full h-full gap-4">
          {Array.from({ length: 3 }).map((d, i) => (
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
