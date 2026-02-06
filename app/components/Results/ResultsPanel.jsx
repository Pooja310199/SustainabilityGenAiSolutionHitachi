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
import SeverityDot from "../Common/SeverityDot";
import {
  calculateOverallRiskFromCategories,
  calculateWorstCaseRisk,
} from "../Common/riskUtils";

// import useExpandCollapseAll from "../hooks/useExpandCollapseAll";

export default function ResultsPanel({
  resultsMap,
  viewMode,
  loading,
  // projectName,
  // territoryName,
}) {
  useEffect(() => {
    console.log("resultsMap changed");
  }, [resultsMap]);

  useEffect(() => {
    console.log("viewMode changed");
  }, [viewMode]);

  const countryEntry =
    viewMode === "basic" ? resultsMap.countryBasic : resultsMap.countryAdvanced;

  const projectEntry =
    viewMode === "basic" ? resultsMap.projectBasic : resultsMap.projectAdvanced;

  const territoryEntry =
    viewMode === "basic"
      ? resultsMap.territoryBasic
      : resultsMap.territoryAdvanced;

  // OVERALL COUNTRY RISK
  // ============================
  const overallCountryRisk = countryEntry?.data?.[0]
    ? calculateOverallRiskFromCategories(countryEntry.data[0])
    : null;

  // CUSTOMER ENTRY (GLOBAL)
  // ============================
  const customerEntry =
    viewMode === "basic"
      ? resultsMap.customerBasic
      : resultsMap.customerAdvanced;

  // OVERALL CUSTOMER RISK
  // ============================

  // ============================
  const overallCustomerRisk =
    customerEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(
          customerEntry.data.flat(1), // 🔥 THIS FIX
        )
      : null;

  const projectNameSeverity =
    projectEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(projectEntry.data)
      : null;

  const territoryNameSeverity =
    territoryEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(territoryEntry.data)
      : null;

  // ✅ FINAL PROJECT MACRO SEVERITY
  const projectMacroOverallSeverity = calculateWorstCaseRisk([
    projectNameSeverity,
    territoryNameSeverity,
  ]);

  const dueDiligenceCategories = [
    overallCountryRisk && { overall_severity: overallCountryRisk },
    overallCustomerRisk && { overall_severity: overallCustomerRisk },
    projectMacroOverallSeverity && {
      overall_severity: projectMacroOverallSeverity,
    },
  ].filter(Boolean);

  const overallDueDiligenceRisk =
    dueDiligenceCategories.length > 0
      ? calculateOverallRiskFromCategories(dueDiligenceCategories)
      : null;

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

  // ============================
  // COUNTRY RENDER
  // ============================

  // const renderCountryContent = (entry) => {
  //   if (!entry) return null;

  //   return (
  //     <div>
  //       <div className="grid grid-cols-2 gap-4 mb-4">
  //         {entry.selectedCountries.map((c, idx) => (
  //           <h2 key={idx} className="text-sm font-semibold text-gray-700">
  //             Results for {capitalizeWords(c)}
  //           </h2>
  //         ))}
  //       </div>

  //       {entry.selectedCountries.length === 1 &&
  //         entry.data[0].map((content, i) =>
  //           renderCategory({
  //             content,
  //             index: i,
  //             countryName: entry.selectedCountries[0],
  //             expandedSections,
  //             setExpandedSections,
  //             expandedMetrics,
  //             setExpandedMetrics,
  //             expandedSources,
  //             setExpandedSources,
  //             expandedSubIndicators,
  //             setExpandedSubIndicators,
  //           }),
  //         )}

  //       {entry.selectedCountries.length === 2 && (
  //         <div className="grid grid-cols-2 gap-4">
  //           {entry.data.map((dataItem, i) => (
  //             <div key={i}>
  //               {dataItem.map((content, idx) =>
  //                 renderCategory({
  //                   content,
  //                   index: idx,
  //                   countryName: entry.selectedCountries[i],
  //                   expandedSections,
  //                   setExpandedSections,
  //                   expandedMetrics,
  //                   setExpandedMetrics,
  //                   expandedSources,
  //                   setExpandedSources,
  //                   expandedSubIndicators,
  //                   setExpandedSubIndicators,
  //                 }),
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       )}

  //       {viewMode === "advanced" && (
  //         <div className="mt-6">
  //           {entry.selectedCountries.length === 1 ? (
  //             renderAdvanced({
  //               data: entry.advancedData[0],
  //               countryName: entry.selectedCountries[0],
  //               expandedAdvSections,
  //               setExpandedAdvSections,
  //               expandedQueries,
  //               setExpandedQueries,
  //             })
  //           ) : (
  //             <div className="grid grid-cols-2 gap-4">
  //               {entry.selectedCountries.map((country, i) => (
  //                 <div key={i}>
  //                   {renderAdvanced({
  //                     data: entry.advancedData[i],
  //                     countryName: country,
  //                     expandedAdvSections,
  //                     setExpandedAdvSections,
  //                     expandedQueries,
  //                     setExpandedQueries,
  //                   })}
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

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
            }),
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
                  }),
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

  const projectName =
    resultsMap.projectBasic?.projectName ||
    resultsMap.projectAdvanced?.projectName ||
    "";

  const territoryName =
    resultsMap.territoryBasic?.territoryName ||
    resultsMap.territoryAdvanced?.territoryName ||
    "";

  // ============================
  // MAIN UI
  // ============================

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

  const getRiskLabel = (severity) => {
    switch (severity) {
      case "RED":
        return "High Risk";
      case "ORANGE":
        return "Medium Risk";
      case "GREEN":
        return "Low Risk";
      default:
        return "No Data";
    }
  };

  const hasSingleCountry =
    resultsMap.countryBasic?.selectedCountries?.length === 1;

  const hasSingleCustomer = (() => {
    const cust =
      viewMode === "basic"
        ? resultsMap.customerBasic
        : resultsMap.customerAdvanced;

    if (!cust) return false;

    const count = [cust.customer1, cust.customer2, cust.partnerName].filter(
      Boolean,
    ).length;

    return count === 1;
  })();

  const hasSingleProject = Boolean(projectName?.trim());
  const hasSingleTerritory = Boolean(territoryName?.trim());

  const canShowDueDiligenceButton =
    hasSingleCountry &&
    hasSingleCustomer &&
    hasSingleProject &&
    hasSingleTerritory;

  return (
    <div id="print-container" className="space-y-8">
      <div className="flex gap-3 mb-4">
        <button
          onClick={expandAll}
          //
          className="seg-btn"
        >
          Expand All
        </button>

        <button
          onClick={collapseAll}
          // className="px-4 py-2 bg-red-600 text-white rounded-md category-header"
          className="pill-btn"
        >
          Collapse All
        </button>

        <button
          disabled={!canShowDueDiligenceButton}
          onClick={() =>
            canShowDueDiligenceButton && setShowDueDiligence((prev) => !prev)
          }
          className={`px-4 py-2 rounded-md text-sm font-semibold transition
    ${
      canShowDueDiligenceButton
        ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
          title={
            canShowDueDiligenceButton
              ? "View Due Diligence Report"
              : "Select exactly 1 Country, 1 Partner, 1 Project and 1 Territory to enable"
          }
        >
          {showDueDiligence
            ? "Hide Due Diligence Report"
            : "View Due Diligence Report"}
        </button>
      </div>

      {showDueDiligence && overallDueDiligenceRisk && (
        <div
          id="due-diligence-summary"
          className="border rounded-lg bg-white shadow-sm p-4"
        >
          <h2 className="text-md font-semibold mb-3">
            Due Diligence Report Summary
          </h2>

          <div className="space-y-3 text-sm">
            {overallCountryRisk && (
              <div className="flex justify-between items-center">
                <span>
                  <b>Country:</b>{" "}
                  {resultsMap.countryBasic?.selectedCountries?.join(", ")}
                </span>
                <span className="flex items-center gap-2">
                  <SeverityDot level={overallCountryRisk} />
                  {overallCountryRisk} – {getRiskLabel(overallCountryRisk)}
                </span>
              </div>
            )}

            {overallCustomerRisk && (
              <div className="flex justify-between items-center">
                <span>
                  {/* <b>Partner:</b> Customer / Partner */}
                  <b>Partner:</b>{" "}
                  {[
                    resultsMap.customerBasic.customer1,
                    resultsMap.customerBasic.customer2,
                    resultsMap.customerBasic.partnerName,
                  ]
                    .filter(Boolean)
                    .map(capitalizeWords)
                    .join(", ")}
                </span>
                <span className="flex items-center gap-2">
                  <SeverityDot level={overallCustomerRisk} />
                  {overallCustomerRisk} – {getRiskLabel(overallCustomerRisk)}
                </span>
              </div>
            )}

            {/* {projectMacroOverallSeverity && (
              <div className="flex justify-between items-center">
                <span>
                  <b>Project:</b>{" "}
                  {[projectName, territoryName].filter(Boolean).join(" / ")}
                </span>
                <span className="flex items-center gap-2">
                  <SeverityDot level={projectMacroOverallSeverity} />
                  {projectMacroOverallSeverity} –{" "}
                  {getRiskLabel(projectMacroOverallSeverity)}
                </span>
              </div>
            )} */}

            {projectMacroOverallSeverity && (
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span>
                    <b>Project:</b>{" "}
                    {[projectName, territoryName].filter(Boolean).join(" / ")}
                    <p className="text-gray-600">
                      Combined severity based on highest risk across Project and
                      Territory
                    </p>
                  </span>

                  <span className="flex items-center gap-2">
                    <SeverityDot level={projectMacroOverallSeverity} />
                    {projectMacroOverallSeverity} –{" "}
                    {getRiskLabel(projectMacroOverallSeverity)}
                  </span>
                </div>

                {/* Project Name Severity */}
                {projectNameSeverity && (
                  <div className="flex justify-between items-center text-xs text-gray-600 pl-4">
                    <span>Project Name</span>
                    <span className="flex items-center gap-2">
                      <SeverityDot level={projectNameSeverity} />
                      {projectNameSeverity}
                    </span>
                  </div>
                )}

                {/* Territory Severity */}
                {territoryNameSeverity && (
                  <div className="flex justify-between items-center text-xs text-gray-600 pl-4">
                    <span>Territory</span>
                    <span className="flex items-center gap-2">
                      <SeverityDot level={territoryNameSeverity} />
                      {territoryNameSeverity}
                    </span>
                  </div>
                )}
              </div>
            )}

            <hr />

            <div className="flex justify-between items-center font-semibold">
              <span>Overall Severity</span>
              <span className="flex items-center gap-2">
                <SeverityDot level={overallDueDiligenceRisk} />
                {overallDueDiligenceRisk} –{" "}
                {getRiskLabel(overallDueDiligenceRisk)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===== COUNTRY ===== */}

      {/* ===== OVERALL COUNTRY RISK ===== */}
      {overallCountryRisk && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border bg-white">
          <span className="text-sm font-semibold text-gray-700">
            Overall Country Risk:
          </span>
          <span className="flex items-center gap-2">
            <SeverityDot level={overallCountryRisk} />
            <span className="font-semibold">{overallCountryRisk}</span>
          </span>
        </div>
      )}

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
      />

      {/* ===== OVERALL CUSTOMER RISK ===== */}
      {overallCustomerRisk && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border bg-white">
          <span className="text-sm font-semibold text-gray-700">
            Overall Customer Risk:
          </span>
          <span className="flex items-center gap-2">
            <SeverityDot level={overallCustomerRisk} />
            <span className="font-semibold">{overallCustomerRisk}</span>
          </span>
        </div>
      )}

      {/* ===== CUSTOMER ===== */}
      {(resultsMap.customerBasic || resultsMap.customerAdvanced) && (
        <Disclosure open={isCustomerOpen} onChange={setIsCustomerOpen}>
          {({ open }) => (
            <div className="border rounded-lg bg-white category-header">
              <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
                {/* 
              <Disclosure.Button
                className="w-full flex justify-between items-center px-6 py-4 
           bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
              > */}
                <div className="px-4 py-2">
                  <span>
                    Partner
                    {resultsMap.customerBasic && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        –{" "}
                        {[
                          resultsMap.customerBasic.customer1,
                          resultsMap.customerBasic.customer2,
                          resultsMap.customerBasic.partnerName,
                        ]
                          .filter(Boolean)
                          .map(capitalizeWords)
                          .join(", ")}
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
                  // className={`${open ? "rotate-180" : ""} h-5 w-5`}
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    open ? "rotate-180 text-gray-600" : ""
                  }`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="p-4">
                {renderCustomerContent(
                  viewMode === "basic"
                    ? resultsMap.customerBasic
                    : resultsMap.customerAdvanced,
                )}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      )}

      {projectMacroOverallSeverity && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border bg-white">
          <span className="text-sm font-semibold text-gray-700">
            Overall Project Macro Risk:
          </span>

          <span className="flex items-center gap-2">
            <SeverityDot level={projectMacroOverallSeverity} />
            <span className="font-semibold">{projectMacroOverallSeverity}</span>
          </span>
        </div>
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
                <div className="px-4 py-2">
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
                      </p>
                    )}

                    {territoryName?.trim() && (
                      <p className="text-s font-semibold text-gray-800 mt-1 mb-4">
                        Territory Name:{" "}
                        <span className="font-normal">{territoryName}</span>
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
