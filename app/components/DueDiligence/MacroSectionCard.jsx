import RiskRow from "./RiskRow";
import SeverityDot from "../Common/SeverityDot";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
export default function MacroSectionCard({
  title,
  items,
  overall,
  description,
  overallLabel,
}) {
  const [openItems, setOpenItems] = useState([]);
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition p-5 space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          {title}
        </h3>
      </div>

      {/* Items */}
      {/* <div className="space-y-4">
        {items.map((i) => (
          <div key={i.name} className="space-y-2">
            <RiskRow label={i.name} severity={i.severity} />

            {i.description && (
              <p className="text-sm  text-gray-500 pl-2 whitespace-pre-line leading-relaxed">
                {i.description}
              </p>
            )}
          </div>
        ))}
      </div> */}

      {/* Items (Improved Middle Section) */}
      {/* <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-3">
        <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">
          Risk Factors
        </p>

        <div className="divide-y divide-gray-100">
          {items.map((i) => (
            <div key={i.name} className="py-1 ">
              <RiskRow label={i.name} severity={i.severity} />

              {i.description && (
                <p className="text-base text-gray-600 ml-2 mt-0.5 leading-relaxed whitespace-pre-line">
                  {i.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* Items */}
      {/* Items */}
      <div className="space-y-4">
        {items.map((i, index) => {
          const isOpen = openItems.includes(index);

          const toggleItem = () => {
            if (isOpen) {
              // remove it (collapse)
              setOpenItems(openItems.filter((item) => item !== index));
            } else {
              // add it (expand)
              setOpenItems([...openItems, index]);
            }
          };

          return (
            <div
              key={i.name}
              className={`rounded-xl border-l-4 bg-white p-4 shadow-sm transition-all duration-300 ${
                i.severity === "RED"
                  ? "border-l-red-500 border-gray-200"
                  : i.severity === "ORANGE"
                    ? "border-l-orange-500 border-gray-200"
                    : "border-l-green-500 border-gray-200"
              }`}
            >
              <button onClick={toggleItem} className="w-full text-left">
                <RiskRow label={i.name} severity={i.severity} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                {i.description && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {i.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Overall summary block */}
      {/* <div className="rounded-lg bg-gray-100 px-4 py-3">
        <div className="flex items-center gap-3 font-semibold text-base">
          <span className="flex-1 text-gray-800">
            Overall {title} (Worst Case)
          </span>

          <span className="flex items-center gap-2 px-2 py-1 rounded-md bg-white border border-gray-200">
            <SeverityDot level={overall} />
            {overallLabel || overall}
          </span>
        </div>

        <p className="text-base text-gray-600 mt-2 leading-relaxed">
          {description}
        </p>
      </div> */}
      {/* Overall summary block */}
      <div
        className={`rounded-xl border-l-4 px-5 py-4 shadow-sm ${
          overall === "RED"
            ? "bg-red-50 border-l-red-500 border-red-200"
            : overall === "ORANGE"
              ? "bg-orange-50 border-l-orange-500 border-orange-200"
              : overall === "GREEN"
                ? "bg-green-50 border-l-green-500 border-green-200"
                : "bg-gray-50 border-l-gray-300 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            Overall {title} (Worst Case)
          </span>

          <span className="flex items-center gap-2 px-3 py-1 rounded-md bg-white border shadow-sm">
            <SeverityDot level={overall} />
            <span className="font-semibold text-gray-800">
              {overallLabel || overall}
            </span>
          </span>
        </div>

        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
