"use client";
import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { capitalizeWords, allValuesNA } from "../Common/Utils";
import SeverityDot from "../Common/SeverityDot";

export default function RenderProjectMacro({
  content,
  index,
  expandedProjectSub,
  setExpandedProjectSub,
}) {
  console.count("RenderProjectMacro rendered");
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
        {/* <span>{capitalizeWords(content.category || "Project Section")}</span> */}

        {/* LEFT: Severity dot + Category */}
        <span className="flex items-center gap-2">
          <SeverityDot level={content.overall_severity} />
          {capitalizeWords(content.category || "Project Section")}
        </span>
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
                  <span className="flex items-center gap-2">
                    <SeverityDot level={res.overall_severity} />
                    {res.sub_category}
                  </span>
                  <ChevronUpIcon
                    className={`h-4 w-4 transition-transform ${
                      expandedProjectSub[subKey] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedProjectSub[subKey] && (
                  <div className="p-4 space-y-5 text-sm text-gray-700">
                    {/* ALLEGATIONS */}

                    {/* ALLEGATIONS */}
                    {res.analysis?.allegations?.items &&
                      res.analysis.allegations.items.some(
                        (a) => !allValuesNA(a),
                      ) && (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {res.analysis.allegations.items.map((a, i) => {
                            if (allValuesNA(a)) return null;

                            return (
                              <div
                                key={i}
                                className="h-full w-full border rounded-lg bg-white shadow-sm p-4 space-y-2"
                              >
                                <p>
                                  <b>Title:</b> {a.title}
                                </p>

                                {a.link && (
                                  <p>
                                    <b>Link:</b>{" "}
                                    <a
                                      href={a.link}
                                      target="_blank"
                                      className="text-blue-600 underline break-all"
                                    >
                                      {a.link}
                                    </a>
                                  </p>
                                )}

                                <p>
                                  <b>Published Date:</b> {a.published_date}
                                </p>
                                <p>
                                  <b>Description:</b> {a.description}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* PROJECT SITE / ENVIRONMENT DATA */}
                    {res.analysis &&
                      !res.analysis.allegations &&
                      !res.analysis.queries && (
                        <div className="space-y-4">
                          {Object.entries(res.analysis).map(
                            ([key, value], vi) => {
                              // if (!value || allValuesNA(value)) return null;

                              if (
                                !value ||
                                (allValuesNA(value) &&
                                  !(
                                    Array.isArray(value.results) &&
                                    value.results.some(
                                      (r) =>
                                        typeof r === "string" &&
                                        r.trim() !== "",
                                    )
                                  ))
                              )
                                return null;

                              const envKey = `env-${index}-${idx}-${vi}`;

                              return (
                                <div
                                  key={envKey}
                                  className="border rounded-lg bg-white"
                                >
                                  {/* SECTION HEADER */}
                                  {/* <button
                                    onClick={() => toggle(envKey)}
                                    className="w-full flex justify-between items-center px-4 py-2
                         bg-gray-100 hover:bg-gray-200 rounded-lg
                         text-sm font-semibold text-gray-800"
                                  >
                                    <span>
                                      {capitalizeWords(
                                        key.replaceAll("_", " ")
                                      )}
                                    </span>
                                    <ChevronUpIcon
                                      className={`h-4 w-4 transition-transform ${
                                        expandedProjectSub[envKey]
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button> */}

                                  <button
                                    onClick={() => toggle(envKey)}
                                    className="w-full flex justify-between items-center px-4 py-2
             bg-gray-100 hover:bg-gray-200 rounded-lg
             text-sm font-semibold text-gray-800"
                                  >
                                    {/* LEFT: Severity dot + Analysis name */}
                                    {/* <span className="flex items-center gap-2">
                                      {value.severity && (
                                        <SeverityDot level={value.severity} />
                                      )}
                                      {capitalizeWords(
                                        key.replaceAll("_", " ")
                                      )}
                                    </span> */}

                                    <span className="flex items-center gap-2">
                                      <SeverityDot level={value.severity} />
                                      {capitalizeWords(
                                        key.replaceAll("_", " "),
                                      )}
                                    </span>

                                    {/* RIGHT: Chevron */}
                                    <ChevronUpIcon
                                      className={`h-4 w-4 transition-transform ${
                                        expandedProjectSub[envKey]
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>

                                  {expandedProjectSub[envKey] && (
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                                      {Array.isArray(value.results) &&
                                        value.results.map((item, ii) => (
                                          <div
                                            key={ii}
                                            className="p-3 border rounded-md bg-gray-50"
                                          >
                                            {typeof item === "string" ? (
                                              <p>• {item}</p>
                                            ) : (
                                              <>
                                                <p>
                                                  <b>Name:</b> {item.name}
                                                </p>
                                                <p>
                                                  <b>Distance:</b>{" "}
                                                  {item.distance} km
                                                </p>
                                                {/* <p>
                                                  <b>Severity:</b>{" "}
                                                  {item.severity}
                                                </p> */}

                                                {item.severity && (
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                      Severity:
                                                    </span>
                                                    <SeverityDot
                                                      level={item.severity}
                                                    />
                                                    <span>{item.severity}</span>
                                                  </div>
                                                )}

                                                <p>
                                                  <b>Risk Level:</b>{" "}
                                                  {item.risk_level}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                        ))}

                                      {(value.severity || value.risk_level) && (
                                        <div className="pt-2 text-xs text-gray-600 border-t">
                                          {/* {value.severity && (
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">
                                                Overall Severity:
                                              </span>
                                              <SeverityDot
                                                level={value.severity}
                                              />
                                              <span>{value.severity}</span>
                                            </div>
                                          )} */}
                                          {value.risk_level && (
                                            <p>
                                              <b>Overall Risk:</b>{" "}
                                              {value.risk_level}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
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
