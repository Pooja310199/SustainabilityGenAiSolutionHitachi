"use client";
import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { capitalizeWords, allValuesNA } from "../Common/Utils";

export default function RenderProjectMacro({
  content,
  index,
  expandedProjectSub,
  setExpandedProjectSub,
}) {
  if (!content || allValuesNA(content)) return null;

  const mainKey = `project-main-${index}`;

  const toggle = (key) => {
    setExpandedProjectSub((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mb-5 rounded-xl border border-gray-200 bg-white shadow-sm category-header ">
      {/* MAIN HEADER */}
      <button
        onClick={() => toggle(mainKey)}
        className="w-full flex justify-between items-center px-5 py-3
                   bg-gray-50 hover:bg-gray-100 border-b rounded-t-xl
                   text-left text-sm font-semibold text-gray-800 transition"
      >
        <span>{capitalizeWords(content.category || "Project Section")}</span>
        <ChevronUpIcon
          className={`h-4 w-5 transition-transform ${
            expandedProjectSub[mainKey] ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandedProjectSub[mainKey] && (
        <div className="p-4 space-y-4">
          {content.results?.map((res, idx) => {
            if (allValuesNA(res)) return null;

            const subKey = `project-sub-${index}-${idx}`;
            const srcKey = `project-src-${index}-${idx}`;

            return (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 shadow-inner"
              >
                {/* SUB HEADER */}
                <button
                  onClick={() => toggle(subKey)}
                  className="w-full flex justify-between items-center px-4 py-2
                             bg-gray-100 hover:bg-gray-200 border-b rounded-t-lg
                             text-left text-sm font-semibold text-gray-800 transition"
                >
                  <span>{res.sub_category}</span>
                  <ChevronUpIcon
                    className={`h-4 w-4 transition-transform ${
                      expandedProjectSub[subKey] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedProjectSub[subKey] && (
                  <div className="p-4 space-y-5 text-sm text-gray-700">
                    {/* ALLEGATIONS */}
                    {res.analysis?.allegations &&
                      res.analysis.allegations.some((a) => !allValuesNA(a)) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">
                            Allegations
                          </h4>

                          {res.analysis.allegations.map((a, i) => {
                            if (allValuesNA(a)) return null;

                            return (
                              <div
                                key={i}
                                className="border p-3 rounded-lg bg-white shadow-sm space-y-2"
                              >
                                {a.title && (
                                  <p>
                                    <span className="font-semibold">
                                      Title:
                                    </span>{" "}
                                    {a.title}
                                  </p>
                                )}

                                {a.link && a.link !== "N/A" && (
                                  <p>
                                    <span className="font-medium">Link:</span>{" "}
                                    <a
                                      href={a.link}
                                      target="_blank"
                                      className="text-blue-600 underline break-all"
                                    >
                                      {a.link}
                                    </a>
                                  </p>
                                )}

                                {a.published_date && (
                                  <p>
                                    <span className="font-medium">
                                      Published Date:
                                    </span>{" "}
                                    {a.published_date}
                                  </p>
                                )}

                                {a.description && (
                                  <p>
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {a.description}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* QUERIES */}
                    {res.analysis?.queries &&
                      res.analysis.queries.some((q) => !allValuesNA(q)) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">
                            Search Queries
                          </h4>

                          {res.analysis.queries.map((q, qi) => {
                            if (allValuesNA(q)) return null;

                            return (
                              <div
                                key={qi}
                                className="border p-4 rounded-lg bg-white shadow-sm space-y-3"
                              >
                                {q.question && (
                                  <p>
                                    <span className="font-medium">
                                      Question:
                                    </span>{" "}
                                    {q.question}
                                  </p>
                                )}

                                {q.result?.map((r, ri) => {
                                  if (allValuesNA(r)) return null;

                                  return (
                                    <div
                                      key={ri}
                                      className="mt-2 space-y-2 text-gray-700"
                                    >
                                      {r.summary && (
                                        <p>
                                          <span className="font-medium">
                                            Summary:
                                          </span>{" "}
                                          {r.summary}
                                        </p>
                                      )}

                                      {r.timeline && r.timeline.length > 0 && (
                                        <div className="text-xs mt-1 text-gray-700 space-y-1">
                                          <p className="font-semibold">
                                            Timeline:
                                          </p>
                                          {r.timeline.map((t, ti) => (
                                            <p key={ti}>• {t}</p>
                                          ))}
                                        </div>
                                      )}

                                      {/* IMPORTANT: Hide if null or N/A */}
                                      {r.allegation_type &&
                                        r.allegation_type !== "null" &&
                                        r.allegation_type !== "N/A" && (
                                          <p className="text-xs text-gray-700">
                                            <span className="font-semibold">
                                              Allegation Type:
                                            </span>{" "}
                                            {r.allegation_type}
                                          </p>
                                        )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* SOURCES */}
                    {res.sources && res.sources.length > 0 && (
                      <div className="pt-1">
                        <button
                          onClick={() => toggle(srcKey)}
                          className="w-full flex justify-between items-center px-4 py-2
                                     bg-gray-100 hover:bg-gray-200 border rounded-lg
                                     text-sm font-semibold text-gray-800 transition"
                        >
                          <span>Sources</span>
                          <ChevronUpIcon
                            className={`h-4 w-4 transition-transform ${
                              expandedProjectSub[srcKey] ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {expandedProjectSub[srcKey] && (
                          <div className="p-3 mt-2 bg-white border rounded-lg shadow-sm space-y-2">
                            {res.sources
                              .filter((s) => s && s !== "N/A")
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
