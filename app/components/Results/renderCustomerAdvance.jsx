"use client";
import React from "react";
import SeverityDot from "../Common/SeverityDot";
import { capitalizeWords } from "../Common/Utils";

const isValid = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "object") return Object.values(val).some(isValid);
  const clean = String(val).trim().toLowerCase();
  return clean && !["n/a", "na", "none", "-", "null"].includes(clean);
};

export default function CustomerAdvanceRenderer({
  content,
  index,
  expandedCustomerSub,
  setExpandedCustomerSub,
}) {
  if (!content || !content.results) {
    return (
      <p className="text-gray-600 text-center">No advanced results found.</p>
    );
  }

  const toggle = (key) => {
    setExpandedCustomerSub((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const catKey = `cust-${index}-cat`;
  // const catKey = `customer-${content.category}-${index}-cat`;
  const isCatOpen = expandedCustomerSub[catKey] || false;

  return (
    <div className="border border-gray-300 rounded-lg bg-white mb-4">
      {/* CATEGORY */}
      <button
        onClick={() => toggle(catKey)}
        className="w-full flex justify-between px-4 py-3 font-semibold text-sm border "
      >
        <span className="flex items-center gap-2">
          <SeverityDot level={content.overall_severity} />
          {capitalizeWords(content.category)}
        </span>
        <span>{isCatOpen ? "▲" : "▼"}</span>
      </button>

      {isCatOpen && (
        <div className="p-4 space-y-5">
          {content.results.map((result, rIndex) => {
            return (
              <div key={rIndex} className="space-y-4">
                {/* ===== ANALYSIS DIRECT ===== */}
                {result.analysis &&
                  Object.entries(result.analysis).map(
                    ([groupKey, groupData], i) => {
                      // CASE 1: queries array
                      if (Array.isArray(groupData?.queries)) {
                        return (
                          <div
                            key={i}
                            className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
                          >
                            <div className="font-semibold mb-2">
                              {capitalizeWords(groupKey)}
                            </div>

                            {groupData.queries.map((q, qi) => (
                              <div key={qi} className="mb-3">
                                {q.questions && (
                                  <div>
                                    <b>Question:</b> {q.questions}
                                  </div>
                                )}

                                {q.result &&
                                  q.result.map((r, ri) => (
                                    <div
                                      key={ri}
                                      className="ml-3 mt-1 border-l pl-2"
                                    >
                                      {r.summary && (
                                        <div>
                                          <b>Summary:</b> {r.summary}
                                        </div>
                                      )}

                                      {r.link && (
                                        <a
                                          href={r.link}
                                          target="_blank"
                                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                                        >
                                          {r.link}
                                        </a>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      // CASE 2: items array
                      if (Array.isArray(groupData?.items)) {
                        return (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-gray-100 border"
                          >
                            <div className="font-semibold mb-2">
                              {capitalizeWords(groupKey)}
                            </div>

                            {groupData.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="border p-2 rounded bg-white"
                              >
                                {item.title && (
                                  <div className="font-semibold">
                                    {item.title}
                                  </div>
                                )}
                                {item.summary && <div>{item.summary}</div>}
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                  >
                                    {item.link}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      // CASE 3: simple object (THIS IS YOUR DATA CASE ✅)
                      if (typeof groupData === "object") {
                        return (
                          <div
                            key={i}
                            className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
                          >
                            <div className="font-semibold text-gray-800 mb-2 border-b pb-1">
                              {capitalizeWords(groupKey)}
                            </div>

                            {Object.entries(groupData).map(([k, v], idx) => {
                              if (!isValid(v) || k === "keyword") return null;

                              // 👉 HANDLE SOURCES ARRAY (IMPORTANT)
                              if (k === "sources" && Array.isArray(v)) {
                                return (
                                  <div key={idx} className="py-2">
                                    <div className="font-medium text-gray-600 mb-1">
                                      Sources
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      {v.map((link, i) => (
                                        <a
                                          key={i}
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                                        >
                                          {link}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }

                              // 👉 NORMAL FIELDS
                              return (
                                <div
                                  key={idx}
                                  className="grid grid-cols-[150px_1fr] gap-2 text-sm py-1"
                                >
                                  <div className="font-medium text-gray-600">
                                    {capitalizeWords(k)}
                                  </div>
                                  <div className=" text-gray-800">
                                    {String(v)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      return null;
                    },
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
