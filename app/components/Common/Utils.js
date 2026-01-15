export const capitalizeWords = (str = "") =>
  str.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const allValuesNA = (obj) => {
  if (!obj || typeof obj !== "object") return true;
  if (Array.isArray(obj)) return obj.length === 0 || obj.every(allValuesNA);
  return Object.values(obj).every((v) => {
    if (["N/A", "No Data", "", null].includes(v)) return true;
    if (typeof v === "object") return allValuesNA(v);
    return false;
  });
};



// export const allValuesNA = (value) => {
//   // null / undefined
//   if (value == null) return true;

//   // strings
//   if (typeof value === "string") {
//     const v = value.trim().toLowerCase();
//     return v === "" || v === "n/a" || v === "no data";
//   }

//   // numbers → VALID DATA
//   if (typeof value === "number") return false;

//   // arrays
//   if (Array.isArray(value)) {
//     return (
//       value.length === 0 ||
//       value.every((item) => allValuesNA(item))
//     );
//   }

//   // objects
//   if (typeof value === "object") {
//     return Object.values(value).every((v) => allValuesNA(v));
//   }

//   return true;
// };











export const getCategoryColor = (severity) => {
  switch (severity) {
    case "RED": return "#ffe6e6";
    case "ORANGE": return "#fff3e0";
    case "GREEN": return "#e6ffe6";
    default: return "#f9f9f9";
  }
};
