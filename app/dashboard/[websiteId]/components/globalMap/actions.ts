import { Map } from "mapbox-gl";
import { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";

export async function getCoords(city: string, country: string) {
  const query = encodeURIComponent(`${city}, ${country}`);
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN}`
  );
  const geo = await res.json();

  return geo.features[0]?.center || null;
}

export function toggleFullscreen(
  mapContainerRef: RefObject<HTMLDivElement>,
  setIsFullScreen: Dispatch<SetStateAction<boolean>>
) {
  const elem = mapContainerRef.current;

  if (!elem) return;

  if (!document.fullscreenElement) {
    elem.requestFullscreen();
    setIsFullScreen(true);
  } else {
    document.exitFullscreen();
    setIsFullScreen(false);
  }
}

export function spin(
  isSpinning: boolean,
  map: Map,
  spinFrameRef: MutableRefObject<number | null>
) {
  if (!isSpinning) return;
  const center = map.getCenter();
  center.lng += 3;

  map.easeTo({
    center,
    duration: 1000,
    easing: (t) => t,
  });

  spinFrameRef.current = window.setTimeout(
    () => spin(isSpinning, map, spinFrameRef),
    1000
  );
}

export function formatSessionTime(lastEventTs: number | string) {
  const now = Date.now();
  const eventTime =
    typeof lastEventTs === "string"
      ? new Date(lastEventTs).getTime()
      : lastEventTs;
  const diff = Math.max(0, now - eventTime); // in ms

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}
