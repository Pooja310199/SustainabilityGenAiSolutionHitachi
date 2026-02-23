import { useState } from "react";


import { useMacroRisk } from "../hooks/useMacroRisk";
import { useExpandState } from "../hooks/useExpandState";

export function useResultsPanel(resultsMap, viewMode) {


  const countryEntry =
    viewMode === "basic" ? resultsMap.countryBasic : resultsMap.countryAdvanced;



  const customerEntry =
    viewMode === "basic"
      ? resultsMap.customerBasic
      : resultsMap.customerAdvanced;

  const projectEntry =
    viewMode === "basic" ? resultsMap.projectBasic : resultsMap.projectAdvanced;

  const territoryEntry =
    viewMode === "basic"
      ? resultsMap.territoryBasic
      : resultsMap.territoryAdvanced;



  const expand = useExpandState(resultsMap, viewMode);








  const risk = useMacroRisk(
    countryEntry,
    customerEntry,
    projectEntry,
    territoryEntry
  );


  return {
    countryEntry,
    customerEntry,
    projectEntry,
    territoryEntry,

    ...expand,
    ...risk

  };


}