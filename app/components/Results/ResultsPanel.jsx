"use client";
import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

import { renderCategory } from "./renderers";
import { renderAdvanced } from "./renderAdvanced";
import CustomerRenderer from "./renderCustomer";
import { capitalizeWords } from "../Common/Utils";

import RenderProjectMacro from "./renderProjectMacro";
import RenderTerritoryMacro from "./renderTerritoryMacro";
import CountrySection from "./macroRender/CountrySection";
import CustomerSection from "./macroRender/CustomerSection";
import SeverityDot from "../Common/SeverityDot";
import DueDiligenceReport from "../../components/DueDiligence/DueDiligenceReport";

import {
  calculateOverallRiskFromCategories,
  calculateCountryMacroRisk,
  calculatePartnerMacroRisk,
  calculateProjectMacroRisk,
} from "../Common/riskUtils";

export default function ResultsPanel({ resultsMap, viewMode, loading }) {
  useEffect(() => {
    console.log("resultsMap changed");
  }, [resultsMap]);

  useEffect(() => {
    console.log("viewMode changed");
  }, [viewMode]);

  const countryEntry =
    viewMode === "basic" ? resultsMap.countryBasic : resultsMap.countryAdvanced;

  const overallCountryRisk =
    countryEntry?.data?.length > 0
      ? calculateCountryMacroRisk(countryEntry.data)
      : null;

  const projectEntry =
    viewMode === "basic" ? resultsMap.projectBasic : resultsMap.projectAdvanced;

  const territoryEntry =
    viewMode === "basic"
      ? resultsMap.territoryBasic
      : resultsMap.territoryAdvanced;

  // CUSTOMER ENTRY (GLOBAL)

  const customerEntry =
    viewMode === "basic"
      ? resultsMap.customerBasic
      : resultsMap.customerAdvanced;

  // OVERALL CUSTOMER RISK

  const overallPartnerRisk =
    customerEntry?.data?.length > 0
      ? calculatePartnerMacroRisk(customerEntry.data)
      : null;

  const projectMacroOverallSeverity = calculateProjectMacroRisk(
    projectEntry?.data,
    territoryEntry?.data,
  );

  const dueDiligenceCategories = [
    overallCountryRisk && { overall_severity: overallCountryRisk },
    overallPartnerRisk && { overall_severity: overallPartnerRisk },
    projectMacroOverallSeverity && {
      overall_severity: projectMacroOverallSeverity,
    },
  ].filter(Boolean);

  /* COUNTRY */
  console.count("ResultsPanel rendered");
  const hasAnyResults = Object.values(resultsMap).some(
    (section) => section && section.data && section.data.length > 0,
  );
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
  const [isCountryOpen, setIsCountryOpen] = useState();
  const [isCustomerOpen, setIsCustomerOpen] = useState(true);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [showDueDiligence, setShowDueDiligence] = useState(false);

  // const renderCountryContent = (entry) => {
  //   if (!entry) return null;
  //   const countryCount = entry.selectedCountries?.length || 0;

  //   const layoutClass =
  //     countryCount === 2 ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"; // 1 or >2 → vertical

  //   return (
  //     <div>
  //       <div className="grid grid-cols-2 gap-4 mb-4">
  //         {entry.selectedCountries.map((c, idx) => (
  //           <h2 key={idx} className="text-sm font-semibold text-gray-700">
  //             Results for {capitalizeWords(c)}
  //           </h2>
  //         ))}
  //       </div>

  //       <div className={layoutClass}>
  //         {entry.data.map((dataItem, i) => (
  //           <div key={entry.selectedCountries[i]} className="min-w-0">
  //             <h2 className="text-sm font-semibold text-gray-700 mb-2">
  //               Results for {capitalizeWords(entry.selectedCountries[i])}
  //             </h2>

  //             {dataItem.map((content, idx) =>
  //               renderCategory({
  //                 content,
  //                 index: idx,
  //                 countryName: entry.selectedCountries[i],
  //                 expandedSections,
  //                 setExpandedSections,
  //                 expandedMetrics,
  //                 setExpandedMetrics,
  //                 expandedSources,
  //                 setExpandedSources,
  //                 expandedSubIndicators,
  //                 setExpandedSubIndicators,
  //               }),
  //             )}
  //           </div>
  //         ))}
  //       </div>

  //       {viewMode === "advanced" && (
  //         <div className="mt-6">
  //           <div className={layoutClass}>
  //             {entry.selectedCountries.map((country, i) => (
  //               <div key={country}>
  //                 {renderAdvanced({
  //                   data: entry?.advancedData?.[i] || [],
  //                   countryName: country,
  //                   expandedAdvSections,
  //                   setExpandedAdvSections,
  //                   expandedQueries,
  //                   setExpandedQueries,
  //                 })}
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const renderCustomerContent = (entry) => {
    if (!entry) return null;

    // combine all partner names in SAME order as fetch

    const allNames = [
      ...(entry.suppliers || []).map((name) => ({
        name,
        type: "Supplier",
      })),
      ...(entry.customers || []).map((name) => ({
        name,
        type: "Customer",
      })),
      ...(entry.consortiumPartner
        ? [{ name: entry.consortiumPartner, type: "Consortium Partner" }]
        : []),
    ]
      .map((item) => ({
        ...item,
        name: item.name?.trim(),
      }))
      .filter((item) => item.name);

    if (!allNames.length) return null;

    return (
      <div
        className={`flex ${
          allNames.length === 2 ? "flex-row" : "flex-col"
        } gap-5`}
        onClick={(e) => e.stopPropagation()}
      >
        {allNames.map(({ name, type }, index) => {
          const custData = entry.data[index];
          if (!custData) return null;

          const safe = Array.isArray(custData) ? custData : [custData];

          const partnerRisk = calculateOverallRiskFromCategories(
            Array.isArray(custData) ? custData : [custData],
          );

          return (
            <div
              key={`${name}-${index}`}
              className={allNames.length === 2 ? "w-1/2" : "w-full"}
            >
              <div className="text-sm font-semibold mb-2">
                Results for {capitalizeWords(name)}
                {partnerRisk && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-gray-100">
                    <SeverityDot level={partnerRisk} />
                    {partnerRisk}
                  </span>
                )}
                <span className="ml-2 text-xs text-gray-500 font-normal">
                  {type}
                </span>
                {/* {entry.consortiumPartner &&
                  name.toLowerCase() ===
                    entry.consortiumPartner.toLowerCase() && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (Consortium Partner)
                    </span>
                  )} */}
              </div>

              {viewMode === "basic" &&
                safe.map((content, idx) => (
                  <CustomerRenderer
                    key={idx}
                    content={content}
                    index={idx}
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

  // PROJECT + TERRITORY

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

  // AUTO-GENERATE KEYS FOR EXPAND ALL

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

          if (Array.isArray(content.results)) {
            content.results.forEach((_, i) => {
              const hrKey = `${countryEntry.selectedCountries[bi]}_${cat}_HR_${i}`;
              keys.subIndicators[hrKey] = true;
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

            if (result.sources && result.sources.length > 0) {
              keys.customerSub[`cust-${si}-sub-${ri}-sources`] = true;
            }

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
        // Main
        keys.projectSub[`project-main-${bi}`] = true;

        (block.results || []).forEach((res, ri) => {
          // Sub
          keys.projectSub[`project-sub-${bi}-${ri}`] = true;

          // ✅ Sources (MISSING BEFORE)
          if (res.sources && res.sources.length > 0) {
            keys.projectSub[`project-src-${bi}-${ri}`] = true;
          }

          // Environment / analysis sections
          if (res.analysis && typeof res.analysis === "object") {
            Object.keys(res.analysis).forEach((_, vi) => {
              keys.projectSub[`env-${bi}-${ri}-${vi}`] = true;
            });
          }
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
        // Main
        keys.territorySub[`territory-main-${bi}`] = true;

        (block.results || []).forEach((res, ri) => {
          // Sub
          keys.territorySub[`territory-sub-${bi}-${ri}`] = true;

          // ✅ Sources (MISSING BEFORE)
          if (res.sources && res.sources.some((s) => s && s !== "N/A")) {
            keys.territorySub[`territory-src-${bi}-${ri}`] = true;
          }
        });
      });
    }

    return keys;
  };

  // EXPAND ALL

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

  // COLLAPSE ALL

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

  const handleDueDiligenceClick = () => {
    setShowDueDiligence((prev) => !prev);
  };

  const projectName =
    resultsMap.projectBasic?.projectName ||
    resultsMap.projectAdvanced?.projectName ||
    "";

  const territoryName =
    resultsMap.territoryBasic?.territoryName ||
    resultsMap.territoryAdvanced?.territoryName ||
    "";

  const projectNameSeverity =
    projectEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(projectEntry.data)
      : null;

  const territoryNameSeverity =
    territoryEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(territoryEntry.data)
      : null;

  // MAIN UI

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-56 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-6">Fetching results…</p>
        </div>
      </div>
    );
  }

  if (!loading && !hasAnyResults) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No results to display
          </h2>
          <p className="text-gray-500 mt-2">
            Your search inputs were cleared or no data was found.
            <br />
            Please select inputs and run search again.
          </p>
        </div>
      </div>
    );
  }

  const hasAtLeastOneCountry = (() => {
    const entry =
      viewMode === "basic"
        ? resultsMap.countryBasic
        : resultsMap.countryAdvanced;

    return (entry?.selectedCountries?.length || 0) >= 1;
  })();

  const hasAtLeastOneCustomer = (() => {
    const cust =
      viewMode === "basic"
        ? resultsMap.customerBasic
        : resultsMap.customerAdvanced;

    if (!cust) return false;
    const count =
      (cust.suppliers?.filter((s) => s?.trim()).length || 0) +
      (cust.customers?.filter((c) => c?.trim()).length || 0) +
      (cust.consortiumPartner?.trim() ? 1 : 0);

    return count >= 1;
  })();

  const hasSingleProject = Boolean(projectName?.trim());
  const hasSingleTerritory = Boolean(territoryName?.trim());

  const getMissingMacros = () => {
    const missing = [];

    if (!hasAtLeastOneCountry) missing.push("one Country");

    if (!hasAtLeastOneCustomer)
      missing.push("one Supplier/Customer/Consortium Partner");

    if (!projectName?.trim()) missing.push("Project Name");

    if (!territoryName?.trim()) missing.push("Territory Name");

    return missing;
  };

  return (
    <div id="print-container" className="space-y-8 ">
      <div className="flex gap-3 mb-4">
        <button
          onClick={expandAll}
          //
          className="seg-btn"
        >
          Expand All
        </button>

        <button onClick={collapseAll} className="pill-btn">
          Collapse All
        </button>

        <button
          onClick={handleDueDiligenceClick}
          className="px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
          title="View Due Diligence Report"
        >
          {showDueDiligence
            ? "Hide Due Diligence Report"
            : "View Due Diligence Report"}
        </button>
      </div>

      {showDueDiligence && (
        <DueDiligenceReport
          countryEntry={countryEntry}
          customerEntry={customerEntry}
          projectEntry={projectEntry}
          territoryEntry={territoryEntry}
          missingMacros={getMissingMacros()}
        />
      )}

      {/* ===== COUNTRY ===== */}

      <CountrySection
        entry={
          viewMode === "basic"
            ? resultsMap.countryBasic
            : resultsMap.countryAdvanced
        }
        viewMode={viewMode}
        isOpen={isCountryOpen}
        setIsOpen={setIsCountryOpen}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        expandedMetrics={expandedMetrics}
        setExpandedMetrics={setExpandedMetrics}
        expandedSources={expandedSources}
        setExpandedSources={setExpandedSources}
        expandedSubIndicators={expandedSubIndicators}
        setExpandedSubIndicators={setExpandedSubIndicators}
        expandedAdvSections={expandedAdvSections}
        setExpandedAdvSections={setExpandedAdvSections}
        expandedQueries={expandedQueries}
        setExpandedQueries={setExpandedQueries}
        overallCountryRisk={overallCountryRisk}
      />

      {/* ===== CUSTOMER ===== */}
      <CustomerSection
        entry={
          viewMode === "basic"
            ? resultsMap.customerBasic
            : resultsMap.customerAdvanced
        }
        viewMode={viewMode}
        isOpen={isCustomerOpen}
        setIsOpen={setIsCustomerOpen}
        expandedCustomerSub={expandedCustomerSub}
        setExpandedCustomerSub={setExpandedCustomerSub}
        overallPartnerRisk={overallPartnerRisk}
      />
      {/* ===== PROJECT + TERRITORY ===== */}
      {(resultsMap.projectBasic ||
        resultsMap.projectAdvanced ||
        resultsMap.territoryBasic ||
        resultsMap.territoryAdvanced) && (
        <Disclosure open={isProjectOpen} onChange={setIsProjectOpen}>
          {({ open }) => (
            <div className="border rounded-lg bg-white category-header ">
              <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
                <div className="px-4 py-2">
                  <span className="flex items-center gap-2">
                    <SeverityDot level={projectMacroOverallSeverity} />
                    {projectMacroOverallSeverity}
                  </span>

                  <span>
                    Project
                    {(projectName?.trim() || territoryName?.trim()) && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        –{" "}
                        {[projectName, territoryName]
                          .filter(Boolean)
                          .join(" / ")}
                      </span>
                    )}
                  </span>
                  {!open && (
                    <div className="ml-3 mt-0.5 text-[11px] text-gray-400">
                      Click to view Results
                    </div>
                  )}
                </div>
                <ChevronUpIcon
                  className={`${open ? "rotate-180" : ""} h-5 w-5`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="p-4">
                {/* 🔹 PROJECT CONTEXT HEADER (LIVE FROM SIDEBAR) */}
                {(projectName?.trim() || territoryName?.trim()) && (
                  <div>
                    {projectName?.trim() && (
                      <p className="text-s font-semibold text-gray-800 mb-4">
                        {/* className="mb-4 p-3 rounded-lg bg-gray-50 border" */}
                        Project Name:{" "}
                        <span className="font-normal">{projectName}</span>
                        <span className="flex items-center gap-2">
                          <SeverityDot level={projectNameSeverity} />
                          {projectNameSeverity}
                        </span>
                      </p>
                    )}

                    {territoryName?.trim() && (
                      <p className="text-s font-semibold text-gray-800 mt-1 mb-4">
                        Territory Name:{" "}
                        <span className="font-normal">{territoryName}</span>
                        <span className="flex items-center gap-2">
                          <SeverityDot level={territoryNameSeverity} />
                          {territoryNameSeverity}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {renderProjectAndTerritory(
                  viewMode === "basic"
                    ? resultsMap.projectBasic
                    : resultsMap.projectAdvanced,
                  viewMode === "basic"
                    ? resultsMap.territoryBasic
                    : resultsMap.territoryAdvanced,
                )}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      )}
    </div>
  );
}
