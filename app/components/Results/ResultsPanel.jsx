"use client";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";

import CountrySection from "./macroRender/CountrySection";
import CustomerSection from "./macroRender/CustomerSection";

import DueDiligenceReport from "../../components/DueDiligence/DueDiligenceReport";
import ProjectSection from "./macroRender/ProjectSection";
import PdfAnalysisSection from "./macroRender/PdfAnalysisSection";

import { useResultsPanel } from "../hooks/useResultsPanel";
import {
  calculateOverallRiskFromCategories,
  calculatePartnerMacroRisk,
  calculateCountryMacroRisk,
} from "../Common/riskUtils";

function ResultsPanel({
  resultsMap,
  viewMode,
  loading,
  countryAdvancedLoading,
}) {
  const [expandSignal, setExpandSignal] = useState(0);
  const [collapseSignal, setCollapseSignal] = useState(0);

  const expandAll = () => {
    setExpandSignal((v) => v + 1);
  };

  const collapseAll = () => {
    setCollapseSignal((v) => v + 1);
  };

  useEffect(() => {
    console.log("resultsMap changed");
  }, [resultsMap]);

  useEffect(() => {
    console.log("viewMode changed");
  }, [viewMode]);

  const {
    countryEntry,
    customerEntry,
    projectEntry,
    territoryEntry,
    overallCountryRisk,
    overallPartnerRisk,
    projectMacroOverallSeverity,
    projectNameSeverity,
    territoryNameSeverity,
  } = useResultsPanel(resultsMap, viewMode);

  /* COUNTRY */
  console.count("ResultsPanel rendered");

  // const hasAnyResults = useMemo(() => {
  //   return Object.values(resultsMap).some(
  //     (section) => section?.data?.length > 0,
  //   );
  // }, [resultsMap]);
  const hasAnyResults = useMemo(() => {
    return Object.values(resultsMap).some((section) => {
      if (!section) return false;

      // normal search results
      if (section?.data?.length > 0) return true;

      // document analysis result
      if (section?.report?.document_name) return true;

      return false;
    });
  }, [resultsMap]);

  const [showDueDiligence, setShowDueDiligence] = useState(false);

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
      <div className="sticky top-0 z-50 bg-yellow-50 border-b border-yellow-200 text-yellow-700 text-xs p-2 text-center font-medium shadow-sm">
        ⚠️ <strong>Disclaimer:</strong> This information is AI-generated and
        should be reviewed by a human before making any final decisions.
      </div>

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

      {resultsMap.partnerDocument && (
        <PdfAnalysisSection documentData={resultsMap.partnerDocument} />
      )}

      {/* ===== BASIC COUNTRY ===== */}
      {resultsMap.countryBasic && (
        <CountrySection
          entry={resultsMap.countryBasic}
          viewMode="basic"
          // overallCountryRisk={overallCountryRisk}
          overallCountryRisk={
            resultsMap.countryBasic?.data
              ? calculateCountryMacroRisk(resultsMap.countryBasic.data)
              : null
          }
          expandSignal={expandSignal}
          collapseSignal={collapseSignal}
        />
      )}

      {/* ===== ADVANCED COUNTRY ===== */}
      {viewMode === "advanced" && (
        <>
          {countryAdvancedLoading ? (
            <div className="border rounded-lg bg-white p-6 text-center">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-56 mx-auto"></div>
              </div>

              <p className="text-gray-500 mt-4">
                Loading advanced country data...
              </p>
            </div>
          ) : (
            resultsMap.countryAdvanced && (
              <CountrySection
                entry={resultsMap.countryAdvanced}
                viewMode="advanced"
                overallCountryRisk={
                  resultsMap.countryAdvanced?.data
                    ? calculateCountryMacroRisk(resultsMap.countryAdvanced.data)
                    : null
                }
                expandSignal={expandSignal}
                collapseSignal={collapseSignal}
              />
            )
          )}
        </>
      )}

      {/* ===== BASIC CUSTOMER ===== */}
      {resultsMap.customerBasic && (
        <>
          {" "}
          <CustomerSection
            entry={resultsMap.customerBasic}
            viewMode="basic"
            overallPartnerRisk={
              resultsMap.customerBasic?.data
                ? calculatePartnerMacroRisk(resultsMap.customerBasic.data)
                : null
            }
            expandSignal={expandSignal}
            collapseSignal={collapseSignal}
          />
        </>
      )}

      {/* ===== ADVANCED CUSTOMER ===== */}
      {viewMode === "advanced" && resultsMap.customerAdvanced && (
        <CustomerSection
          entry={resultsMap.customerAdvanced}
          viewMode="advanced"
          overallPartnerRisk={
            resultsMap.customerAdvanced?.data
              ? calculatePartnerMacroRisk(resultsMap.customerAdvanced.data)
              : null
          }
          expandSignal={expandSignal}
          collapseSignal={collapseSignal}
        />
      )}

      {/* ===== PROJECT + TERRITORY ===== */}

      {/* ===== BASIC PROJECT + TERRITORY ===== */}
      {(resultsMap.projectBasic || resultsMap.territoryBasic) && (
        <ProjectSection
          projectEntry={resultsMap.projectBasic}
          territoryEntry={resultsMap.territoryBasic}
          projectMacroOverallSeverity={projectMacroOverallSeverity}
          projectName={projectName}
          territoryName={territoryName}
          projectNameSeverity={projectNameSeverity}
          territoryNameSeverity={territoryNameSeverity}
          expandSignal={expandSignal}
          collapseSignal={collapseSignal}
          viewMode="basic"
        />
      )}

      {/* ===== ADVANCED PROJECT + TERRITORY ===== */}
      {viewMode === "advanced" &&
        (resultsMap.projectAdvanced || resultsMap.territoryAdvanced) && (
          <ProjectSection
            projectEntry={resultsMap.projectAdvanced}
            territoryEntry={resultsMap.territoryAdvanced}
            projectMacroOverallSeverity={projectMacroOverallSeverity}
            projectName={projectName}
            territoryName={territoryName}
            projectNameSeverity={projectNameSeverity}
            territoryNameSeverity={territoryNameSeverity}
            expandSignal={expandSignal}
            collapseSignal={collapseSignal}
            viewMode="advanced"
          />
        )}
    </div>
  );
}
export default React.memo(ResultsPanel);
