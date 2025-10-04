"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tooltip,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { GoScreenFull } from "react-icons/go";
import { GrRotateLeft } from "react-icons/gr";

import { getLiveVisitorsEvent } from "../../actions";

import { getCoords, spin, toggleFullscreen } from "./actions";
import { CustomPopup, LabeledData } from "./components";

import AnimatedCounter from "@/components/animatedCounter";
import LinkComponent from "@/components/link";
import Logo from "@/components/logo";
import { TBucket, TLiveVisitor } from "@/lib/types";
import { getCountryName } from "@/lib/utils/client";
import { normalizeReferrer } from "@/lib/utils/server";

export default function GlobalMap({
  liveVisitors,
  domain,
}: {
  liveVisitors: TLiveVisitor[];
  domain: string;
}) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const spinFrameRef = useRef<number | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ["getLiveVisitorsEvent"],
    queryFn: async () => {
      try {
        return await getLiveVisitorsEvent(liveVisitors);
      } catch (error) {
        console.log("Error to get liveVisitorsEvent:", error);

        return null;
      }
    },
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [liveVisitors]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN;

    if (!token) {
      console.log("Map box token not found");

      return;
    }
    mapboxgl.accessToken = token;

    const map = (mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current || "",
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [21.1466, 79.0889],
      maxZoom: 5,
      minZoom: 1,
      zoom: 2.5,
    }));

    return () => map.remove();
  }, []);

  // add markers
  useEffect(() => {
    if (!mapRef.current || !Array.isArray(data)) return;
    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];

    (async () => {
      for (const visitor of data) {
        const coords = await getCoords(
          visitor.city,
          getCountryName(visitor.countryCode)
        );

        if (!coords) continue;
        const [lng, lat] = coords;

        const popup = new mapboxgl.Popup({
          offset: [-50, -50],
          anchor: "top-left",
        });

        const popupNode = document.createElement("div");
        ReactDOM.createRoot(popupNode).render(
          <CustomPopup visitor={visitor} popup={popup} />
        );

        const img = document.createElement("img");
        img.src = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 2) + 1}`;
        img.className =
          "custom-marker z-10 size-20 rounded-full border-2 border-gray-500 shadow object-cover cursor-pointer";

        const marker = new mapboxgl.Marker(img)
          .setLngLat([lng, lat])
          .setPopup(popup.setDOMContent(popupNode))
          .addTo(map);

        markers.push(marker);
      }
    })();

    return () => markers.forEach((m) => m.remove());
  }, [data]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (isSpinning) {
      spin(isSpinning, map, spinFrameRef);
    } else {
      if (spinFrameRef.current) clearTimeout(spinFrameRef.current);
    }

    const stopOnMove = () => setIsSpinning(false);
    map.on("dragstart", stopOnMove);
    map.on("zoomstart", stopOnMove);

    return () => {
      map.off("dragstart", stopOnMove);
      map.off("zoomstart", stopOnMove);
      if (spinFrameRef.current) clearTimeout(spinFrameRef.current);
    };
  }, [isSpinning]);

  const realtimeMapData = useMemo(() => {
    const referrersBucket: TBucket = {};
    const countriesBucket: TBucket = {};
    const devicesBucket: TBucket = {};

    if (Array.isArray(data)) {
      for (const ev of data) {
        const normalizedReferrer = normalizeReferrer(ev.referrer);
        referrersBucket[normalizedReferrer] =
          (referrersBucket[normalizedReferrer] || 0) + 1;
        devicesBucket[ev.device] = (devicesBucket[ev.device] || 0) + 1;
        countriesBucket[ev.countryCode] =
          (countriesBucket[ev.countryCode] || 0) + 1;
      }
    }

    return {
      referrers: Object.entries(referrersBucket),
      countries: Object.entries(countriesBucket),
      devices: Object.entries(devicesBucket),
    };
  }, [data]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      <Card className="absolute left-4 top-4 border border-gray-700 ">
        <CardHeader className="p-4 block">
          <ul className="flex gap-5 items-center justify-between">
            <ul className="flex gap-2 items-center">
              <Link
                href="/?ref=realtime-map"
                className="flex gap-2 font-semibold text-gray-200 text-lg leading-normal hover:underline"
              >
                <Logo />
                Insightly
              </Link>
              <Divider
                className="w-0.5 h-4 bg-gray-500"
                orientation="vertical"
              />
              <span className="text-gray-300 font-semibold">REAL-TIME</span>
            </ul>
            <ul className="flex gap-2">
              <Tooltip
                content="Toggle auto-spin"
                className="bg-gray-600"
                showArrow
              >
                <Button
                  className="p-1 min-w-1 w-fit h-fit !rounded-md"
                  color={isSpinning ? "primary" : "default"}
                  isIconOnly
                  onPress={() => setIsSpinning(!isSpinning)}
                >
                  <GrRotateLeft />
                </Button>
              </Tooltip>
              <Tooltip
                content="Toggle full-screen"
                className="bg-gray-600"
                showArrow
              >
                <Button
                  className="p-1 min-w-1 w-fit h-fit !rounded-md"
                  color={isFullScreen ? "primary" : "default"}
                  isIconOnly
                  onPress={() =>
                    toggleFullscreen(mapContainerRef, setIsFullScreen)
                  }
                >
                  <GoScreenFull />
                </Button>
              </Tooltip>
            </ul>
          </ul>
          <ul className="inline-flex gap-2 text-sm items-center">
            <span className="relative flex size-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping bg-primary rounded-full opacity-75" />
              <span className="inline-flex size-2 rounded-full bg-primary items-center justify-center" />
            </span>
            <AnimatedCounter value={liveVisitors.length} />
            <span className="text-gray-400">visitors on</span>
            <img
              className="size-3"
              src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
              alt=""
            />
            <LinkComponent
              href={`https://${domain}`}
              text={domain}
              className="!m-0"
              blank
            />
          </ul>
        </CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-[65px_1fr] text-xs gap-y-2.5">
          <span className="text-gray-400 font-bold">Referrers</span>
          <ul className="overflow-x-auto">
            {realtimeMapData.referrers?.map((r) => (
              <LabeledData
                key={r[0]}
                count={r[1]}
                label={r[0]}
                src={`https://icons.duckduckgo.com/ip3/${r[0]}.ico`}
              />
            ))}
          </ul>
          <span className="text-gray-400 font-bold">Countries</span>
          <ul className="overflow-x-auto">
            {realtimeMapData.countries?.map((r) => (
              <LabeledData
                key={r[0]}
                count={r[1]}
                label={getCountryName(r[0])}
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${r[0]}.svg`}
              />
            ))}
          </ul>
          <span className="text-gray-400 font-bold">Devices</span>
          <ul className="overflow-x-auto">
            {realtimeMapData.devices?.map((r) => (
              <LabeledData
                key={r[0]}
                count={r[1]}
                label={r[0]}
                src={`/images/${r[0]}.png`}
              />
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
