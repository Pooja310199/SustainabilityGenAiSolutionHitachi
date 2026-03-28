import { useMacroRisk } from "../hooks/useMacroRisk";
import { useState, useMemo } from "react";

export function useResultsPanel(resultsMap, viewMode) {




  const countryEntry = useMemo(() => {
    return viewMode === "basic"
      ? resultsMap.countryBasic
      : resultsMap.countryAdvanced;
  }, [resultsMap, viewMode]);





  const customerEntry = useMemo(() => {
    return viewMode === "basic"
      ? resultsMap.customerBasic
      : resultsMap.customerAdvanced;
  }, [resultsMap, viewMode]);




  const projectEntry = useMemo(() => {
    return viewMode === "basic" ? resultsMap.projectBasic : resultsMap.projectAdvanced;
  }, [resultsMap, viewMode]);





  const territoryEntry = useMemo(() => {
    return viewMode === "basic"
      ? resultsMap.territoryBasic
      : resultsMap.territoryAdvanced;
  }, [resultsMap, viewMode]);








  const risk = useMemo(() =>
    useMacroRisk(
      countryEntry,
      customerEntry,
      projectEntry,
      territoryEntry
    ), [


    countryEntry,
    customerEntry,
    projectEntry,
    territoryEntry

  ]);


  return {
    countryEntry,
    customerEntry,
    projectEntry,
    territoryEntry,

    ...risk

  };


}































