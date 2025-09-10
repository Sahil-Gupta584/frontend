"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";
import { CommonChart, CommonChartProps } from "./commonChart";
import CommonTooltip from "./commonTooltip";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface LocationChartProps {
  mapData: {
    countryCode: string;
    visitors: number;
    revenue: number;
    imageUrl: string;
  }[];
  countryData: CommonChartProps["data"];
  regionData: CommonChartProps["data"];
  cityData: CommonChartProps["data"];
}

export const classNames = {
  tabList: ["bg-transparent p-3 "],
  tabContent: "group-data-[selected=true]:text-white",
  cursor: "bg-transparent",
  panel: "p-0 h-full",
};
export default function LocationCharts({
  cityData,
  countryData,
  regionData,
  mapData,
}: LocationChartProps) {
  const getCountryDetails = (countryCode: string) => {
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

    return {
      visitors: country ? country.visitors : 0,
      color,
      revenue: country?.revenue,
      imageUrl: country?.imageUrl,
    };
  };
  const getCountryName = (code: string) => {
    if (!code || code === "-99") return "Unknown";

    try {
      return (
        new Intl.DisplayNames(["en"], { type: "region" }).of(code) || "Unknown"
      );
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card className="border border-[#373737]">
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
                    const countryDetails = getCountryDetails(countryCode);

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
                          revenue: countryDetails.revenue,
                          imageUrl: countryDetails.imageUrl,
                        })}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            {/* <Tooltip id="map-tooltip" render={() => <span>sasas</span>} /> */}

            <Tooltip
              id="map-tooltip"
              place="bottom-end"
              style={{
                padding: 0,
                background: "transparent",
              }}
              render={({ content }) => {
                // if (!content) return null;

                let parsed: any;

                try {
                  parsed = JSON.parse(content as string);
                } catch {
                  return null;
                }

                return (
                  <CommonTooltip
                    data={parsed}
                    label={getCountryName(parsed?.countryCode)}
                  />
                );
              }}
            />
          </Tab>
          <Tab key="country" title="Country">
            <CommonChart data={countryData} />
          </Tab>
          <Tab key="Region" title="Region">
            <CommonChart data={regionData} />
          </Tab>
          <Tab key="City" title="City">
            <CommonChart data={cityData} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
