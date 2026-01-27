"use client";
import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { renderCategory } from "../renderers";
import { renderAdvanced } from "../renderAdvanced";
import { capitalizeWords } from "../../Common/Utils";

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
}) {
  if (!entry) return null;

  return (
    <Disclosure open={isOpen} onChange={setIsOpen}>
      {({ open }) => (
        <div className="border rounded-lg bg-white category-header">
          <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
            <div className="px-4 py-2">
              <span>
                Country
                {entry.selectedCountries?.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    – {entry.selectedCountries.map(capitalizeWords).join(", ")}
                  </span>
                )}
              </span>

              {!open && (
                <div className="ml-3 mt-0.5 text-[11px] text-gray-400">
                  Click to view Results
                </div>
              )}
            </div>

            <ChevronUpIcon className={`${open ? "rotate-180" : ""} h-5 w-5`} />
          </Disclosure.Button>

          {open && (
            <Disclosure.Panel className="p-4">
              {/* === COUNTRY CONTENT === */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {entry.selectedCountries.map((c) => (
                  <h2 key={c} className="text-sm font-semibold text-gray-700">
                    Results for {capitalizeWords(c)}
                  </h2>
                ))}
              </div>

              {entry.selectedCountries.length === 1 &&
                entry.data[0].map((content, i) =>
                  renderCategory({
                    content,
                    index: i,
                    countryName: entry.selectedCountries[0],
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

              {entry.selectedCountries.length === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  {entry.data.map((block, i) => (
                    <div key={i}>
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
                  ))}
                </div>
              )}

              {viewMode === "advanced" && (
                <div className="mt-6">
                  {renderAdvanced({
                    data: entry.advancedData[0],
                    countryName: entry.selectedCountries[0],
                    expandedAdvSections,
                    setExpandedAdvSections,
                    expandedQueries,
                    setExpandedQueries,
                  })}
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
