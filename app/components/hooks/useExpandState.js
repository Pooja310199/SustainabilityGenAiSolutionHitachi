import { useState } from "react";








export function useExpandState(resultsMap, viewMode) {


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

  return {

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
    expandedProjectSub,
    setExpandedProjectSub,
    expandedTerritorySub,
    setExpandedTerritorySub,
    expandedCustomerSub,
    setExpandedCustomerSub,

    isCountryOpen,
    setIsCountryOpen,
    isCustomerOpen,
    setIsCustomerOpen,
    isProjectOpen,
    setIsProjectOpen,
    expandAll,
    collapseAll
  };
}