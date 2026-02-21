import {
  calculateOverallRiskFromCategories,
  buildWorstCaseExplanation,
  buildMajorityExplanation,
  getSeverityStyles,
} from "../Common/riskUtils";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { getRiskLabel } from "../Common/riskUtils";
import { capitalizeWords } from "../Common/Utils";
import MacroSectionCard from "./MacroSectionCard";
import SeverityDot from "../Common/SeverityDot";

export default function DueDiligenceReport({
  countryEntry,
  customerEntry,
  projectEntry,
  territoryEntry,
  missingMacros = [],
}) {
  /* ===== COUNTRY ===== */
  // const countryItems =
  //   countryEntry?.data?.map((b, i) => ({
  //     name: countryEntry.selectedCountries[i],
  //     severity: calculateOverallRiskFromCategories(b),
  //   })) || [];

  const countryItems =
    countryEntry?.data?.map((b, i) => {
      const exp = buildMajorityExplanation(b, "categories");

      return {
        name: countryEntry.selectedCountries[i],
        severity: exp.severity,
        description: exp.description,
      };
    }) || [];

  const countryMacro = buildWorstCaseExplanation(countryItems, "countries");

  /* ===== PARTNER ===== */
  const partnerNames = [
    ...(customerEntry?.suppliers || []),
    ...(customerEntry?.customers || []),
    customerEntry?.consortiumPartner,
  ]
    .map((n) => capitalizeWords(n?.trim()))
    .filter(Boolean);

  const partnerItems =
    customerEntry?.data?.map((b, i) => {
      const safe = Array.isArray(b) ? b : [b];
      const exp = buildMajorityExplanation(safe, "categories");

      return {
        name: partnerNames[i],
        severity: exp.severity,
        description: exp.description,
      };
    }) || [];

  const partnerMacro = buildWorstCaseExplanation(partnerItems, "partners");

  /* ===== PROJECT ===== */
  const projectItems = [
    {
      name: capitalizeWords(projectEntry?.projectName || "Project Name"),
      ...buildMajorityExplanation(projectEntry?.data || [], "categories"),
    },
    {
      name: capitalizeWords(territoryEntry?.territoryName || "Territory"),
      ...buildMajorityExplanation(territoryEntry?.data || [], "categories"),
    },
  ];
  const projectMacro = buildWorstCaseExplanation(
    projectItems,
    "project components",
  );

  /* ===== OVERALL ===== */
  const overall = buildWorstCaseExplanation(
    [
      { name: "Country Macro", severity: countryMacro.overall },
      { name: "Partner Macro", severity: partnerMacro.overall },
      { name: "Project Macro", severity: projectMacro.overall },
    ],
    "macro sections",
  );
  // const getRiskLabel = (level) => {
  //   switch (level) {
  //     case "RED":
  //       return "High Risk";
  //     case "ORANGE":
  //       return "Medium Risk";
  //     case "GREEN":
  //       return "Low Risk";
  //     default:
  //       return "N/A";
  //   }
  // };

  return (
    <div className="space-y-4 p-4 border border-gray-500 ">
      {missingMacros.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-sm">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Incomplete Inputs
              </p>

              <p className="text-sm text-yellow-700 mt-1">
                Some macros are missing. Please select:
              </p>

              <ul className="list-disc ml-5 mt-1 text-sm text-yellow-700">
                {missingMacros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="text-xs text-yellow-700 mt-2">
                This Due Diligence report is generated using available data and
                may not represent full risk exposure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FINAL RESULT */}
      {/* <div className="border rounded-lg bg-white p-4">
        <div className="flex justify-between font-semibold">
          <span>Overall Due Diligence Severity</span>
          <span className="flex items-center gap-2">
            <SeverityDot level={overall.overall} />
            {getRiskLabel(overall.overall)}
          </span>
        </div>

        <p className="text-xs text-gray-600 mt-2">{overall.description}</p>
      </div> */}

      {/* <div className="rounded-2xl border p-5 shadow-sm  bg-gray-200 ">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Overall Due Diligence Severity
          </h2>

          <div className="flex items-center gap-2 text-lg font-bold">
            <SeverityDot level={overall.overall} />
            {getRiskLabel(overall.overall)}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {overall.description}
        </p>
      </div> */}

      <div
        className={`rounded-2xl border-l-4 px-6 py-5 shadow-md ${
          overall.overall === "RED"
            ? "bg-red-50 border-l-red-500 border-red-200"
            : overall.overall === "ORANGE"
              ? "bg-orange-50 border-l-orange-500 border-orange-200"
              : overall.overall === "GREEN"
                ? "bg-green-50 border-l-green-500 border-green-200"
                : "bg-gray-50 border-l-gray-300 border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Overall Due Diligence Severity
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Consolidated macro-level risk evaluation
            </p>
          </div>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border shadow-sm  ${getSeverityStyles(
    overall.overall"
          >
            <SeverityDot level={overall.overall} />
            <span className="text-base font-semibold text-gray-800">
              {getRiskLabel(overall.overall)}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-4 leading-relaxed">
          {overall.description}
        </p>
      </div>

      <MacroSectionCard
        title="Country Macro"
        items={countryItems}
        overall={countryMacro.overall}
        overallLabel={getRiskLabel(countryMacro.overall)}
        description={countryMacro.description}
      />

      <MacroSectionCard
        title="Partner Macro"
        items={partnerItems}
        overall={partnerMacro.overall}
        overallLabel={getRiskLabel(partnerMacro.overall)}
        description={partnerMacro.description}
      />

      <MacroSectionCard
        title="Project Macro"
        items={projectItems}
        overall={projectMacro.overall}
        overallLabel={getRiskLabel(projectMacro.overall)}
        description={projectMacro.description}
      />
    </div>
  );
}
