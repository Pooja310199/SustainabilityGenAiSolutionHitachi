


// components/Common/riskUtils.js

const weight = {
  RED: 3,
  ORANGE: 2,
  GREEN: 1,
  "N/A": 0,
  "No Data": 0,
};

export function calculateOverallRiskFromCategories(categories = []) {
  if (!Array.isArray(categories) || !categories.length) return "N/A";

  const counts = {};

  categories.forEach((cat) => {
    const sev = cat?.overall_severity || "N/A";
    counts[sev] = (counts[sev] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // majority
      return weight[b[0]] - weight[a[0]]; // tie → higher risk
    })[0]?.[0];
}

export function calculateWorstCaseRisk(severities = []) {
  return severities
    .filter((s) => weight[s])
    .sort((a, b) => weight[b] - weight[a])[0] || "N/A";
}

/* =========================
   AUTO EXPLANATION ENGINE
========================= */

export function buildWorstCaseExplanation(items = [], label = "items") {
  const valid = items.filter((i) => weight[i.severity] > 0);

  if (!valid.length) {
    return {
      overall: "N/A",
      description: `No valid ${label} available.`,
    };
  }

  const overall = calculateWorstCaseRisk(
    valid.map((i) => i.severity)
  );

  const highest = valid.filter((i) => i.severity === overall);
  const names = highest.map((i) => i.name).join(", ");

  return {
    overall,
    description: `Out of ${valid.length} ${label}, ${names} ${highest.length > 1 ? "have" : "has"
      } ${overall} risk, so overall ${label} risk is ${overall} (worst case).`,
  };
}

export function calculateCountryMacroRisk(countryData = []) {
  if (!Array.isArray(countryData) || countryData.length === 0)
    return "N/A";

  const weight = {
    RED: 3,
    ORANGE: 2,
    GREEN: 1,
    "N/A": 0,
    "No Data": 0,
  };

  let macroRisk = "N/A";

  for (const categories of countryData) {
    // Step 1 → country risk
    const countryRisk =
      calculateOverallRiskFromCategories(categories);

    // Step 2 → highest risk wins
    if (weight[countryRisk] > weight[macroRisk]) {
      macroRisk = countryRisk;
    }
  }

  return macroRisk;
}
export function calculatePartnerMacroRisk(partnerData = []) {
  if (!Array.isArray(partnerData) || partnerData.length === 0)
    return "N/A";

  const partnerRisks = partnerData.map((partnerBlock) =>
    calculateOverallRiskFromCategories(
      Array.isArray(partnerBlock) ? partnerBlock : [partnerBlock]
    )
  );

  // highest risk wins
  return calculateWorstCaseRisk(partnerRisks) || "N/A";
}


export function calculateProjectMacroRisk(
  projectData = [],
  territoryData = []
) {
  const projectRisk =
    projectData?.length > 0
      ? calculateOverallRiskFromCategories(projectData)
      : null;

  const territoryRisk =
    territoryData?.length > 0
      ? calculateOverallRiskFromCategories(territoryData)
      : null;

  return calculateWorstCaseRisk([projectRisk, territoryRisk]);
}


// export function buildMajorityExplanation(categories = [], label = "categories") {
//   if (!Array.isArray(categories) || !categories.length) {
//     return {
//       severity: "N/A",
//       description: `No ${label} available.`,
//       counts: {},
//     };
//   }

//   const counts = {};

//   categories.forEach((cat) => {
//     const sev = cat?.overall_severity || "N/A";
//     counts[sev] = (counts[sev] || 0) + 1;
//   });

//   const severity = calculateOverallRiskFromCategories(categories);

//   const total = Object.values(counts).reduce((a, b) => a + b, 0);
//   const majorityCount = counts[severity] || 0;

//   return {
//     severity,
//     counts,
//     description:
//       `Out of ${total} ${label}, ${majorityCount} are ${severity}. ` +
//       `Since ${severity} is the majority severity, overall ${label} risk is ${severity}.`,
//   };
// }
export const getRiskLabel = (level) => {
  switch (level) {
    case "RED":
      return "High Risk";
    case "ORANGE":
      return "Medium Risk";
    case "GREEN":
      return "Low Risk";
    default:
      return "N/A";
  }
};



export function buildMajorityExplanation(
  categories = [],
  label = "categories"
) {
  if (!Array.isArray(categories) || !categories.length) {
    return {
      severity: "N/A",
      description: `No ${label} available.`,
      counts: {},
    };
  }

  const counts = {};
  const categoryNames = {
    RED: [],
    ORANGE: [],
  };

  categories.forEach((cat) => {
    const sev = cat?.overall_severity || "N/A";
    const name = cat?.category || cat?.name || "Unknown";

    counts[sev] = (counts[sev] || 0) + 1;

    // collect red & orange category names
    if (sev === "RED" || sev === "ORANGE") {
      categoryNames[sev].push(name);
    }
  });

  const severity = calculateOverallRiskFromCategories(categories);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const majorityCount = counts[severity] || 0;

  const redText =
    categoryNames.RED.length > 0
      ? ` High-risk categories: ${categoryNames.RED.join(", ")}.`
      : "";

  const orangeText =
    categoryNames.ORANGE.length > 0
      ? ` Medium-risk categories: ${categoryNames.ORANGE.join(", ")}.`
      : "";

  return {
    severity,
    counts,
    description:
      `Out of ${total} ${label}, ${majorityCount} are ${severity}. ` +
      `Since ${severity} is the majority severity, overall ${label} risk is ${severity}.\n\n` +
      (categoryNames.RED.length
        ? `High-risk categories:\n• ${categoryNames.RED.join("\n• ")}\n\n`
        : "") +
      (categoryNames.ORANGE.length
        ? `Medium-risk categories:\n• ${categoryNames.ORANGE.join("\n• ")}`
        : ""),
  };

}
const getSeverityStyles = (level) => {
  switch (level) {
    case "RED":
      return "bg-red-100 border-red-300 text-red-800";
    case "ORANGE":
      return "bg-orange-100 border-orange-300 text-orange-800";
    case "GREEN":
      return "bg-green-100 border-green-300 text-green-800";
    default:
      return "bg-gray-100 border-gray-200 text-gray-600";
  }
};