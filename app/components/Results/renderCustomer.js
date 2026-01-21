"use client";
import React from "react";
import SeverityDot from "../Common/SeverityDot";
import { capitalizeWords } from "../Common/Utils";

const isValid = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "object") return Object.values(val).some(isValid);
  const clean = String(val).trim().toLowerCase();
  if (!clean) return false;
  return !["n/a", "na", "none", "-", "null", "undefined"].includes(clean);
};

/* Non-collapsible analysis groups */
const nonCollapsibleGroups = [
  "human_rights_allegations",
  "environmental_allegations",
  "court_cases",
  "lawsuits",
  "allegations",
  "hrd_attacks_and_slapps",
  "associated_top_issues"
];

/* Renders a single analysis item */
const renderAnalysisItem = (item, idx) => {
  // CASE 1 — strings (Associated Top Issues)
  if (typeof item === "string") {
    return (
      <div
        key={idx}
        // className="border border-yellow-300 bg-yellow-50 rounded-md p-2 text-sm"
        className="border rounded-md p-2 text-sm"
      >
        <div className="font-semibold text-gray-900">{item}</div>
      </div>
    );
  }

  // CASE 2 — full object items
  return (
    <div
      key={idx}
      className="border border-gray-300 bg-white rounded-md p-3 text-sm space-y-2"
    >
      <div className="font-semibold text-gray-900">
        {item.title || item.name || "Untitled"}
      </div>

      {item.description && (
        <div>
          <span className="font-medium">Description:</span> {item.description}
        </div>
      )}

      {item.timeline && (
        <div>
          <span className="font-medium">Timeline:</span> {item.timeline}
        </div>
      )}

      {(item.date || item.published_date) && (
        <div>
          <span className="font-medium">Date:</span>{" "}
          {item.date || item.published_date}
        </div>
      )}

      {item.type_of_allegation && (
        <div>
          <span className="font-medium">Type:</span>{" "}
          {item.type_of_allegation}
        </div>
      )}

      {item.source_type && (
        <div>
          <span className="font-medium">Source Type:</span>{" "}
          {item.source_type}
        </div>
      )}

      {item.link && (
        <div>
          <span className="font-medium">Link:</span>{" "}
          <a
            href={item.link}
            target="_blank"
            className="text-blue-600 underline"
          >
            {item.link}
          </a>
        </div>
      )}

      {item.source_link && (
        <div>
          <span className="font-medium">Source:</span>{" "}
          <a
            href={item.source_link}
            target="_blank"
            className="text-blue-600 underline"
          >
            {item.source_link}
          </a>
        </div>
      )}
    </div>
  );
};

export default function CustomerRenderer({
  content,
  index,
  expandedCustomerSub,
  setExpandedCustomerSub,
}) {


  console.count("CustomerRenderer rendered");
  if (!content || !content.results) {
    return (
      <p className="text-gray-600 text-center">No customer results found.</p>
    );
  }

  const toggle = (key) => {
    setExpandedCustomerSub((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const catKey = `cust-${index}-cat`;
  const isCatOpen = expandedCustomerSub[catKey] || false;

  return (
    <div className="border border-gray-300 rounded-lg bg-white mb-4">
      {/* CATEGORY HEADER */}
      <button
        onClick={() => toggle(catKey)}
        // className="w-full flex justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold text-sm rounded-t-lg"


        className="w-full flex justify-between px-4 py-3 bg-gray-100  font-semibold text-sm rounded-t-lg category-header"
      >
        <span className="flex items-center gap-2">
          <SeverityDot level={content.overall_severity} />
          {capitalizeWords(content.category)}
        </span>
        <span>{isCatOpen ? "▲" : "▼"}</span>
      </button>

      {isCatOpen && (
        <div className="p-4 space-y-6">
          {content.results.map((result, rIndex) => {
            const subKey = `cust-${index}-sub-${rIndex}`;
            const isSubOpen = expandedCustomerSub[subKey] || false;

            return (
              <div key={subKey} className="border border-gray-200 rounded-md">
                {/* SUBCATEGORY HEADER */}
                <button
                  onClick={() => toggle(subKey)}
                  className="w-full flex justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-medium rounded-md"
                >
                  <span className="flex items-center gap-2">
                    <SeverityDot level={result.overall_severity} />
                    {capitalizeWords(result.sub_category)}
                  </span>
                  <span>{isSubOpen ? "▲" : "▼"}</span>
                </button>

                {isSubOpen && (
                  <div className="ml-4 mt-3 space-y-4">

                    {/* METRICS */}
                    {result.metrics &&
                      Object.entries(result.metrics).map(([key, metric]) => {
                        if (!Object.values(metric).some(isValid)) return null;

                        return (
                          <div key={key} className="border p-2 rounded-md bg-white">
                            <div className="font-semibold text-sm">{capitalizeWords(key)}</div>
                            <div className="ml-3 mt-1 text-sm space-y-1">
                              {metric.query && <div><b>Query:</b> {metric.query}</div>}
                              {metric.result && <div><b>Result:</b> {metric.result}</div>}
                              {metric.reasoning && <div><b>Reasoning:</b> {metric.reasoning}</div>}
                              {metric.risk_level && <div><b>Risk:</b> {metric.risk_level}</div>}
                            </div>
                          </div>
                        );
                      })}

                    {/* ANALYSIS GROUPS */}
                    {result.analysis &&
                      Object.entries(result.analysis).map(([groupKey, items], gIndex) => {
                        if (!Array.isArray(items) || !items.some(isValid)) return null;

                        const normalized = groupKey.toLowerCase();
                        const gKey = `cust-${index}-group-${rIndex}-${gIndex}`;
                        const isGroupOpen = expandedCustomerSub[gKey] || false;

                        /* NON-COLLAPSIBLE */
                        if (nonCollapsibleGroups.includes(normalized)) {
                          return (
                            // <div key={gKey} className="p-2 bg-yellow-50 border border-yellow-300 rounded-md">
                            <div key={gKey} className="p-2 border rounded-md">
                              <div className="font-semibold text-sm">
                                {capitalizeWords(groupKey.replace(/_/g, " "))}
                              </div>
                              <div className="ml-3 mt-2 space-y-2">
                                {items.map(renderAnalysisItem)}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={gKey} className="p-2 bg-gray-50 rounded-md border border-gray-200">
                            <button
                              onClick={() => toggle(gKey)}
                              className="w-full flex justify-between font-medium text-sm"
                            >
                              {capitalizeWords(groupKey.replace(/_/g, " "))}
                              <span>{isGroupOpen ? "▲" : "▼"}</span>
                            </button>

                            {isGroupOpen && (
                              <div className="ml-3 mt-2 space-y-2">
                                {items.map(renderAnalysisItem)}
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* COLLAPSIBLE SOURCES */}
                    {result.sources && result.sources.length > 0 && (() => {
                      const srcKey = `cust-${index}-sub-${rIndex}-sources`;
                      const srcOpen = expandedCustomerSub[srcKey] || false;

                      return (
                        <div className="border border-gray-200 rounded-md bg-gray-50 p-2">
                          <button
                            onClick={() => toggle(srcKey)}
                            className="w-full flex justify-between font-semibold text-sm text-left"
                          >
                            Sources
                            <span>{srcOpen ? "▲" : "▼"}</span>
                          </button>

                          {srcOpen && (
                            <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
                              {result.sources.map((src, i) => (
                                <li key={i}>
                                  <a
                                    href={src}
                                    className="text-blue-600 underline"
                                    target="_blank"
                                  >
                                    {src}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })()}

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
