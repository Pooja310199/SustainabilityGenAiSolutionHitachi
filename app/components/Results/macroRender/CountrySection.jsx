"use client";
import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { renderCategory } from "../renderers";
import { renderAdvanced } from "../renderAdvanced";
import { capitalizeWords } from "../../Common/Utils";

import SeverityDot from "../../Common/SeverityDot";
import { calculateCountryMacroRisk } from "../../Common/riskUtils";

const CountrySection = React.memo(function CountrySection({
  entry,
  viewMode,
  isOpen,
  setIsOpen,

  expandedSections,
  setExpandedSections,
  expandedMetrics,
  setExpandedMetrics,
  expandedSources,
  setExpandedSources,
  expandedSubIndicators,
  setExpandedSubIndicators,
  expandedAdvSections,
  setExpandedAdvSections,
  expandedQueries,
  setExpandedQueries,
  overallCountryRisk,
}) {
  if (!entry) return null;

  return (
    <Disclosure open={isOpen} onChange={setIsOpen}>
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
                      {/* Header INSIDE each grid cell */}
                      <h2 className="text-sm font-semibold text-gray-700 mb-2">
                        Results for{" "}
                        {capitalizeWords(entry.selectedCountries[i])}
                      </h2>

                      {countryRisk && (
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <SeverityDot level={countryRisk} />
                          {countryRisk}
                        </span>
                      )}

                      {block.map((content, idx) =>
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
                    </div>
                  );
                })}
              </div>

              {/* ADVANCED MODE */}
              {viewMode === "advanced" && (
                <div className="mt-6">
                  <div
                    className={`grid gap-4 ${
                      entry.selectedCountries.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2"
                    }`}
                  >
                    {entry.selectedCountries.map((country, i) => (
                      <div key={country}>
                        {renderAdvanced({
                          data: entry.advancedData[i],
                          countryName: country,
                          expandedAdvSections,
                          setExpandedAdvSections,
                          expandedQueries,
                          setExpandedQueries,
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          )}
        </div>
      )}
    </Disclosure>
  );
});

export default CountrySection;
