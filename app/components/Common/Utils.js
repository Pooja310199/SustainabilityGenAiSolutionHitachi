export const capitalizeWords = (str = "") =>
  String(str ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());


export const allValuesNA = (obj) => {
  if (!obj || typeof obj !== "object") return true;
  if (Array.isArray(obj)) return obj.length === 0 || obj.every(allValuesNA);
  return Object.values(obj).every((v) => {
    if (["N/A", "No Data", "", null].includes(v)) return true;
    if (typeof v === "object") return allValuesNA(v);
    return false;
  });
};













export const getCategoryColor = (severity) => {
  switch (severity) {
    case "RED": return "#ffe6e6";
    case "ORANGE": return "#fff3e0";
    case "GREEN": return "#e6ffe6";
    default: return "#f9f9f9";
  }
};
