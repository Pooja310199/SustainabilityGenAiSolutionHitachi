"use client";
import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import SeverityDot from "../../Common/SeverityDot";
import CustomerRenderer from "../renderCustomer";
import { capitalizeWords } from "../../Common/Utils";
import { calculateOverallRiskFromCategories } from "../../Common/riskUtils";

const CustomerSection = React.memo(function CustomerSection({
  entry,
  viewMode,
  // isOpen,
  // setIsOpen,
  overallPartnerRisk,
  expandSignal,
  collapseSignal,
}) {
  React.useEffect(() => {
    console.log("CustomerSection actually rendered");
  }, []);
  const [expandedCustomerSub, setExpandedCustomerSub] = React.useState({});

  React.useEffect(() => {
    if (!entry?.data) return;

    const allOpen = {};

    entry.data.forEach((custArr, ci) => {
      const safeCust = Array.isArray(custArr) ? custArr : [custArr];

      safeCust.forEach((content, si) => {
        allOpen[`cust-${si}-cat`] = true;

        content.results?.forEach((_, ri) => {
          allOpen[`cust-${si}-sub-${ri}`] = true;
        });
      });
    });

    setExpandedCustomerSub(allOpen);
  }, [expandSignal]);

  React.useEffect(() => {
    setExpandedCustomerSub({});
  }, [collapseSignal]);

  if (!entry) return null;

  /* ===== BUILD PARTNER LIST ===== */

  const allPartners = [
    ...(entry.suppliers || []).map((name) => ({
      name,
      type: "Supplier",
    })),
    ...(entry.customers || []).map((name) => ({
      name,
      type: "Customer",
    })),
    ...(entry.consortiumPartner
      ? [{ name: entry.consortiumPartner, type: "Consortium Partner" }]
      : []),
  ]
    .map((p) => ({ ...p, name: p.name?.trim() }))
    .filter((p) => p.name);

  if (!allPartners.length) return null;

  return (
    // <Disclosure open={isOpen} onChange={setIsOpen}>
    <Disclosure>
      {({ open }) => (
        <div className="border rounded-lg bg-white category-header">
          {/* ===== HEADER ===== */}
          <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
            <div>
              {overallPartnerRisk && (
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  Overall Risk:
                  <SeverityDot level={overallPartnerRisk} />
                  {overallPartnerRisk}
                </div>
              )}

              <span>
                Partner –
                <span className="ml-2 text-sm text-gray-600">
                  {allPartners.map((p) => capitalizeWords(p.name)).join(", ")}
                </span>
              </span>
            </div>

            <ChevronUpIcon
              className={`h-5 w-5 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Disclosure.Button>

          {/* ===== BODY ===== */}
          <Disclosure.Panel className="p-4">
            <div
              className={`flex ${
                allPartners.length === 2 ? "flex-row" : "flex-col"
              } gap-5`}
            >
              {allPartners.map(({ name, type }, index) => {
                const custData = entry.data[index];
                if (!custData) return null;

                const safe = Array.isArray(custData) ? custData : [custData];

                const partnerRisk = calculateOverallRiskFromCategories(safe);

                return (
                  <div
                    key={`${name}-${index}`}
                    className={allPartners.length === 2 ? "w-1/2" : "w-full"}
                  >
                    <div className="text-sm font-semibold mb-2">
                      Results for {capitalizeWords(name)}
                      {partnerRisk && (
                        <span className="flex items-center gap-1 text-xs ml-2">
                          <SeverityDot level={partnerRisk} />
                          {partnerRisk}
                        </span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">{type}</span>
                    </div>

                    {viewMode === "basic" &&
                      safe.map((content, idx) => (
                        <CustomerRenderer
                          key={idx}
                          content={content}
                          index={idx}
                          expandedCustomerSub={expandedCustomerSub}
                          setExpandedCustomerSub={setExpandedCustomerSub}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
});

export default CustomerSection;
