import { useCallback } from "react";

export default function useExpandCollapseAll({
  resultsMap,
  viewMode,
  setIsCountryOpen,
  setIsCustomerOpen,
  setIsProjectOpen,
  setExpandedSections,
  setExpandedMetrics,
  setExpandedSources,
  setExpandedSubIndicators,
  setExpandedAdvSections,
  setExpandedQueries,
  setExpandedProjectSub,
  setExpandedTerritorySub,
  setExpandedCustomerSub,
}) {
  const safe = (v) => (Array.isArray(v) ? v : []);

  // ============================
  // GENERATE ALL KEYS
  // ============================
  const generateAllKeysFromResults = useCallback(() => {
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

    /* ========= COUNTRY ========= */
    const countryEntry =
      viewMode === "basic"
        ? resultsMap.countryBasic
        : resultsMap.countryAdvanced;

    if (countryEntry) {
      safe(countryEntry.data).forEach((block, bi) => {
        safe(block).forEach((content) => {
          if (!content?.category) return;

          const sectionKey = `${countryEntry.selectedCountries[bi]}_${content.category}`;

          keys.sections[sectionKey] = true;
          keys.metrics[`${sectionKey}_metrics`] = true;
          keys.sources[`${sectionKey}_sources`] = true;

          Object.keys(content.metrics || {}).forEach((mKey) => {
            keys.subIndicators[`${sectionKey}_${mKey}`] = true;
          });






        });
      });
    }

















    /* ========= CUSTOMER ========= */
    const custEntry =
      viewMode === "basic"
        ? resultsMap.customerBasic
        : resultsMap.customerAdvanced;

    if (custEntry?.data) {
      custEntry.data.forEach((custArr, ci) => {
        const safeCust = Array.isArray(custArr) ? custArr : [custArr];

        safeCust.forEach((content, si) => {
          if (!content?.results) return;

          keys.customerSub[`cust-${ci}-${si}`] = true;

          content.results.forEach((result, ri) => {
            keys.customerSub[`cust-${ci}-${si}-sub-${ri}`] = true;

            if (result.sources?.length) {
              keys.customerSub[`cust-${ci}-${si}-sub-${ri}-sources`] = true;
            }

            Object.keys(result.analysis || {}).forEach((_, gi) => {
              keys.customerSub[`cust-${ci}-${si}-group-${ri}-${gi}`] = true;
            });
          });
        });
      });
    }

    /* ========= PROJECT ========= */
    const projEntry =
      viewMode === "basic"
        ? resultsMap.projectBasic
        : resultsMap.projectAdvanced;

    if (projEntry?.data) {
      projEntry.data.forEach((block, bi) => {
        keys.projectSub[`project-main-${bi}`] = true;

        (block.results || []).forEach((res, ri) => {
          keys.projectSub[`project-sub-${bi}-${ri}`] = true;

          if (res.sources?.length) {
            keys.projectSub[`project-src-${bi}-${ri}`] = true;
          }

          Object.keys(res.analysis || {}).forEach((_, vi) => {
            keys.projectSub[`env-${bi}-${ri}-${vi}`] = true;
          });
        });
      });
    }

    /* ========= TERRITORY ========= */
    const terrEntry =
      viewMode === "basic"
        ? resultsMap.territoryBasic
        : resultsMap.territoryAdvanced;

    if (terrEntry?.data) {
      terrEntry.data.forEach((block, bi) => {
        keys.territorySub[`territory-main-${bi}`] = true;

        (block.results || []).forEach((res, ri) => {
          keys.territorySub[`territory-sub-${bi}-${ri}`] = true;

          if (res.sources?.some((s) => s && s !== "N/A")) {
            keys.territorySub[`territory-src-${bi}-${ri}`] = true;
          }
        });
      });
    }

    return keys;
  }, [resultsMap, viewMode]);

  // ============================
  // EXPAND ALL
  // ============================
  const expandAll = useCallback(() => {
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
    setExpandedCustomerSub(all.customerSub);
  }, [generateAllKeysFromResults]);

  // ============================
  // COLLAPSE ALL
  // ============================
  const collapseAll = useCallback(() => {
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
    setExpandedCustomerSub({});
  }, []);

  return {
    expandAll,
    collapseAll,
  };
}
