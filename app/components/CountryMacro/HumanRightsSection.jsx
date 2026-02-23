import SeverityDot from "../Common/SeverityDot";
import { capitalizeWords, allValuesNA } from "../Common/Utils";

const HumanRightsSection = ({
  content,
  countryName,
  category,
  expandedSubIndicators,
  setExpandedSubIndicators,
}) => {
  if (!Array.isArray(content?.results)) return null;

  const toggle = (key) => {
    setExpandedSubIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isValidText = (val) =>
    typeof val === "string" && val.trim() !== "" && val !== "No data";

  const isRealValue = (val) =>
    typeof val === "string" &&
    val.trim() !== "" &&
    val.trim().toLowerCase() !== "n/a" &&
    val.trim().toLowerCase() !== "no data";

  const extractItemsBlock = (val) => {
    if (!val || typeof val !== "object") return null;

    // Direct items
    if (Array.isArray(val.items)) return val;

    // Nested items (cases, lawsuit, caselaw, court_cases, etc.)
    for (const v of Object.values(val)) {
      if (v && typeof v === "object" && Array.isArray(v.items)) {
        return v;
      }
    }

    return null;
  };

  const renderExtraFields = (item) =>
    Object.entries(item)
      .filter(([key, val]) => {
        if (
          [
            "title",
            "url",
            "link",
            "date",
            "status",
            "summary",
            "keywords",
            "country",
          ].includes(key)
        )
          return false;

        // Skip empty / useless values
        if (val == null) return false;
        if (typeof val === "string" && !isValidText(val)) return false;

        return true;
      })
      .map(([key, val], idx) => (
        <div
          key={idx}
          style={{
            fontSize: 12,
            marginTop: 4,
            wordBreak: "break-word", // ✅ ADD HERE
            overflowWrap: "anywhere",
          }}
        >
          <strong>{capitalizeWords(key.replaceAll("_", " "))}:</strong>{" "}
          {Array.isArray(val) ? val.join(", ") : val}
        </div>
      ));

  return (
    <div style={{ marginTop: 16, marginLeft: 18 }}>
      {content.results.map((res, i) => {
        const hrKey = `${countryName}_${category}_HR_${i}`;
        const subCategory = (res.sub_category || "").toLowerCase().trim();

        const headerSeverity =
          res.overall_severity ||
          res.analysis?.severity ||
          res.metrics?.severity;

        return (
          <div
            key={i}
            style={{
              marginBottom: 20,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            {/* ===== HEADER ===== */}
            <div
              onClick={() => toggle(hrKey)}
              style={{
                cursor: "pointer",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: 600,
              }}
            >
              <SeverityDot level={headerSeverity} />
              {res.sub_category}
              <span style={{ marginLeft: "auto" }}>
                {expandedSubIndicators[hrKey] ? "▲" : "▼"}
              </span>
            </div>

            {/* ===== CONTENT ===== */}
            {expandedSubIndicators[hrKey] && (
              <div style={{ padding: 14 }}>
                {/* ================= ANALYSIS ================= */}
                {res.analysis &&
                  Object.entries(res.analysis)
                    .filter(([key, val]) => {
                      if (["severity", "risk_level"].includes(key))
                        return false;

                      // ✅ Always allow ECHR, even if empty
                      if (
                        key === "echr_judgements_violations" &&
                        Array.isArray(val)
                      ) {
                        return true;
                      }

                      // ❌ Block other empty arrays
                      if (Array.isArray(val) && val.length === 0) return false;

                      return val != null;
                    })

                    .map(([sectionKey, sectionVal], idx) => {
                      const itemsBlock = extractItemsBlock(sectionVal);
                      const isGridItems = Array.isArray(itemsBlock?.items);

                      const showSummary =
                        sectionKey === "allegations" ||
                        sectionKey === "protests" ||
                        sectionKey === "cases";

                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: 16,
                            padding: 12,
                            background: "#fafafa",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                          }}
                        >
                          {/* SECTION HEADER */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontWeight: 600,
                            }}
                          >
                            <SeverityDot level={sectionVal.severity} />
                            {capitalizeWords(sectionKey.replaceAll("_", " "))}
                          </div>

                          {sectionKey === "echr_judgements_violations" && (
                            <div style={{ marginTop: 10 }}>
                              {sectionVal.length === 0 ? (
                                <div
                                  style={{
                                    fontStyle: "italic",
                                    color: "#777",
                                    paddingLeft: 6,
                                  }}
                                >
                                  No cases reported within ECHR judgments under
                                  the European Court of Human Rights.
                                </div>
                              ) : (
                                <ul style={{ marginTop: 8, marginLeft: 18 }}>
                                  {sectionVal.map((item, j) => (
                                    <li key={j} style={{ marginBottom: 12 }}>
                                      {item.title && (
                                        <strong>{item.title}</strong>
                                      )}

                                      {item.published_date && (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            color: "#666",
                                          }}
                                        >
                                          {" "}
                                          ({item.published_date})
                                        </span>
                                      )}

                                      {item.description && (
                                        <div
                                          style={{
                                            fontSize: 13,
                                            color: "#444",
                                            marginTop: 4,
                                          }}
                                        >
                                          {item.description}
                                        </div>
                                      )}

                                      {item.link && (
                                        <div style={{ marginTop: 4 }}>
                                          <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                              fontSize: 12,
                                              color: "#2563eb",
                                            }}
                                          >
                                            View source
                                          </a>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}

                          {/* ===== GRID CARDS (HR WATCH + BHR LAW) ===== */}
                          {isGridItems && (
                            <div style={{ marginTop: 8 }}>
                              {sectionVal.items.length === 0 ? (
                                <div
                                  style={{
                                    fontStyle: "italic",
                                    color: "#777",
                                  }}
                                >
                                  No cases reported
                                </div>
                              ) : (
                                <ul
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fill, minmax(260px, 1fr))",
                                    gap: 16,
                                    marginTop: 8,
                                    padding: 0,
                                    listStyle: "none",
                                  }}
                                >
                                  {itemsBlock.items.map((item, j) => (
                                    <li
                                      key={j}
                                      style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 8,
                                        padding: 12,
                                        background: "#fff",
                                      }}
                                    >
                                      {isValidText(item.title) && (
                                        <strong>{item.title}</strong>
                                      )}

                                      {isValidText(item.date) && (
                                        <div
                                          style={{
                                            fontSize: 12,
                                            color: "#555",
                                          }}
                                        >
                                          <strong>Date:</strong> {item.date}
                                        </div>
                                      )}

                                      {isValidText(item.status) && (
                                        <div style={{ fontSize: 12 }}>
                                          <strong>Status:</strong> {item.status}
                                        </div>
                                      )}

                                      {renderExtraFields(item)}

                                      {showSummary &&
                                        isValidText(item.summary) && (
                                          <div
                                            style={{
                                              fontSize: 13,
                                              marginTop: 6,
                                              color: "#444",
                                            }}
                                          >
                                            {item.summary}
                                          </div>
                                        )}

                                      {(item.url || item.link) && (
                                        <div style={{ marginTop: 6 }}>
                                          <a
                                            href={item.url || item.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                              fontSize: 12,
                                              color: "#2563eb",
                                            }}
                                          >
                                            View source
                                          </a>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}

                          {/* ===== WORLD COURTS ===== */}
                          {Array.isArray(sectionVal?.results) && (
                            <div style={{ marginTop: 8 }}>
                              {sectionVal.results.length === 0 ? (
                                <div
                                  style={{
                                    fontStyle: "italic",
                                    color: "#777",
                                    paddingLeft: 4,
                                  }}
                                >
                                  No cases reported
                                </div>
                              ) : (
                                <table
                                  style={{
                                    width: "100%",
                                    marginTop: 10,
                                    borderCollapse: "collapse",
                                    fontSize: 13,
                                  }}
                                >
                                  <thead>
                                    <tr style={{ background: "#f3f4f6" }}>
                                      <th
                                        style={{
                                          padding: 6,
                                          textAlign: "left",
                                        }}
                                      >
                                        Title
                                      </th>
                                      <th
                                        style={{
                                          padding: 6,
                                          textAlign: "left",
                                        }}
                                      >
                                        Year
                                      </th>
                                      <th
                                        style={{
                                          padding: 6,
                                          textAlign: "left",
                                        }}
                                      >
                                        Link
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sectionVal.results.map((r, j) => (
                                      <tr
                                        key={j}
                                        style={{
                                          borderTop: "1px solid #e5e7eb",
                                        }}
                                      >
                                        <td style={{ padding: 6 }}>
                                          {r.title}
                                        </td>
                                        <td style={{ padding: 6 }}>
                                          {r.year || "-"}
                                        </td>
                                        <td style={{ padding: 6 }}>
                                          {r.link ? (
                                            <a
                                              href={r.link}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              View
                                            </a>
                                          ) : (
                                            "-"
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                {/* HRMI Rights tracker */}

                {/* ================= HRMI RIGHTS TRACKER ================= */}
                {res.metrics?.hrmi_rights_tracker &&
                  typeof res.metrics.hrmi_rights_tracker === "object" && (
                    <div
                      style={{
                        marginBottom: 16,
                        padding: 12,
                        background: "#fafafa",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontWeight: 600,
                        }}
                      >
                        {/* <SeverityDot level={res.overall_severity} /> */}
                        HRMI Rights Tracker
                      </div>

                      {(() => {
                        const hrmiEntries = Object.entries(
                          res.metrics.hrmi_rights_tracker || {},
                        );

                        const validHrmiCards = hrmiEntries.filter(
                          ([_, rightVal]) => {
                            const subIndicators =
                              rightVal.subindicators ||
                              rightVal.subindicatore ||
                              [];

                            const hasValidSummary = isRealValue(
                              rightVal.summary_score,
                            );

                            const validIndicators = subIndicators.filter(
                              (s) =>
                                isRealValue(s?.name) && isRealValue(s?.value),
                            );

                            return (
                              hasValidSummary || validIndicators.length > 0
                            );
                          },
                        );

                        return (
                          <div style={{ marginTop: 10 }}>
                            {validHrmiCards.length === 0 ? (
                              /* ✅ NO DATA STATE */
                              <div
                                style={{
                                  fontStyle: "italic",
                                  color: "#777",
                                  padding: "6px 8px",
                                }}
                              >
                                No data found for HRMI Rights Tracker
                              </div>
                            ) : (
                              /* ✅ VALID HRMI CARDS */
                              validHrmiCards.map(([rightKey, rightVal], i) => {
                                const subIndicators =
                                  rightVal.subindicators ||
                                  rightVal.subindicatore ||
                                  [];

                                const validIndicators = subIndicators.filter(
                                  (s) =>
                                    isRealValue(s?.name) &&
                                    isRealValue(s?.value),
                                );

                                const hasValidSummary = isRealValue(
                                  rightVal.summary_score,
                                );

                                return (
                                  <div
                                    key={i}
                                    style={{
                                      marginBottom: 14,
                                      padding: 12,
                                      border: "1px solid #e5e7eb",
                                      borderRadius: 8,
                                      background: "#fff",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontWeight: 600,
                                      }}
                                    >
                                      <SeverityDot level={rightVal.severity} />
                                      {capitalizeWords(
                                        rightKey.replaceAll("_", " "),
                                      )}
                                    </div>

                                    {hasValidSummary && (
                                      <div
                                        style={{ fontSize: 13, marginTop: 4 }}
                                      >
                                        <strong>Summary Score:</strong>{" "}
                                        {rightVal.summary_score}
                                      </div>
                                    )}
                                    <ul
                                      style={{ marginTop: 8, marginLeft: 18 }}
                                    >
                                      {validIndicators.map((s, j) => (
                                        <li
                                          key={j}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            marginBottom: 4,
                                          }}
                                        >
                                          {/* ✅ Severity for each sub-indicator */}
                                          {s.severity && (
                                            <SeverityDot level={s.severity} />
                                          )}

                                          <span>
                                            <strong>{s.name}:</strong> {s.value}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                {res.metrics &&
                  Object.entries(res.metrics).map(
                    ([metricKey, metricVal], idx) => {
                      if (!Array.isArray(metricVal)) return null;

                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: 16,
                            padding: 12,
                            background: "#fafafa",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                          }}
                        >
                          {/* METRIC HEADER */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontWeight: 600,
                            }}
                          >
                            {capitalizeWords(metricKey.replaceAll("_", " "))}
                          </div>

                          {/* METRIC LIST */}
                          <ul style={{ marginTop: 8, marginLeft: 18 }}>
                            {metricVal.map((item, j) => (
                              <li key={j} style={{ marginBottom: 10 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  {item.severity && (
                                    <SeverityDot level={item.severity} />
                                  )}
                                  {isValidText(item.index) && (
                                    <strong>{item.index}</strong>
                                  )}
                                </div>

                                {item.value !== undefined && (
                                  <div style={{ fontSize: 13 }}>
                                    <strong>Value:</strong> {item.value}
                                  </div>
                                )}

                                {isValidText(item.index_description) && (
                                  <div style={{ fontSize: 13, color: "#444" }}>
                                    {item.index_description}
                                  </div>
                                )}

                                {isValidText(item.rescaled) && (
                                  <div style={{ fontSize: 12 }}>
                                    <strong>Score:</strong> {item.rescaled}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    },
                  )}

                {/* ================= SOURCES ================= */}
                {Array.isArray(res.sources) && res.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 12,
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      background: "#f9fafb",
                    }}
                  >
                    <strong>Sources</strong>
                    <ul style={{ marginTop: 6, marginLeft: 18 }}>
                      {res.sources
                        .filter(
                          (s) =>
                            typeof s === "string" &&
                            s.trim() !== "" &&
                            s.startsWith("http"),
                        )
                        .map((s, i) => (
                          <li key={i}>
                            <a
                              href={s}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#2563eb" }}
                            >
                              {s}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HumanRightsSection;
