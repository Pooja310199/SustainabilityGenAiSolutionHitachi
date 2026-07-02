

// "use client";
// import React from "react";
// import SeverityDot from "../Common/SeverityDot";
// import { getCategoryColor } from "../Common/Utils";

// export function renderAdvanced({
//   data,
//   countryName,
//   expandedAdvSections,
//   setExpandedAdvSections,
// }) {
//   if (!data || !Array.isArray(data)) return null;

//   // ✅ CLEAN DATA
//   const cleanedData = data
//     .map((cat) => {
//       if (!cat || !Array.isArray(cat.results)) return null;

//       const validResults = cat.results.filter((r) => {
//         if (!r) return false;

//         const hasValidMetrics =
//           r.metrics &&
//           Object.values(r.metrics).some((v) => {
//             if (!v) return false;

//             if (typeof v === "object") {
//               return Object.values(v).some(
//                 (val) =>
//                   val !== null &&
//                   val !== "N/A" &&
//                   !(Array.isArray(val) && val.length === 0)
//               );
//             }

//             return v !== "N/A";
//           });

//         const hasValidAnalysis =
//           r.analysis &&
//           Object.values(r.analysis).some(
//             (v) => v && !(Array.isArray(v) && v.length === 0)
//           );

//         const hasSources = r.sources && r.sources.length > 0;

//         return hasValidMetrics || hasValidAnalysis || hasSources;
//       });

//       return {
//         ...cat,
//         category: (cat.category || "Unknown").trim(),
//         results: validResults,
//       };
//     })
//     .filter((cat) => cat && cat.results.length > 0);

//   return (

//     <div className="space-y-6">
//       {cleanedData.map((categoryBlock, i) => {
//         const sectionKey = `${countryName}_${categoryBlock.category}`;
//         const isOpen = expandedAdvSections[sectionKey];

//         return (
//           <div
//             key={i}
//             className="rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden transition hover:shadow-lg"
//           >
//             {/* HEADER */}
//             <div
//               onClick={() =>
//                 setExpandedAdvSections((prev) => ({
//                   ...prev,
//                   [sectionKey]: !prev[sectionKey],
//                 }))
//               }
//               className="cursor-pointer flex justify-between items-center px-5 py-4"
//               style={{
//                 backgroundColor: getCategoryColor(
//                   categoryBlock.overall_severity
//                 ),
//               }}
//             >
//               <div className="flex items-center gap-3">
//                 <SeverityDot level={categoryBlock.overall_severity} />
//                 <h3 className="font-semibold text-gray-900 text-base">
//                   {categoryBlock.category}
//                 </h3>
//               </div>

//               <span className="text-sm text-gray-600">
//                 {isOpen ? "▲" : "▼"}
//               </span>
//             </div>

//             {/* BODY */}
//             {isOpen && (
//               <div className="p-5 space-y-4 bg-gray-50">
//                 {categoryBlock.results.map((result, rIdx) => {
//                   const title =
//                     result.category ||
//                     result.sub_category ||
//                     "Unnamed Section";

//                   const hasMetrics =
//                     result.metrics &&
//                     Object.keys(result.metrics).length > 0;

//                   const hasAnalysis =
//                     result.analysis &&
//                     Object.keys(result.analysis).length > 0;

//                   const hasSources =
//                     result.sources && result.sources.length > 0;

//                   if (!hasMetrics && !hasAnalysis && !hasSources) {
//                     return null;
//                   }

//                   return (
//                     <div
//                       key={rIdx}
//                       className="rounded-xl border border-gray-100 p-4 bg-white hover:shadow-sm transition"
//                     >
//                       {/* TITLE */}
//                       <h4 className="font-semibold text-gray-800 text-sm mb-3">
//                         {title}
//                       </h4>

//                       {/* METRICS */}
//                       {hasMetrics && (
//                         <div className="grid grid-cols-2 gap-3 text-sm mb-3">
//                           {Object.entries(result.metrics).map(
//                             ([key, value]) => {
//                               if (
//                                 value === null ||
//                                 value === undefined ||
//                                 value === "N/A"
//                               )
//                                 return null;

//                               if (typeof value === "object") {
//                                 if (Object.keys(value).length === 0)
//                                   return null;

//                                 return (
//                                   <div
//                                     key={key}
//                                     className="col-span-2 bg-gray-50 rounded-lg p-3 border"
//                                   >
//                                     <p className="text-xs text-gray-500 capitalize mb-1">
//                                       {key.replace(/_/g, " ")}
//                                     </p>

