"use client";
import React from "react";
import SeverityPieChart from "../../Common/SeverityPieChart";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { renderCategory } from "../renderers";
import { renderAdvanced } from "../renderAdvanced";
import { capitalizeWords } from "../../Common/Utils";
import { calculateCountryMacroRisk } from "../../Common/riskUtils";
import Feedback from "../../Common/Feedback";

import SeverityDot from "../../Common/SeverityDot";
// import { calculateCountryMacroRisk } from "../../Common/riskUtils";

const CountrySection = React.memo(function CountrySection({
  entry,
  viewMode,

  overallCountryRisk,
  expandSignal,
  collapseSignal,
}) {
  React.useEffect(() => {
    console.log("CountrySection actual render");
  }, []);
  const [expandedSections, setExpandedSections] = React.useState({});
  const [expandedMetrics, setExpandedMetrics] = React.useState({});
  const [expandedSources, setExpandedSources] = React.useState({});
  const [expandedSubIndicators, setExpandedSubIndicators] = React.useState({});
  const [expandedAdvSections, setExpandedAdvSections] = React.useState({});
  const [expandedQueries, setExpandedQueries] = React.useState({});

  React.useEffect(() => {
    if (!entry) return;

    const allOpen = {};

    entry.data?.forEach((block, bi) => {
      block.forEach((content) => {
        const key = entry.selectedCountries[bi] + "_" + content.category;

        allOpen[key] = true;
      });
    });

    setExpandedSections(allOpen);
  }, [expandSignal]);

  React.useEffect(() => {
    setExpandedSections({});
    setExpandedMetrics({});
    setExpandedSources({});
    setExpandedSubIndicators({});
    setExpandedAdvSections({});
    setExpandedQueries({});
  }, [collapseSignal]);

  if (!entry) return null;

  return (
    // <Disclosure open={isOpen} onChange={setIsOpen}>
    <Disclosure>
      {({ open }) => (
        <div className="border rounded-lg bg-white category-header">
          <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
            <div className="px-4 py-2">
              {overallCountryRisk && (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span>Overall Risk:</span>
                  <SeverityDot level={overallCountryRisk} />
                  <span>{overallCountryRisk}</span>
                </div>
              )}

              <span>
                Country
                {entry.selectedCountries?.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    – {entry.selectedCountries.map(capitalizeWords).join(", ")}
                  </span>
                )}
              </span>
            </div>

            <ChevronUpIcon className={`${open ? "rotate-180" : ""} h-5 w-5`} />
          </Disclosure.Button>

          {open && (
            <Disclosure.Panel className="p-4">
              <div className="max-w-xl mx-auto bg-orange-50 border border-orange-200 text-orange-600 text-base p-3 rounded mb-6 text-center">
                ⚠️ <strong>Note:</strong> Even if the majority of categories are
                low/medium risk,
                <br />
                high-risk categories should still be carefully reviewed when
                determining overall risk of a country.
              </div>
              <div
                className={`grid gap-4 ${
                  entry.selectedCountries.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-2"
                }`}
              >
                {entry.data.map((block, i) => {
                  const countryRisk = calculateCountryMacroRisk([block]);

                  return (
                    <div key={i} className="min-w-0">
                      <Feedback
                        section="Country"
                        entityName={entry.selectedCountries[i]}
                      />

                      {countryRisk && (
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <SeverityDot level={countryRisk} />
                          {countryRisk}
                        </span>
                      )}

                      <h2 className="text-sm text-center font-semibold text-gray-700 mb-2">
                        Results for{" "}
                        {capitalizeWords(entry.selectedCountries[i])} Overall
                        Risk
                      </h2>

                      <SeverityPieChart categories={block} />
                      <h2 className="text-lg font-semibold text-gray-500 mt-6 md-2 border-b pb-1">
                        Detailed Categories
                      </h2>

                      {viewMode === "basic" &&
                        block.map((content, idx) =>
                          renderCategory({
                            content,
                            index: idx,
                            countryName: entry.selectedCountries[i],
                            expandedSections,
                            setExpandedSections,
                            expandedMetrics,
                            setExpandedMetrics,
                            expandedSources,
                            setExpandedSources,
                            expandedSubIndicators,
                            setExpandedSubIndicators,
                          }),
                        )}

                      {viewMode === "advanced" &&
                        renderAdvanced({
                          data: block,
                          countryName: entry.selectedCountries[i],
                          expandedAdvSections,
                          setExpandedAdvSections,
                          expandedQueries,
                          setExpandedQueries,
                        })}
                    </div>
                  );
                })}
              </div>
            </Disclosure.Panel>
          )}
        </div>
      )}
    </Disclosure>
  );
});

export default CountrySection;
