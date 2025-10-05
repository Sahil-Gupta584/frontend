"use client";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";
import CommonTooltip from "../commonTooltip";

import { CommonChart, CommonChartProps } from "./commonChart";

import { getCountryName } from "@/lib/utils/client";
import { useChartTheme } from "@/hooks/useChartTheme";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface LocationChartProps {
  countryData: (CommonChartProps["data"][0] & { countryCode: string })[];
  regionData: CommonChartProps["data"];
  cityData: CommonChartProps["data"];
}

export const classNames = {
  tabList: ["bg-transparent p-3 "],
  tabContent: "group-data-[selected=true]:text-neutral-900 dark:text-white",
  cursor: "bg-transparent",
  panel: "p-0 h-full overflow-x-hidden",
};
export default function LocationCharts({
  cityData,
  countryData,
  regionData,
}: LocationChartProps) {
  const colors = useChartTheme();
  const getCountryDetails = (countryCode: string) => {
    const country = countryData.find((c) => c.countryCode == countryCode);
    let opacity = 0.1;

    if (country) {
      const maxVisitors = Math.max(...countryData.map((c) => c.visitors));
      const intensity = country.visitors / maxVisitors;

      if (intensity > 0.7) opacity = 0.9; // High
      else if (intensity > 0.4) opacity = 0.6; // Medium
      else if (intensity > 0.1) opacity = 0.25; // Low
    }

    return {
      opacity,
      ...country,
    };
  };

  return (
    <Card className="border border-divider">
      <CardBody className="h-80 overflow-hidden p-0">
        <Tabs
          aria-label="Options"
          className="border-b rounded-none w-full border-divider"
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
                        fill={colors.primary}
                        stroke={colors.grid}
                        strokeWidth={0.5}
                        style={{
                          default: {
                            fill: colors.primary,
                            fillOpacity: countryDetails.opacity,
                            stroke: colors.grid,
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            stroke: colors.primary,
                            strokeWidth: 1,
                            outline: "none",
                            border: `1px solid ${colors.primary}`,
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: colors.primary,
                            stroke: colors.primary,
                            strokeWidth: 1,
                            outline: "none",
                          },
                        }}
                        data-tooltip-id="map-tooltip" // <-- connect tooltip
                        data-tooltip-content={JSON.stringify({
                          countryCode,
                          ...countryDetails,
                        })}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            <Tooltip
              id="map-tooltip"
              place="bottom-end"
              style={{
                padding: 0,
                background: "transparent",
              }}
              render={({ content }) => {
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
