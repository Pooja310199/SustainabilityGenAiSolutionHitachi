const getSeveritySummary = (categories) => {
  let red = 0;
  let green = 0;

  categories.forEach((item) => {
    if (item.overall_severity === "RED") red++;
    if (item.overall_severity === "GREEN") green++;
  });

  const total = red + green;

  return [
    {
      name: "RED",
      value: total ? (red / total) * 100 : 0,
      color: "#ef4444",
    },
    {
      name: "GREEN",
      value: total ? (green / total) * 100 : 0,
      color: "#22c55e",
    },
  ];
};
