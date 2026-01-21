"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Sidebar({
  macro,
  setMacro,
  selectedCountries,
  setSelectedCountries,
  customer1,
  setCustomer1,
  customer2,
  setCustomer2,
  partnerName,
  setPartnerName,
  projectName,
  setProjectName,
  territoryName,
  setTerritoryName,
  onBasicSearch,
  onAdvanceSearch,
  clearResultsForMacro, // ⭐ NEW
}) {
  console.count("Sidebar rendered");
  const [countries, setCountries] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((json) => setCountries(json.map((c) => c.name.common).sort()))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6 fixed inset-y-0 shadow-sm print:hidden">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Source Selector
      </h2>

      {/* MACRO BUTTONS */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-700">
          Choose Source Macro:
        </label>

        <div className="grid grid-cols-3 gap-2">
          {["Country", "Customer", "Project"].map((m) => (
            <button
              key={m}
              onClick={() => setMacro(m)}
              className={`py-2 text-sm rounded-lg border transition-all ${
                macro === m
                  ? "bg-red-700 text-white border-red-800 shadow-sm font-semibold"
                  : "bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100 text-red-700 font-semibold"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* COUNTRY UI */}
      {macro === "Country" && (
        <div className="mb-6" ref={dropdownRef}>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Country (max 2):
          </label>

          <div
            className="border rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-pointer flex justify-between items-center hover:bg-gray-100"
            onClick={() => setDropdownOpen((p) => !p)}
          >
            {selectedCountries.length
              ? selectedCountries.join(", ")
              : "Choose Country..."}
            <span>{dropdownOpen ? "▲" : "▼"}</span>
          </div>

          {dropdownOpen && (
            <div className="absolute bg-white border mt-1 w-60 rounded-lg shadow-lg max-h-56 overflow-y-auto">
              <input
                type="text"
                placeholder="Search country..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full border-b p-2 text-sm"
              />

              {countries
                .filter((c) =>
                  c.toLowerCase().includes(searchText.toLowerCase()),
                )
                .map((c) => (
                  <label
                    key={c}
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(c)}
                      onChange={() => {
                        let updated;
                        if (selectedCountries.includes(c)) {
                          updated = selectedCountries.filter((x) => x !== c);
                        } else if (selectedCountries.length < 2) {
                          updated = [...selectedCountries, c];
                        } else {
                          alert("Max 2 countries allowed");
                          return;
                        }

                        setSelectedCountries(updated);

                        // ⭐ If empty, clear country results
                        if (updated.length === 0)
                          clearResultsForMacro("Country");
                      }}
                    />
                    {c}
                  </label>
                ))}
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER UI */}
      {macro === "Customer" && (
        <div className="mb-6 space-y-4">
          {/* Customer 1 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Customer Name 1:
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="e.g., Alliander"
              value={customer1}
              onChange={(e) => {
                const v = e.target.value;
                setCustomer1(v);

                if (!v.trim() && !customer2.trim() && !partnerName.trim()) {
                  clearResultsForMacro("Customer");
                }
              }}
            />
          </div>

          {/* Customer 2 */}
          {/* <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Customer Name 2:
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="e.g., Enel"
              value={customer2}
              onChange={(e) => {
                const v = e.target.value;
                setCustomer2(v);

                if (!customer1.trim() && !v.trim() && !partnerName.trim()) {
                  clearResultsForMacro("Customer");
                }
              }}
              disabled={!!partnerName}
            />
          </div> */}

          {/* Partner */}
          {/* <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Consortium Partner:
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="e.g., Schneider"
              value={partnerName}
              onChange={(e) => {
                const v = e.target.value;
                setPartnerName(v);

                if (!customer1.trim() && !customer2.trim() && !v.trim()) {
                  clearResultsForMacro("Customer");
                }
              }}
              disabled={!!customer1 && !!customer2}
            />
          </div> */}

          {/* CUSTOMER 2 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Customer Name 2:
            </label>

            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 
      ${partnerName ? "bg-gray-200 cursor-not-allowed" : ""}`}
              placeholder="e.g., Enel"
              value={customer2}
              onChange={(e) => setCustomer2(e.target.value)}
              disabled={!!partnerName}
            />

            {partnerName && (
              <p className="text-xs text-red-600 mt-1">
                Consortium Partner entered — Customer 2 disabled.
              </p>
            )}
          </div>

          {/* CONSORTIUM PARTNER */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Consortium Partner:
            </label>

            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 
      ${customer1 && customer2 ? "bg-gray-200 cursor-not-allowed" : ""}`}
              placeholder="e.g., Schneider"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              disabled={!!customer1 && !!customer2}
            />

            {customer1 && customer2 && (
              <p className="text-xs text-red-600 mt-1">
                Both customers selected — Partner disabled.
              </p>
            )}
          </div>
        </div>
      )}

      {/* PROJECT UI */}
      {macro === "Project" && (
        <div className="mb-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Project Name:
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="Enter project"
              value={projectName}
              onChange={(e) => {
                const v = e.target.value;
                setProjectName(v);

                if (!v.trim()) clearResultsForMacro("Project");
              }}
            />
          </div>

          {/* Territory Name – ⭐ NEW FIELD */}
          {/* Territory Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Territory Name:
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="Enter territory name"
              value={territoryName}
              onChange={(e) => {
                const v = e.target.value;
                setTerritoryName(v);

                if (!v.trim() && !projectName.trim()) {
                  clearResultsForMacro("Project");
                }
              }}
            />
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onBasicSearch}
          // className="bg-blue-600 text-white rounded-lg py-2 font-semibold text-sm"
          className="
         btn-learn-more
         
         "
        >
          Basic Search
        </button>

        <button onClick={onAdvanceSearch} className="btn-learn-more">
          Advance Search
        </button>
      </div>
    </aside>
  );
}
