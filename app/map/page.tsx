"use client";
import mapboxgl, { Map, TargetFeature } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

export default function MapboxExample() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map | null>(null);

  const [selectedFeature, setSelectedFeature] = useState<TargetFeature>();

  const selectedFeatureRef = useRef<TargetFeature>();

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
      center: [-98, 38.88],
      maxZoom: 5,
      minZoom: 1,
      zoom: 2.5,
    }));

    map.on("style.load", () => {
      map.addInteraction("click", {
        type: "click",
        target: { layerId: "airport" },
        handler: ({ feature }) => {
          if (!feature) return;

          if (selectedFeatureRef.current) {
            map.setFeatureState(selectedFeatureRef.current, {
              selected: false,
            });
          }
          map.setFeatureState(feature, { selected: true });
          setSelectedFeature(feature);
        },
      });

      // Clicking on the map will deselect the selected feature
      map.addInteraction("map-click", {
        type: "click",
        handler: () => {
          if (selectedFeatureRef.current) {
            map.setFeatureState(selectedFeatureRef.current, {
              selected: false,
            });
            setSelectedFeature(undefined);
          }
        },
      });

      // Hovering over a feature will highlight it
      map.addInteraction("mouseenter", {
        type: "mouseenter",
        target: { layerId: "airport" },
        handler: ({ feature }) => {
          if (!feature) return;
          map.setFeatureState(feature, { highlight: true });
          map.getCanvas().style.cursor = "pointer";
        },
      });

      // Moving the mouse away from a feature will remove the highlight
      map.addInteraction("mouseleave", {
        type: "mouseleave",
        target: { layerId: "airport" },
        handler: ({ feature }) => {
          if (!feature) return;

          map.setFeatureState(feature, { highlight: false });
          map.getCanvas().style.cursor = "";

          return false;
        },
      });
    });

    return () => map.remove();
  }, []);

  // Sync Ref with State
  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      <div
        className="map-overlay"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "230px",
          padding: "10px",
          color: "#1a2224",
          fontSize: "12px",
          lineHeight: "20px",
          fontFamily: "sans-serif",
        }}
      >
        {selectedFeature && (
          <div
            className="map-overlay-inner"
            style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "3px",
            }}
          >
            <code>${selectedFeature.properties.name}</code>
            <hr />
            {Object.entries(selectedFeature.properties).map(([key, value]) => (
              <li key={key}>
                <b>{key}</b>: {value.toString()}
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
