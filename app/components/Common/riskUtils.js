// components/Common/riskUtils.js
export function calculateOverallRiskFromCategories(categories = []) {
  if (!Array.isArray(categories) || categories.length === 0) return "N/A";

  const weight = {
    RED: 3,
    ORANGE: 2,
    GREEN: 1,
    "N/A": 0,
    "No Data": 0,
  };

  const counts = {};

  categories.forEach((cat) => {
    const sev = cat?.overall_severity || "N/A";
    counts[sev] = (counts[sev] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // majority
      return weight[b[0]] - weight[a[0]];   // tie → higher risk
    })[0]?.[0] || "N/A";
}
export function calculateWorstCaseRisk(severities = []) {
  if (!Array.isArray(severities) || severities.length === 0) return null;

  const weight = {
    RED: 3,
    ORANGE: 2,
    GREEN: 1,
  };

  return severities
    .filter((s) => weight[s])
    .sort((a, b) => weight[b] - weight[a])[0] || null;
}
