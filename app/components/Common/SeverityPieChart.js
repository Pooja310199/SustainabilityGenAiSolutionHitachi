


// import { Pie } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Chart as ChartJS } from "chart.js/auto";

// ChartJS.register(ChartDataLabels);

// const SeverityPieChart = ({ categories = [] }) => {
//   const result = { high: 0, medium: 0, low: 0 };

//   categories.forEach((item) => {
//     const severity = item?.overall_severity?.toUpperCase();

//     if (["RED", "HIGH", "CRITICAL"].includes(severity)) result.high++;
//     else if (["ORANGE", "MEDIUM"].includes(severity)) result.medium++;
//     else if (["GREEN", "LOW"].includes(severity)) result.low++;
//   });

//   const data = {
//     labels: ["High", "Medium", "Low"], // can keep or remove (not shown anyway)
//     datasets: [
//       {
//         data: [result.high, result.medium, result.low],
//         backgroundColor: ["#ff4d4f", "#faad14", "#52c41a"],
//         borderWidth: 0, // cleaner look
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       legend: {
//         display: false, // ❌ hide labels
//       },
//       title: {
//         display: false, // ❌ hide title
//       },
//       datalabels: {
//         display: false, // ❌ hide %
//       },
//     },
//   };

//   return (
//     <div style={{ width: 220, margin: "10px auto" }}>
//       <Pie data={data} options={options} />
//     </div>
//   );
// };

// export default SeverityPieChart;



import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";

ChartJS.register(ArcElement);



const needlePlugin = {
  id: "needle",
  afterDraw: (chart) => {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta?.data?.length) return;

    const data = chart.data.datasets[0].data;

    const highValue = data[2]; // index 2 = RED

    // ❌ If no high risk → don't show needle
    if (highValue === 0) return;

    // ✅ Always point to RED segment
    const arc = meta.data[2] // RED segment


    const angle = (arc.startAngle + arc.endAngle) / 2;

    const cx = arc.x;
    const cy = arc.y;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // needle
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(80, 0);
    ctx.lineTo(0, 4);
    ctx.fillStyle = "#000";
    ctx.fill();

    // center dot
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  },
};










ChartJS.register(needlePlugin);

const SeverityPieChart = ({ categories = [] }) => {
  const result = { high: 0, medium: 0, low: 0 };

  categories.forEach((item) => {
    const severity = item?.overall_severity?.toUpperCase();

    if (["RED", "HIGH", "CRITICAL"].includes(severity)) result.high++;
    else if (["ORANGE", "MEDIUM"].includes(severity)) result.medium++;
    else if (["GREEN", "LOW"].includes(severity)) result.low++;
  });

  const data = {
    datasets: [
      {
        data: [result.low, result.medium, result.high],
        backgroundColor: ["#52c41a", "#faad14", "#ff4d4f"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    rotation: -90,          // start from left
    circumference: 180,     // half circle
    cutout: "75%",          // thickness
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div style={{ width: 260, margin: "20px auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default SeverityPieChart;
