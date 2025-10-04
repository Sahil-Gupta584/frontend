import { faker } from "@faker-js/faker";
import { Button, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useEffect, useState } from "react";

import { formatSessionTime } from "./actions";

import { TEvent } from "@/lib/types";
import { getCountryName } from "@/lib/utils/client";

export function LabeledData({
  label,
  src,
  count,
}: {
  src: string;
  label: string;
  count?: string | number;
}) {
  return (
    <li
      key={label}
      className="flex gap-1 bg-neutral-800 hover:bg-primary-50/10 cursor-pointer rounded-xs px-1.5 py-[2px] w-fit items-center capitalize"
    >
      <img className="size-3" src={src} alt="" />
      {label} {count ? count : ""}
    </li>
  );
}
function SessionTime({ lastEventTs }: { lastEventTs: number | string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(formatSessionTime(lastEventTs));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastEventTs]);

  return <span>{time}</span>;
}

export function CustomPopup({
  visitor,
  popup,
}: {
  visitor: TEvent;
  popup: mapboxgl.Popup;
}) {
  function CapitalizedSpan({ text }: { text: string }) {
    return <span className=" capitalize whitespace-nowrap">{text}</span>;
  }
  return (
    <Card className="flex gap-4 items-center w-fit p-4 ">
      <CardHeader className="p-0">
        <div className="pl-24">
          <p className="font-semibold text-medium whitespace-nowrap">
            {faker.person.fullName()}
          </p>

          <ul className="grid [grid-template-columns:repeat(2,1fr)] gapy-1 gap-x-6 text-sm mr-10">
            <li className="flex gap-2 items-center">
              <img
                alt=""
                className="size-3"
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${visitor.countryCode}.svg`}
              />
              <CapitalizedSpan
                text={`${visitor.city}, ${getCountryName(visitor.countryCode)}`}
              />
            </li>

            <li className="flex gap-2 items-center">
              <img
                alt=""
                className="size-3"
                src={`/images/${visitor.os}.png`}
              />
              <CapitalizedSpan text={visitor.os} />
            </li>

            <li className="flex gap-2 items-center">
              <img
                alt=""
                className="size-3"
                src={`/images/${visitor.device}.png`}
              />
              <CapitalizedSpan text={visitor.device} />
            </li>

            <li className="flex gap-2 items-center">
              <img
                alt=""
                className="size-3"
                src={`https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/${visitor.browser}/${visitor.browser}_64x64.png`}
              />
              <CapitalizedSpan text={visitor.browser} />
            </li>
          </ul>
        </div>
        <Button
          className="bg-transparent absolute right-0 top-0"
          isIconOnly
          onPress={() => popup.remove()}
        >
          ✕
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="block p-0 text-xs space-y-2">
        <p className="flex items-center justify-between">
          <span>Referrer:</span>
          <LabeledData
            label={visitor.referrer}
            src={`https://icons.duckduckgo.com/ip3/${visitor.referrer}.ico`}
          />
        </p>
        <li className="flex items-center justify-between">
          <span>Current URL:</span>
          <span className="bg-neutral-600 rounded-sm py-px px-[5px]">
            {new URL(visitor.href).pathname}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Total visits:</span>
          <span>{visitor.totalVisit}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Session Time:</span>
          <SessionTime lastEventTs={visitor.lastEventTs} />
        </li>
      </CardBody>
    </Card>
  );
}
