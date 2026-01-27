"use client";
import React, { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ResultsPanel from "./components/Results/ResultsPanel";

export default function Page() {
  console.count("Page rendered");
  // const [macro, setMacro] = useState("Country");

  const [loading, setLoading] = useState(false);

  // GLOBAL VIEW MODE
  const [viewMode, setViewMode] = useState("basic");

  // New flag → only show results AFTER search
  const [hasSearched, setHasSearched] = useState(false);

  const [resultsMap, setResultsMap] = useState({
    countryBasic: null,
    countryAdvanced: null,
    customerBasic: null,
    customerAdvanced: null,
    projectBasic: null,
    projectAdvanced: null,
    territoryBasic: null,
    territoryAdvanced: null,
  });

  // ----------- COUNTRY FETCH -----------
  const fetchCountryData = async (country, type = "basic") => {
    try {
      const suffix = type === "advanced" ? "_advanced" : "";
      const fileName = `${country.toLowerCase()}${suffix}.json`;
      const res = await fetch(`/mockData/${fileName}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  };

  // ----------- CUSTOMER FETCH -----------
  const fetchCustomerFile = async (name) => {
    try {
      const file = `/mockData/customers/${name.toLowerCase()}.json`;
      const res = await fetch(file);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { error: `No data found for ${name}` };
    }
  };

  // ----------- PROJECT FETCH -----------
  const fetchProjectFile = async (name, type = "basic") => {
    try {
      const suffix = type === "advanced" ? "_advanced" : "";
      const fileName = `${name.toLowerCase()}${suffix}.json`;
      const res = await fetch(`/mockData/Project/${name.toLowerCase()}.json`);
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
      const fileName = `${name.toLowerCase()}${suffix}.json`;
      const res = await fetch(`/mockData/territories/${fileName}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { error: `No territory data found for ${name}` };
    }
  };

  // RESET RESULTS PER MACRO
  const clearResultsForMacro = useCallback((macro) => {
    console.log("clear macro created");
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

  // ----------- BASIC SEARCH -----------
  const onBasicSearch = useCallback(async (formData) => {
    const {
      macro,
      setMacro,
      selectedCountries,
      customer1,
      customer2,
      partnerName,
      projectName,
      territoryName,
    } = formData;

    setHasSearched(true);
    setLoading(true);
    setViewMode("basic");

    const newResults = {
      countryBasic: null,
      countryAdvanced: null,
      customerBasic: null,
      customerAdvanced: null,
      projectBasic: null,
      projectAdvanced: null,
      territoryBasic: null,
      territoryAdvanced: null,
    };

    // COUNTRY
    if (selectedCountries.length > 0) {
      const basic = await Promise.all(
        selectedCountries.map((c) => fetchCountryData(c, "basic")),
      );

      newResults.countryBasic = {
        macro: "Country",
        mode: "Basic",
        selectedCountries,
        data: basic,
      };
    }

    // CUSTOMER
    if (customer1 || customer2 || partnerName) {
      const names = [customer1, customer2, partnerName].filter(Boolean);
      const basic = await Promise.all(names.map(fetchCustomerFile));

      newResults.customerBasic = {
        macro: "Customer",
        mode: "Basic",
        data: basic,
        customer1,
        customer2,
        partnerName,
      };
    }

    // PROJECT
    if (projectName?.trim()) {
      const basic = await fetchProjectFile(projectName, "basic");

      newResults.projectBasic = {
        macro: "Project",
        mode: "Basic",
        projectName,
        data: Array.isArray(basic) ? basic : [basic],
      };
    }

    // TERRITORY
    if (territoryName?.trim()) {
      const basic = await fetchTerritoryFile(territoryName, "basic");

      newResults.territoryBasic = {
        macro: "Territory",
        mode: "Basic",
        data: Array.isArray(basic) ? basic : [basic],
        territoryName,
      };
    }

    setResultsMap(newResults);
    setLoading(false);
  }, []); // ✅ EMPTY dependency array

  // ----------- ADVANCED SEARCH -----------
  const onAdvanceSearch = useCallback(async () => {
    console.log("advance search created");
    setHasSearched(true);
    setLoading(true);
    setViewMode("advanced");

    const newResults = { ...resultsMap };

    // COUNTRY ADVANCED
    if (selectedCountries.length > 0) {
      const [basic, adv] = await Promise.all([
        Promise.all(selectedCountries.map((c) => fetchCountryData(c, "basic"))),
        Promise.all(
          selectedCountries.map((c) => fetchCountryData(c, "advanced")),
        ),
      ]);

      newResults.countryBasic = {
        macro: "Country",
        mode: "Basic",
        selectedCountries: [...selectedCountries],
        data: basic,
      };

      newResults.countryAdvanced = {
        macro: "Country",
        mode: "Advanced",
        selectedCountries: [...selectedCountries],
        data: basic,
        advancedData: adv,
      };
    }

    // CUSTOMER ADVANCED
    if (customer1 || customer2 || partnerName) {
      const names = [customer1, customer2 || partnerName].filter(Boolean);

      const results = await Promise.all(
        names.map((n) => fetchCustomerFile(n.toLowerCase())),
      );

      newResults.customerBasic = {
        macro: "Customer",
        mode: "Basic",
        data: results,
        customer1,
        customer2,
        partnerName,
      };

      newResults.customerAdvanced = {
        macro: "Customer",
        mode: "Advanced",
        data: results,
        advancedData: results,
        customer1,
        customer2,
        partnerName,
      };
    }

    // PROJECT ADVANCED
    if (projectName.trim()) {
      const basic = await fetchProjectFile(projectName, "basic");
      const adv = await fetchProjectFile(projectName, "advanced");

      newResults.projectBasic = {
        macro: "Project",
        mode: "Basic",
        data: Array.isArray(basic) ? basic : [basic],
      };

      newResults.projectAdvanced = {
        macro: "Project",
        mode: "Advanced",
        data: Array.isArray(adv) ? adv : [adv],
      };
    }

    setResultsMap(newResults);
    setLoading(false);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 print-force-column">
      <div className="print-hide">
        <Sidebar
          // macro={macro}
          // setMacro={setMacro}
          onBasicSearch={onBasicSearch}
          onAdvanceSearch={onAdvanceSearch}
          clearResultsForMacro={clearResultsForMacro}
        />
      </div>

      <main className="flex-1 overflow-y-auto p-6 ml-72 space-y-6 print-remove-ml print-full-width">
        {!hasSearched ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800">Welcome!</h1>
              <p className="text-gray-600 mt-3">
                Select any macro (Country, Customer, Project) from the left
                panel to begin.
              </p>
            </div>
          </div>
        ) : (
          <ResultsPanel
            resultsMap={resultsMap}
            viewMode={viewMode}
            loading={loading}
            // projectName={projectName}
            // territoryName={territoryName}
          />
        )}
      </main>
    </div>
  );
}
