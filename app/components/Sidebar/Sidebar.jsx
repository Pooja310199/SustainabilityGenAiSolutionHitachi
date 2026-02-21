"use client";
import React, { useEffect, useRef, useState } from "react";

export default React.memo(function Sidebar({
  // macro,
  // setMacro,
  onBasicSearch,
  onAdvanceSearch,
  clearResultsForMacro, // ⭐ NEW
}) {
  console.count("Sidebar rendered");
  // const [macro, setMacro] = useState("");
  const [countries, setCountries] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  const [selectedCountries, setSelectedCountries] = useState([]);
  // const [customer1, setCustomer1] = useState("");
  // const [customer2, setCustomer2] = useState("");
  // const [partnerName, setPartnerName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [suppliers, setSuppliers] = useState(["", "", "", ""]);
  const [customers, setCustomers] = useState(["", ""]);
  const [consortiumPartner, setConsortiumPartner] = useState("");

  const updateArrayValue = (setter, index, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const [openMacro, setOpenMacro] = useState({
    country: true,
    partner: true,
    project: true,
  });

  const toggleMacro = (key) => {
    setOpenMacro((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [territoryName, setTerritoryName] = useState("");

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

  const handleBasicSearch = () => {
    onBasicSearch({
      // macro,
      // setMacro,
      selectedCountries,
      suppliers,
      customers,
      consortiumPartner,
      projectName,
      territoryName,
    });
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto fixed inset-y-0 shadow-sm print:hidden">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Source Selector
      </h2>

      {/* MACRO BUTTONS */}
      <div className="mb-6">
        <label className="block text-base font-medium mb-3 text-gray-700">
          Choose Source Macro:
        </label>
      </div>

      {/* COUNTRY MACRO */}
      <div className="mb-8" ref={dropdownRef}>
        <div
          className="flex justify-between items-center text-sm font-medium text-gray-800 cursor-pointer mb-1"
          onClick={() => setOpenMacro((o) => ({ ...o, country: !o.country }))}
        >
          <span className="bg-red-600 text-white">Country</span>
          <span className="ml-2">{openMacro.country ? "▲" : "▼"}</span>
        </div>
        {openMacro.country && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Country (max 4):
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
                          } else if (selectedCountries.length < 4) {
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

            {/* your existing dropdown code stays SAME */}
          </div>
        )}
      </div>

      {/* CUSTOMER UI */}

      {/* PARTNER MACRO */}
      {/* PARTNER MACRO */}
      <div className="mb-8 space-y-4">
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => toggleMacro("partner")}
        >
          <h3 className="text-sm font-semibold text-gray-800">Partner</h3>
          <span className="text-xs">{openMacro.partner ? "▲" : "▼"}</span>
        </div>

        {openMacro.partner && (
          <div className="space-y-4">
            <p className="text-xs text-blue-800 flex gap-1 items-start">
              <span>ℹ️</span>
              <span>
                Use this macro to compare risk between suppliers, customers, and
                consortium partners.
              </span>
            </p>

            {/* SUPPLIERS */}
            {suppliers.map((supplier, idx) => (
              <div key={`supplier-${idx}`}>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Supplier Name {idx + 1}:
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                  placeholder={`e.g., Supplier ${idx + 1}`}
                  value={supplier}
                  onChange={(e) =>
                    updateArrayValue(setSuppliers, idx, e.target.value)
                  }
                />
              </div>
            ))}

            {/* CUSTOMERS */}
            {customers.map((customer, idx) => (
              <div key={`customer-${idx}`}>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Customer Name {idx + 1}:
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                  placeholder={`e.g., Customer ${idx + 1}`}
                  value={customer}
                  onChange={(e) =>
                    updateArrayValue(setCustomers, idx, e.target.value)
                  }
                />
              </div>
            ))}

            {/* CONSORTIUM PARTNER */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Consortium Partner Name:
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                placeholder="e.g., Schneider"
                value={consortiumPartner}
                onChange={(e) => setConsortiumPartner(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* PROJECT MACRO */}

      <div className="mb-8 space-y-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleMacro("project")}
        >
          <h3 className="text-sm font-semibold text-gray-800">Project</h3>
          <span className="text-xs">{openMacro.project ? "▲" : "▼"}</span>
        </div>

        {openMacro.project && (
          <div>
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
      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={handleBasicSearch}
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
});