//                                     <div className="space-y-1 text-xs">
//                                       {Object.entries(value).map(
//                                         ([k, v]) => {
//                                           if (
//                                             v === null ||
//                                             v === undefined ||
//                                             v === "N/A"
//                                           )
//                                             return null;

//                                           return (
//                                             <p key={k}>
//                                               <span className="text-gray-500">
//                                                 {k}:
//                                               </span>{" "}
//                                               <span className="text-gray-800">
//                                                 {typeof v === "object"
//                                                   ? JSON.stringify(v)
//                                                   : String(v)}
//                                               </span>
//                                             </p>
//                                           );
//                                         }
//                                       )}
//                                     </div>
//                                   </div>
//                                 );
//                               }

//                               return (
//                                 <div
//                                   key={key}
//                                   className="bg-gray-50 rounded-lg p-3 border"
//                                 >
//                                   <p className="text-xs text-gray-500 capitalize">
//                                     {key.replace(/_/g, " ")}
//                                   </p>
//                                   <p className="font-medium text-gray-800">
//                                     {String(value)}
//                                   </p>
//                                 </div>
//                               );
//                             }
//                           )}
//                         </div>
//                       )}

//                       {/* ANALYSIS */}
//                       {hasAnalysis && (
//                         <div className="text-sm mb-3">
//                           <p className="font-medium text-gray-700 mb-1">
//                             Analysis
//                           </p>
//                           <div className="bg-gray-100 p-3 rounded-lg text-gray-700 text-xs leading-relaxed overflow-x-auto">
//                             {JSON.stringify(result.analysis, null, 2)}
//                           </div>
//                         </div>
//                       )}

//                       {/* SOURCES */}
//                       {hasSources && (
//                         <div className="text-sm mb-2">
//                           <p className="font-medium text-gray-700 mb-1">
//                             Sources
//                           </p>
//                           <ul className="list-disc ml-5 text-blue-500 text-xs space-y-1">
//                             {result.sources.map((src, i) => (
//                               <li key={i}>
//                                 <a
//                                   href={src}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="hover:underline"
//                                 >
//                                   {src}
//                                 </a>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       {/* FOOTER */}
//                       <div className="text-xs text-gray-400 mt-2 border-t pt-2">
//                         Severity:{" "}
//                         <span className="font-medium">
//                           {result.overall_severity || "N/A"}
//                         </span>{" "}
//                         • Risk:{" "}
//                         <span className="font-medium">
//                           {result.overall_risk_level || "N/A"}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>

//   );
// }



"use client";

import React from "react";
import SeverityDot from "../Common/SeverityDot";
import { getCategoryColor } from "../Common/Utils";

/* ---------------------------------- */
/* HELPERS */
/* ---------------------------------- */

const isEmptyValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "N/A"
  ) {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }

  return false;
};

const formatKey = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------------------------------- */
/* TABLE DETECTION */
/* ---------------------------------- */

const isTableData = (arr) => {
  if (!Array.isArray(arr)) return false;
  if (arr.length === 0) return false;

  return arr.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item)
  );
};

/* ---------------------------------- */
/* TABLE RENDER */
/* ---------------------------------- */

