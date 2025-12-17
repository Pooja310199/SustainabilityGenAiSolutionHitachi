"use client";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

import { renderCategory } from "./renderers";
import { renderAdvanced } from "./renderAdvanced";
import CustomerRenderer from "./renderCustomer";
import { capitalizeWords } from "../Common/Utils";
import RenderProjectMacro from "./renderProjectMacro";
import RenderTerritoryMacro from "./renderTerritoryMacro";

export default function ResultsPanel({ resultsMap, viewMode, loading }) {
  /* COUNTRY */
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [expandedSources, setExpandedSources] = useState({});
  const [expandedSubIndicators, setExpandedSubIndicators] = useState({});
  const [expandedAdvSections, setExpandedAdvSections] = useState({});
  const [expandedQueries, setExpandedQueries] = useState({});

  /* PROJECT / TERRITORY */
  const [expandedProjectSub, setExpandedProjectSub] = useState({});
  const [expandedTerritorySub, setExpandedTerritorySub] = useState({});

  /* ⭐ CUSTOMER (NEW) */
  const [expandedCustomerSub, setExpandedCustomerSub] = useState({});

  /* TOP-LEVEL TOGGLES */
  const [isCountryOpen, setIsCountryOpen] = useState(true);
  const [isCustomerOpen, setIsCustomerOpen] = useState(true);
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  // ============================
  // COUNTRY RENDER
  // ============================
  const renderCountryContent = (entry) => {
    if (!entry) return null;

    return (
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {entry.selectedCountries.map((c, idx) => (
            <h2 key={idx} className="text-sm font-semibold text-gray-700">
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
            })
          )}

        {entry.selectedCountries.length === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {entry.data.map((dataItem, i) => (
              <div key={i}>
                {dataItem.map((content, idx) =>
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
                  })
                )}
              </div>
            ))}
          </div>
        )}

        {viewMode === "advanced" && (
          <div className="mt-6">
            {entry.selectedCountries.length === 1 ? (
              renderAdvanced({
                data: entry.advancedData[0],
                countryName: entry.selectedCountries[0],
                expandedAdvSections,
                setExpandedAdvSections,
                expandedQueries,
                setExpandedQueries,
              })
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {entry.selectedCountries.map((country, i) => (
                  <div key={i}>
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
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================
  // CUSTOMER RENDER
  // ============================
  const renderCustomerContent = (entry) => {
    if (!entry) return null;

    const customers = [
      entry.customer1,
      entry.customer2,
      entry.partnerName,
    ].filter(Boolean);

    return (
      <div
        className={`flex ${
          customers.length === 2 ? "flex-row" : "flex-col"
        } gap-5`}
        onClick={(e) => e.stopPropagation()}
      >
        {customers.map((cust, custIndex) => {
          const custData = entry.data[custIndex];
          if (!custData) return null;

          const safe = Array.isArray(custData) ? custData : [custData];

          return (
            <div
              key={cust}
              className={customers.length === 2 ? "w-1/2" : "w-full"}
            >
              <div className="text-sm font-semibold mb-2">
                Results for {capitalizeWords(cust)}
                {entry.partnerName &&
                  cust.toLowerCase() === entry.partnerName.toLowerCase() && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (Consortium Partner)
                    </span>
                  )}
              </div>

              {viewMode === "basic" &&
                safe.map((content, index) => (
                  <CustomerRenderer
                    key={index}
                    content={content}
                    index={index}
                    expandedCustomerSub={expandedCustomerSub}
                    setExpandedCustomerSub={setExpandedCustomerSub}
                  />
                ))}

              {viewMode === "advanced" && (
                <div className="text-sm border p-3 rounded bg-gray-50">
                  Coming soon…
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ============================
  // PROJECT + TERRITORY
  // ============================
  const renderProjectAndTerritory = (projectEntry, territoryEntry) => (
    <div onClick={(e) => e.stopPropagation()}>
      {projectEntry?.data?.map((content, idx) => (
        <RenderProjectMacro
          key={`proj-${idx}`}
          content={content}
          index={idx}
          expandedProjectSub={expandedProjectSub}
          setExpandedProjectSub={setExpandedProjectSub}
        />
      ))}

      {territoryEntry?.data?.map((content, idx) => (
        <RenderTerritoryMacro
          key={`terr-${idx}`}
          content={content}
          index={idx}
          expandedTerritorySub={expandedTerritorySub}
          setExpandedTerritorySub={setExpandedTerritorySub}
        />
      ))}
    </div>
  );

  // ============================
  // AUTO-GENERATE KEYS FOR EXPAND ALL
  // ============================
  const generateAllKeysFromResults = () => {
    const keys = {
      sections: {},
      metrics: {},
      sources: {},
      subIndicators: {},
      advSections: {},
      queries: {},
      projectSub: {},
      territorySub: {},
      customerSub: {},
    };

    const safe = (v) => (Array.isArray(v) ? v : []);

    // COUNTRY
    const countryEntry =
      viewMode === "basic"
        ? resultsMap.countryBasic
        : resultsMap.countryAdvanced;

    if (countryEntry) {
      safe(countryEntry.data).forEach((block, bi) => {
        safe(block).forEach((content) => {
          if (!content?.category) return;

          const cat = content.category;
          const sectionKey = `${countryEntry.selectedCountries[bi]}_${cat}`;

          keys.sections[sectionKey] = true;
          keys.metrics[`${sectionKey}_metrics`] = true;
          keys.sources[`${sectionKey}_sources`] = true;

          if (content.metrics) {
            Object.keys(content.metrics).forEach((mKey) => {
              keys.subIndicators[`${sectionKey}_${mKey}`] = true;
            });
          }
        });
      });
    }

    // ⭐ CUSTOMER — NEW LOGIC
    const custEntry =
      viewMode === "basic"
        ? resultsMap.customerBasic
        : resultsMap.customerAdvanced;

    if (custEntry?.data) {
      custEntry.data.forEach((custArr, ci) => {
        const safeCust = Array.isArray(custArr) ? custArr : [custArr];

        safeCust.forEach((content, si) => {
          if (!content?.results) return;

          keys.customerSub[`cust-${si}-cat`] = true;

          content.results.forEach((result, ri) => {
            keys.customerSub[`cust-${si}-sub-${ri}`] = true;

            if (result.analysis) {
              Object.keys(result.analysis).forEach((_, gi) => {
                keys.customerSub[`cust-${si}-group-${ri}-${gi}`] = true;
              });
            }
          });
        });
      });
    }

    // PROJECT
    const projEntry =
      viewMode === "basic"
        ? resultsMap.projectBasic
        : resultsMap.projectAdvanced;

    if (projEntry?.data) {
      projEntry.data.forEach((block, bi) => {
        keys.projectSub[`project-main-${bi}`] = true;

        safe(block.results).forEach((_, ri) => {
          keys.projectSub[`project-sub-${bi}-${ri}`] = true;
        });
      });
    }

    // TERRITORY
    const terrEntry =
      viewMode === "basic"
        ? resultsMap.territoryBasic
        : resultsMap.territoryAdvanced;

    if (terrEntry?.data) {
      terrEntry.data.forEach((block, bi) => {
        keys.territorySub[`territory-main-${bi}`] = true;

        safe(block.results).forEach((_, ri) => {
          keys.territorySub[`territory-sub-${bi}-${ri}`] = true;
        });
      });
    }

    return keys;
  };

  // ============================
  // EXPAND ALL
  // ============================
  const expandAll = () => {
    setIsCountryOpen(true);
    setIsCustomerOpen(true);
    setIsProjectOpen(true);

    const all = generateAllKeysFromResults();

    setExpandedSections(all.sections);
    setExpandedMetrics(all.metrics);
    setExpandedSources(all.sources);
    setExpandedSubIndicators(all.subIndicators);
    setExpandedAdvSections(all.advSections);
    setExpandedQueries(all.queries);
    setExpandedProjectSub(all.projectSub);
    setExpandedTerritorySub(all.territorySub);
    setExpandedCustomerSub(all.customerSub); // ⭐ NEW
  };

  // ============================
  // COLLAPSE ALL
  // ============================
  const collapseAll = () => {
    setIsCountryOpen(false);
    setIsCustomerOpen(false);
    setIsProjectOpen(false);

    setExpandedSections({});
    setExpandedMetrics({});
    setExpandedSources({});
    setExpandedSubIndicators({});
    setExpandedAdvSections({});
    setExpandedQueries({});
    setExpandedProjectSub({});
    setExpandedTerritorySub({});
    setExpandedCustomerSub({}); // ⭐ NEW
  };

  // ============================
  // MAIN UI
  // ============================
  return (
    <div id="print-container" className="space-y-8">
      <div className="flex gap-3 mb-4">
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-green-600 text-white rounded-md category-header"
        >
          Expand All
        </button>

        <button
          onClick={collapseAll}
          className="px-4 py-2 bg-red-600 text-white rounded-md category-header"
        >
          Collapse All
        </button>
      </div>

      {/* ===== COUNTRY ===== */}
      {(resultsMap.countryBasic || resultsMap.countryAdvanced) && (
        <Disclosure open={isCountryOpen} onChange={setIsCountryOpen}>
          {({ open }) => (
            <div className="border rounded-lg bg-white category-header">
              <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
                <span>Country</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180" : ""} h-5 w-5`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="p-4">
                {renderCountryContent(
                  viewMode === "basic"
                    ? resultsMap.countryBasic
                    : resultsMap.countryAdvanced
                )}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      )}

      {/* ===== CUSTOMER ===== */}
      {(resultsMap.customerBasic || resultsMap.customerAdvanced) && (
        <Disclosure open={isCustomerOpen} onChange={setIsCustomerOpen}>
          {({ open }) => (
            <div className="border rounded-lg bg-white category-header">
              <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
                <span>Customer</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180" : ""} h-5 w-5`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="p-4">
                {renderCustomerContent(
                  viewMode === "basic"
                    ? resultsMap.customerBasic
                    : resultsMap.customerAdvanced
                )}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      )}

      {/* ===== PROJECT + TERRITORY ===== */}
      {(resultsMap.projectBasic ||
        resultsMap.projectAdvanced ||
        resultsMap.territoryBasic ||
        resultsMap.territoryAdvanced) && (
        <Disclosure open={isProjectOpen} onChange={setIsProjectOpen}>
          {({ open }) => (
            <div className="border rounded-lg bg-white category-header ">
              <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
                <span>Project</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180" : ""} h-5 w-5`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="p-4">
                {renderProjectAndTerritory(
                  viewMode === "basic"
                    ? resultsMap.projectBasic
                    : resultsMap.projectAdvanced,
                  viewMode === "basic"
                    ? resultsMap.territoryBasic
                    : resultsMap.territoryAdvanced
                )}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      )}
    </div>
  );
}
