"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { CommonChart, CommonChartProps } from "./commonChart";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface MapChartProps {
  mapData: {
    countryCode: string;
    visitors: number;
  }[];
  countryData: CommonChartProps["data"];
  regionData: CommonChartProps["data"];
  cityData: CommonChartProps["data"];
}

export const classNames = {
  tabList: ["bg-transparent p-3 "],
  tabContent: "group-data-[selected=true]:text-white",
  cursor: "bg-transparent",
  panel: "p-0",
};
export default function MapChart({
  cityData,
  countryData,
  regionData,
  mapData,
}: MapChartProps) {
  const getCountryVisitorsAndColor = (countryCode: string) => {
    const country = mapData.find((c) => c.countryCode == countryCode);
    let color = "#1d1d21"; // No traffic - dark gray

    if (country) {
      // Color intensity based on visitor count
      const maxVisitors = Math.max(...mapData.map((c) => c.visitors));
      const intensity = country.visitors / maxVisitors;

      if (intensity > 0.7)
        color = "#fd366e"; // High
      else if (intensity > 0.4)
        color = "#fd366eb3"; // Medium
      else if (intensity > 0.1) color = "#fd366e38"; // Low
    }
    return { visitors: country ? country.visitors : 0, color };
  };

  return (
    <Card className="flex-1 border-neutral-700 ">
      <CardBody className="h-80 overflow-hidden p-0">
        <Tabs
          aria-label="Options"
          className=" border-b-[#ffffff26] border-b-[1px] rounded-none w-full"
          classNames={classNames}
          color="secondary"
        >
          <Tab key="map" title={<span>Map</span>}>
            <ComposableMap
              projection="geoMercator"
              width={800}
              height={400}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryCode = geo.properties["ISO3166-1-Alpha-2"];
                    const countryDetails =
                      getCountryVisitorsAndColor(countryCode);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={countryDetails.color}
                        stroke="#4A5568"
                        strokeWidth={0.5}
                        style={{
                          default: {
                            fill: countryDetails.color,
                            stroke: "#4A5568",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            stroke: "#EC4899",
                            strokeWidth: 1,
                            outline: "none",
                            border: "1px solid #ec4899",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "#EC4899",
                            stroke: "#EC4899",
                            strokeWidth: 1,
                            outline: "none",
                          },
                        }}
                        data-tooltip-id="map-tooltip" // <-- connect tooltip
                        data-tooltip-content={JSON.stringify({
                          countryCode,
                          visitors: countryDetails.visitors,
                        })}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </Tab>
          <Tab key="country" title="Country">
            <CommonChart data={countryData} renderFlag={true} scale={true} />
          </Tab>
          <Tab key="Region" title="Region">
            <CommonChart data={regionData} renderFlag={true} scale={true} />
          </Tab>
          <Tab key="City" title="City">
            <CommonChart data={cityData} renderFlag={true} scale={true} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
