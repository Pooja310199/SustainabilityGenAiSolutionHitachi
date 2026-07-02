"use client";
import React, { useState, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ResultsPanel from "./components/Results/ResultsPanel";
import LoadingOverlay from "./components/Common/LoadingOverlay";

// ✅ CHANGE 1 — defined once outside, never recreated on re-render
const EMPTY_RESULTS = {
  countryBasic: null,
  countryAdvanced: null,
  customerBasic: null,
  customerAdvanced: null,
  projectBasic: null,
  projectAdvanced: null,
  territoryBasic: null,
  territoryAdvanced: null,
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [countryAdvancedLoading, setCountryAdvancedLoading] = useState(false);
  const [viewMode, setViewMode] = useState("basic");
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ CHANGE 1 — uses stable reference instead of inline object
  const [resultsMap, setResultsMap] = useState(EMPTY_RESULTS);
  React.useEffect(() => {
    console.log("customerAdvanced:", resultsMap.customerAdvanced);
  }, [resultsMap]);

  // ----------- COUNTRY FETCH -----------
  const fetchCountryData = async (country, type = "basic") => {
    try {
      const suffix = type === "advanced" ? "_advanced" : "";
      const res = await fetch(
        `/mockData/${country.toLowerCase()}${suffix}.json`,
      );
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  };

  // ----------- CUSTOMER FETCH -----------
  const fetchCustomerFile = async (name) => {
    try {
      const safeName = name?.trim();
      if (!safeName) return { error: "Invalid name provided" };
      const fileName = safeName.toLowerCase().replace(/\s+/g, "-");
      const res = await fetch(`/mockData/customers/${fileName}.json`);
      if (!res.ok) throw new Error("File not found");
      return await res.json();
    } catch {
      return { error: `No data found for ${name}` };
    }
  };

  // ----------- CUSTOMER ADVANCED FETCH -----------
  const fetchCustomerAdvancedFile = async (name) => {
    try {
      const safeName = name?.trim();
      if (!safeName) return null;

      const fileName = safeName.toLowerCase().replace(/\s+/g, "-");

      const res = await fetch(`/mockData/CustomersAdvance/${fileName}.json`);

      if (!res.ok) throw new Error("File not found");

      const data = await res.json();

      // ✅ MUST return array
      return Array.isArray(data) ? data : [data];
    } catch {
      return null; // ✅ DO NOT return {error}
    }
  };

  // ----------- PROJECT FETCH -----------
  const fetchProjectFile = async (name, type = "basic") => {
    try {
      const suffix = type === "advanced" ? "_advanced" : "";
      const res = await fetch(
        `/mockData/Project/${name.toLowerCase()}${suffix}.json`,
      );
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { error: `No project data found for ${name}` };
    }
  };

  // ----------- TERRITORY FETCH -----------
  const fetchTerritoryFile = async (name, type = "basic") => {
    try {
      const suffix = type === "advanced" ? "_advanced" : "";
      const res = await fetch(
        `/mockData/territories/${name.toLowerCase()}${suffix}.json`,
      );
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { error: `No territory data found for ${name}` };
    }
  };

  // ----------- CLEAR RESULTS -----------
  const clearResultsForMacro = useCallback((macro) => {
    setResultsMap((prev) => ({
      ...prev,
      ...(macro === "Country" && { countryBasic: null, countryAdvanced: null }),
      ...(macro === "Customer" && {
        customerBasic: null,
        customerAdvanced: null,
      }),
      ...(macro === "Project" && {
        projectBasic: null,
        projectAdvanced: null,
        territoryBasic: null,
        territoryAdvanced: null,
      }),
    }));
  }, []);

  const abortRef = useRef(null);

  // ----------- BASIC SEARCH -----------
  const onBasicSearch = useCallback(async (formData) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const {
      selectedCountries = [],
      suppliers = [],
      customers = [],
      consortiumPartner = "",
      projectName,
      territoryName,
    } = formData;

    setHasSearched(true);
    setViewMode("basic");
    setLoading(true);

    try {
      // ✅ CHANGE 2 — only build what changed, merge into previous state
      const updates = {};

      // -------- COUNTRY --------
      if (selectedCountries.length > 0) {
        const basic = await Promise.all(
          selectedCountries.map((c) => fetchCountryData(c, "basic")),
        );
        updates.countryBasic = {
          macro: "Country",
          mode: "Basic",
          selectedCountries,
          data: basic,
        };
      } else {
        updates.countryBasic = null;
      }

      // -------- PARTNER --------
      const allPartnerNames = [...suppliers, ...customers, consortiumPartner]
        .map((n) => n.trim())
        .filter(Boolean);

      if (allPartnerNames.length > 0) {
        const basic = await Promise.all(allPartnerNames.map(fetchCustomerFile));
        updates.customerBasic = {
          macro: "Partner",
          mode: "Basic",
          data: basic,
          suppliers,
          customers,
          consortiumPartner,
        };
      } else {
        updates.customerBasic = null;
      }

      // -------- PROJECT --------
      if (projectName?.trim()) {
        const basic = await fetchProjectFile(projectName, "basic");
        updates.projectBasic = {
          macro: "Project",
          mode: "Basic",
          projectName,
          data: Array.isArray(basic) ? basic : [basic],
        };
      } else {
        updates.projectBasic = null;
      }

      // -------- TERRITORY --------
      if (territoryName?.trim()) {
        const basic = await fetchTerritoryFile(territoryName, "basic");
        updates.territoryBasic = {
          macro: "Territory",
          mode: "Basic",
          territoryName,
          data: Array.isArray(basic) ? basic : [basic],
        };
      } else {
        updates.territoryBasic = null;
      }

      // ✅ merge only updated slots — untouched slots keep their reference
      setResultsMap((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------- ADVANCED SEARCH -----------
  // ----------- ADVANCED SEARCH -----------
  const onAdvanceSearch = useCallback(async (formData) => {
    await onBasicSearch(formData);
    // ✅ CHANGE 2 — abort controller added here too
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const {
      selectedCountries = [],
      suppliers = [],
      customers = [],
      consortiumPartner = "",
      projectName,
      territoryName,
    } = formData;

    setHasSearched(true);
    setViewMode("advanced");
    setLoading(true);

    try {
      // ✅ CHANGE 2 — only build what changed, merge into previous state
      const updates = {};

      // -------- COUNTRY --------

      // -------- COUNTRY --------
      // -------- COUNTRY --------
      setCountryAdvancedLoading(true);

      try {
        if (selectedCountries.length > 0) {
          const advanced = await Promise.all(
            selectedCountries.map((c) => fetchCountryData(c, "advanced")),
          );

          updates.countryAdvanced = {
            macro: "Country",
            mode: "Advanced",
            selectedCountries,
            data: advanced,
          };
        } else {
          updates.countryAdvanced = null;
        }
      } finally {
        setCountryAdvancedLoading(false);
      }
      // -------- PARTNER --------
      const allPartnerNames = [...suppliers, ...customers, consortiumPartner]
        .map((n) => n?.trim())
        .filter(Boolean);

      if (allPartnerNames.length > 0) {
        const advanced = (
          await Promise.all(
            allPartnerNames.map((name) => fetchCustomerAdvancedFile(name)),
          )
        ).filter(Boolean);
        updates.customerAdvanced = {
          macro: "Partner",
          mode: "Advanced",
          data: advanced,
          suppliers,
          customers,
          consortiumPartner,
        };
      } else {
        updates.customerAdvanced = null;
      }

      // -------- PROJECT --------
      if (projectName?.trim()) {
        const advanced = await fetchProjectFile(projectName, "advanced");
        updates.projectAdvanced = {
          macro: "Project",
          mode: "Advanced",
          projectName,
          data: Array.isArray(advanced) ? advanced : [advanced],
        };
      } else {
        updates.projectAdvanced = null;
      }

      // -------- TERRITORY --------
      if (territoryName?.trim()) {
        const advanced = await fetchTerritoryFile(territoryName, "advanced");
        updates.territoryAdvanced = {
          macro: "Territory",
          mode: "Advanced",
          territoryName,
          data: Array.isArray(advanced) ? advanced : [advanced],
        };
      } else {
        updates.territoryAdvanced = null;
      }

      // ✅ merge only updated slots — untouched slots keep their reference
      setResultsMap((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Advanced Search Failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 print-force-column">
      <div className="print-hide">
        <Sidebar
          onBasicSearch={onBasicSearch}
          onAdvanceSearch={onAdvanceSearch}
          clearResultsForMacro={clearResultsForMacro}
          onDocumentAnalysis={(data) => {
            setHasSearched(true);

            setResultsMap((prev) => ({
              ...prev,
              partnerDocument: data,
            }));
          }}
        />
      </div>

      <main className="relative flex-1 overflow-y-auto p-6 ml-72 space-y-6 print-remove-ml print-full-width">
        {!hasSearched ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800">Welcome!</h1>
              <p className="text-gray-600 mt-3">
                Select any macro from the left panel to begin.
              </p>
            </div>
          </div>
        ) : (
          <ResultsPanel
            resultsMap={resultsMap}
            viewMode={viewMode}
            countryAdvancedLoading={countryAdvancedLoading}
          />
        )}

        {loading && <LoadingOverlay />}
      </main>
    </div>
  );
}
