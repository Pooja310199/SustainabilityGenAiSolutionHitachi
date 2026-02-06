"use client";
import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { capitalizeWords, allValuesNA } from "../Common/Utils";
import SeverityDot from "../Common/SeverityDot";
import { Disclosure } from "@headlessui/react";
export default function RenderTerritoryMacro({
  content,
  index,
  expandedTerritorySub,
  setExpandedTerritorySub,
}) {
  console.count("RenderTerritoryMacro rendered");
  if (!content || allValuesNA(content)) return null;

  const mainKey = `territory-main-${index}`;

  const toggle = (key) => {
    setExpandedTerritorySub((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 🔥 Aggressive NA Filtering for individual fields
  const isNAValue = (val) => {
    if (val === null || val === undefined) return true;
    if (["N/A", "No Data", ""].includes(val)) return true;
    if (Array.isArray(val) && val.length === 0) return true;
    if (typeof val === "object" && Object.keys(val).length === 0) return true;
    return false;
  };

  // 🔥 Filter arrays to remove NA elements but keep valid ones
  const filterArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    const filtered = arr.filter((v) => !isNAValue(v));
    return filtered.length > 0 ? filtered : [];
  };

  // 🔥 Filter object fields
  const filterObject = (obj) => {
    if (typeof obj !== "object" || obj === null) return {};
    const entries = Object.entries(obj).filter(([_, v]) => !isNAValue(v));
    return entries.length > 0 ? Object.fromEntries(entries) : {};
  };

  /* ================================
   EXPAND ALL + COLLAPSE ALL
================================ */

  // const collapseAll = () => {
  //   // Close top-level blocks
  //   setIsCountryOpen(false);
  //   setIsCustomerOpen(false);
  //   setIsProjectOpen(false);

  //   // Reset all nested expanders
  //   setExpandedSections({});
  //   setExpandedMetrics({});
  //   setExpandedSources({});
  //   setExpandedSubIndicators({});
  //   setExpandedAdvSections({});
  //   setExpandedQueries({});
  //   setExpandedProjectSub({});
  //   setExpandedTerritorySub({});
  // };

  const normalizeSection = (section) => {
    if (!section || typeof section !== "object") return null;

    const list = Array.isArray(section.items)
      ? section.items
      : Array.isArray(section.results)
        ? section.results
        : [];

    if (list.length === 0) return null;

    return {
      list,
      severity: section.severity,
      risk_level: section.risk_level,
    };
  };

  return (
    <div className="mb-5 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* MAIN HEADER */}
      <button
        onClick={() => toggle(mainKey)}
        className="w-full flex justify-between items-center px-5 py-3
                   bg-gray-50 hover:bg-gray-100 border-b rounded-t-xl
                   text-left text-sm font-semibold text-gray-800 transition"
      >
        <div className="flex items-center gap-2">
          <SeverityDot level={content.overall_severity} />
          <span>
            {capitalizeWords(content.category || "Territory Section")}
          </span>
        </div>

        <ChevronUpIcon
          className={`h-4 w-5 transition-transform ${
            expandedTerritorySub[mainKey] ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandedTerritorySub[mainKey] && (
        <div className="p-4 space-y-4">
          {content.results?.map((res, idx) => {
            if (allValuesNA(res)) return null;

            const subKey = `territory-sub-${index}-${idx}`;
            const srcKey = `territory-src-${index}-${idx}`;

            return (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 shadow-inner"
              >
                {/* SUB HEADER */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(subKey);
                  }}
                  className="w-full flex justify-between items-center px-4 py-2
                             bg-gray-100 hover:bg-gray-200 border-b rounded-t-lg
                             text-left text-sm font-semibold text-gray-800 transition"
                >
                  <div className="flex items-center gap-2">
                    <SeverityDot level={res.overall_severity} />
                    <span>{res.sub_category}</span>
                  </div>
                  <ChevronUpIcon
                    className={`h-4 w-4 transition-transform ${
                      expandedTerritorySub[subKey] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedTerritorySub[subKey] && (
                  // <div className="p-4 space-y-5 text-sm text-gray-700">
                  <div className="p-4 space-y-5 text-sm text-gray-700">
                    {/*       OTHER ANALYSIS ARRAYS        */}
                    {Object.entries(res.analysis || {}).map(
                      ([key, section]) => {
                        if (key === "queries") return null;

                        const normalized = normalizeSection(section);
                        if (!normalized) return null;

                        return (
                          <Disclosure key={key} defaultOpen={true}>
                            {({ open }) => (
                              <div className="border rounded-lg bg-gray-50">
                                {/* HEADER */}
                                <Disclosure.Button className="w-full flex items-center justify-between px-4 py-3">
                                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                                    <SeverityDot level={normalized.severity} />
                                    {capitalizeWords(key.replace(/_/g, " "))}
                                  </div>

                                  <ChevronUpIcon
                                    className={`h-5 w-5 transition-transform ${
                                      open ? "rotate-180" : ""
                                    }`}
                                  />
                                </Disclosure.Button>

                                {/* CONTENT */}
                                <Disclosure.Panel
                                  className=" px-4 pb-4
    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
    gap-4"
                                >
                                  {normalized.list.map((item, ii) => (
                                    <div
                                      key={ii}
                                      className="border p-3 rounded-lg bg-white shadow-sm space-y-1"
                                    >
                                      {typeof item === "string" && (
                                        <p>• {item}</p>
                                      )}

                                      {typeof item === "object" &&
                                        Object.entries(item).map(
                                          ([field, val]) => (
                                            <p key={field}>
                                              <span className="font-semibold">
                                                {capitalizeWords(
                                                  field.replace(/_/g, " "),
                                                )}
                                                :
                                              </span>{" "}
                                              {field === "severity" ? (
                                                <SeverityDot level={val} />
                                              ) : field === "distance" ? (
                                                `${val} km`
                                              ) : (
                                                String(val)
                                              )}
                                            </p>
                                          ),
                                        )}
                                    </div>
                                  ))}
                                </Disclosure.Panel>
                              </div>
                            )}
                          </Disclosure>
                        );
                      },
                    )}

                    {/*   SOURCES     */}

                    {res.sources &&
                      res.sources.filter((s) => !isNAValue(s)).length > 0 && (
                        <div className="pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggle(srcKey);
                            }}
                            className="w-full flex justify-between items-center px-4 py-2
                                       bg-gray-100 hover:bg-gray-200 border rounded-lg
                                       text-sm font-semibold text-gray-800 transition"
                          >
                            <span>Sources</span>
                            <ChevronUpIcon
                              className={`h-4 w-4 transition-transform ${
                                expandedTerritorySub[srcKey] ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {expandedTerritorySub[srcKey] && (
                            <div className="p-3 mt-2 bg-white border rounded-lg shadow-sm space-y-2">
                              {res.sources
                                .filter((s) => !isNAValue(s))
                                .map((src, si) => (
                                  <a
                                    key={si}
                                    href={src}
                                    target="_blank"
                                    className="block text-blue-600 underline break-all"
                                  >
                                    {src}
                                  </a>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