const RenderTable = ({ data }) => {
  if (!data?.length) return null;

  const headers = [
    ...new Set(data.flatMap((obj) => Object.keys(obj))),
  ];

  return (
    <div className="overflow-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-xs">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
              >
                {formatKey(header)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-t hover:bg-gray-50"
            >
              {headers.map((header) => (
                <td
                  key={header}
                  className="px-3 py-2 text-gray-900 font-medium whitespace-nowrap"
                >
                  {String(row[header] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ---------------------------------- */
/* RECURSIVE RENDER */
/* ---------------------------------- */

const RenderValue = ({ value, depth = 0 }) => {
  if (isEmptyValue(value)) return null;

  /* STRING / NUMBER / BOOLEAN */
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return (
      <span className="text-gray-900 font-medium break-words">
        {String(value)}
      </span>
    );
  }

  /* ARRAY */
  if (Array.isArray(value)) {
    if (isTableData(value)) {
      return <RenderTable data={value} />;
    }

    return (
      <div className="space-y-2">
        {value.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-3"
          >
            <RenderValue
              value={item}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>
    );
  }

  /* OBJECT */
  if (typeof value === "object") {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([k, v]) => {
          if (isEmptyValue(v)) return null;

          const isSeverity =
            k.toLowerCase().includes("severity");

          const isRisk =
            k.toLowerCase().includes("risk");

          return (
            <div
              key={k}
              className="rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <p className="text-xs font-bold tracking-wide text-gray-700 uppercase">
                  {formatKey(k)}
                </p>
                {isSeverity &&
                  typeof v === "string" && (
                    <div className="flex items-center gap-2">
                      <SeverityDot level={v} />

                      <span className="text-xs font-semibold text-gray-800">
                        {v}
                      </span>
                    </div>
                  )}

                {isRisk &&
                  typeof v === "string" && (
                    <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-gray-200 text-gray-800">
                      {v}
                    </span>
                  )}
              </div>

              <div className="text-sm">
                <RenderValue
                  value={v}
                  depth={depth + 1}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

/* ---------------------------------- */
/* MAIN */
/* ---------------------------------- */

export function renderAdvanced({
  data,
  countryName,
  expandedAdvSections,
  setExpandedAdvSections,
}) {
  if (!data || !Array.isArray(data)) return null;

  const cleanedData = data
    .map((cat) => {
      if (!cat || !Array.isArray(cat.results))
        return null;

      return {
        ...cat,
        category: (cat.category || "Unknown").trim(),
        results: cat.results.filter(Boolean),
      };
    })
    .filter(
      (cat) =>
        cat &&
        Array.isArray(cat.results) &&
        cat.results.length > 0
    );

  return (
    <div className="space-y-6">
      {cleanedData.map((categoryBlock, i) => {
        const sectionKey = `${countryName}_${categoryBlock.category}`;

        const isOpen =
          expandedAdvSections?.[sectionKey];

        return (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-sm"
          >
            {/* HEADER */}
            <div
              onClick={() =>
                setExpandedAdvSections((prev) => ({
                  ...prev,
                  [sectionKey]:
                    !prev?.[sectionKey],
                }))
              }
              className="cursor-pointer px-6 py-5 flex items-center justify-between transition-all"
              style={{
                backgroundColor: getCategoryColor(
                  categoryBlock.overall_severity
                ),
              }}
            >
              <div className="flex items-center gap-3">
                <SeverityDot
                  level={
                    categoryBlock.overall_severity
                  }
                />

                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    {categoryBlock.category}
                  </h2>

                  <p className="text-xs text-gray-700 mt-1">
                    Risk Level:{" "}
                    {
                      categoryBlock.overall_risk_level
                    }
                  </p>
                </div>
              </div>

              <div className="text-xl text-gray-700">
                {isOpen ? "−" : "+"}
              </div>
            </div>

            {/* BODY */}
            {isOpen && (
              <div className="bg-gray-50 p-5 space-y-5">
                {categoryBlock.results.map(
                  (result, idx) => {
                    const title =
                      result.category ||
                      result.sub_category ||
                      "Unnamed Section";

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        {/* TITLE */}
                        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <SeverityDot
                                level={result.overall_severity}
                              />

                              <h3 className="text-lg font-bold text-gray-950">
                                {title}
                              </h3>
                            </div>

                            <div className="flex gap-2 mt-2 flex-wrap">
                              {result.overall_severity && (
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-semibold"
                                  style={{
                                    backgroundColor: getCategoryColor(
                                      result.overall_severity
                                    ),
                                  }}
                                >
                                  {result.overall_severity}
                                </span>
                              )}

                              {result.overall_risk_level && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  {result.overall_risk_level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* METRICS */}
                        {result.metrics && (
                          <div className="mb-6">
                            <h4 className="text-sm font-extrabold text-gray-900 mb-3">
                              Metrics
                            </h4>

                            <RenderValue
                              value={result.metrics}
                            />
                          </div>
                        )}

                        {/* ANALYSIS */}
                        {result.analysis && (
                          <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-800 mb-3">
                              Analysis
                            </h4>

                            <RenderValue
                              value={result.analysis}
                            />
                          </div>
                        )}

                        {/* SOURCES */}
                        {Array.isArray(
                          result.sources
                        ) &&
                          result.sources.length >
                          0 && (
                            <div>
                              <h4 className="text-sm font-bold text-gray-800 mb-2">
                                Sources
                              </h4>

                              <div className="flex flex-col gap-2">
                                {result.sources.map(
                                  (src, sIdx) => (
                                    <a
                                      key={sIdx}
                                      href={src}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs  text-blue-700 font-medium hover:underline break-all"
                                    >
                                      {src}
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}