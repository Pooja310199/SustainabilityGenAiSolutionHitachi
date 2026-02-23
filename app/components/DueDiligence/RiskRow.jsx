import SeverityDot from "../Common/SeverityDot";
import { getRiskLabel } from "../Common/riskUtils";

/* ✅ Add it HERE — outside component */
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

export default function RiskRow({ label, severity }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50 transition">
      {/* Left */}
      <span className="text-lg font-semibold text-gray-900 flex-1 min-w-0">
        {label}
      </span>

      {/* Right badge */}
      <span
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md border shrink-0 ${getSeverityStyles(
          severity,
        )}`}
      >
        <SeverityDot level={severity} />
        <span className="text-sm font-semibold">{getRiskLabel(severity)}</span>
      </span>
    </div>
  );
}
