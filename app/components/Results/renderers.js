import SeverityDot from "../Common/SeverityDot";
import { allValuesNA, capitalizeWords, getCategoryColor } from "../Common/Utils";
import HumanRightsSection from "../CountryMacro/HumanRightsSection";

export function renderCategory({
  content,
  index,
  countryName,
  expandedSections,
  setExpandedSections,
  expandedMetrics,
  setExpandedMetrics,
  expandedSources,
  setExpandedSources,
  expandedSubIndicators,
  setExpandedSubIndicators,
}) {
  console.count(`Category ${content.category} rendered`);
  const category = content.category;
  const bgColor = getCategoryColor(content.overall_severity);
  const categoryKey = `${countryName}_${category}`;

  const isConflict = category?.includes("Conflict");
  const isRuleOfLaw = category?.includes("Rule of Law");
  const isCivil = category?.includes("Civil Liberties");
  const isGeo = category?.includes("UN Geoscheme");
  const isHumanRights = category?.includes("Human Rights");
  // const isHumanRights = /human\s*rights/i.test(category || "");

  const isSensitive = category?.includes("Sensitive Country Protocol");



  const toggle = (setter, key) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div key={index} style={{ border: "1px solid #ddd", borderRadius: 8, marginBottom: 20, backgroundColor: "#fff" }}>
      <div className="category-header"
        style={{ backgroundColor: bgColor, padding: "10px 15px", fontWeight: 600, display: "flex", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => toggle(setExpandedSections, categoryKey)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SeverityDot level={content.overall_severity} />
          {category}
        </div>
        <span>{expandedSections[categoryKey] ? "▲" : "▼"}</span>
      </div>

      {expandedSections[categoryKey] && (
        <div style={{ padding: "12px 18px" }}>
          {/* Conflict */}
          {isConflict &&
            (content.items || [])
              .filter((item) => item?.status === "Yes" && !allValuesNA(item))
              .map((item, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <SeverityDot level={item.severity} /> <strong>{item.type}</strong>: {item.summary}
                </div>
              ))}

          {/* UN Geoscheme */}
          {isGeo &&
            (content.items || [])
              .filter((item) => item && !allValuesNA(item))
              .map((item, i) => (
                <div key={i}>
                  <SeverityDot level={item.severity} /> <strong>{item.description}</strong>: {item.summary}
                </div>
              ))}


          {/* Sensitive Country Protocol */}
          {isSensitive && content.metrics && (
            <div style={{ marginTop: 12, marginLeft: 18 }}>

              {/* Country */}
              {content.metrics.country && (
                <div style={{ marginBottom: 8 }}>
                  <strong>Country:</strong> {content.metrics.country}
                </div>
              )}

              {/* Regions */}
              {Array.isArray(content.metrics.regions) && (
                <div style={{ marginTop: 10 }}>
                  <strong>Regions:</strong>
                  <ul style={{ marginTop: 5, marginLeft: 18 }}>
                    {content.metrics.regions.map((region, i) => {
                      const name = region.region || region[0];
                      const status = region.status || region[1];

                      return (
                        <li key={i} style={{ marginBottom: 4 }}>

                          <strong> {name}</strong> — {status}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}


              {/* Severity Array */}
              {Array.isArray(content.metrics.severity) &&
                content.metrics.severity.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <strong>Severity Flags:</strong>
                    <ul style={{ marginTop: 5, marginLeft: 18 }}>
                      {content.metrics.severity.map((sev, i) => (
                        <li key={i}>{sev}</li>
                      ))}
                    </ul>
                  </div>
                )}


            </div>
          )}










          {/* Rule of Law / Civil Liberties Metrics */}
          {(isRuleOfLaw || isCivil) && content.metrics && (
            <div style={{ padding: "12px 18px" }}>
              {(() => {
                const metricsKey = `${countryName}_${category}_metrics`;
                return (
                  <>
                    <div onClick={() => toggle(setExpandedMetrics, metricsKey)} style={{ cursor: "pointer", fontWeight: 500 }}>
                      Metrics {expandedMetrics[metricsKey] ? "▲" : "▼"}
                    </div>

                    {expandedMetrics[metricsKey] && (
                      <div style={{ marginLeft: 10, marginTop: 8 }}>
                        {Object.entries(content.metrics)
                          .filter(([_, val]) => val && typeof val === "object" && !allValuesNA(val))
                          .map(([metric, val]) => {
                            // Democracy Indexes (Rule of Law)
                            if (metric === "democracy_indexes" && typeof val === "object") {
                              const subKey = `${countryName}_${category}_democracy_indexes`;
                              return (
                                <div key={metric} style={{ marginBottom: 12 }}>
                                  <div onClick={() => toggle(setExpandedSubIndicators, subKey)} style={{ cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>Democracy Indexes ({val.year})</span>
                                    <span style={{ fontSize: 14, color: "#444" }}>{expandedSubIndicators[subKey] ? "▼" : "▲"}</span>
                                  </div>

                                  {expandedSubIndicators[subKey] && (
                                    <div style={{ marginLeft: 25, marginTop: 5 }}>
                                      {Object.entries(val)
                                        .filter(([k, v]) => k !== "year" && v && typeof v === "object" && !allValuesNA(v))
                                        .map(([indexName, indexVal], i) => (
                                          <div key={i} style={{ marginBottom: 6, lineHeight: "1.5em" }}>
                                            <SeverityDot level={indexVal.severity} /> <strong>{capitalizeWords(indexName.replaceAll("_", " "))}</strong> →{" "}
                                            {indexVal.value && (<><strong>Value:</strong> {indexVal.value},{" "}</>)}
                                            {indexVal.rescaled && (<><strong>Rescaled:</strong> {indexVal.rescaled},{" "}</>)}
                                            {indexVal.risk_level && (<><strong>Risk:</strong> {indexVal.risk_level}</>)}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            // Freedom House (Civil Liberties)
                            if (metric === "freedom_house" && typeof val === "object") {
                              const fhKey = `${countryName}_${category}_freedom_house`;
                              return (
                                <div key={metric} style={{ marginBottom: 12 }}>
                                  <div onClick={() => toggle(setExpandedSubIndicators, fhKey)} style={{ cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>Freedom House</span>
                                    <span style={{ fontSize: 14, color: "#444" }}>{expandedSubIndicators[fhKey] ? "▼" : "▲"}</span>
                                  </div>

                                  {expandedSubIndicators[fhKey] && (
                                    <div style={{ marginLeft: 25, marginTop: 5 }}>
                                      {Object.entries(val)
                                        .filter(([_, subVal]) => subVal && typeof subVal === "object" && !allValuesNA(subVal))
                                        .map(([subMetric, subVal], i) => (
                                          <div key={i} style={{ marginBottom: 6, lineHeight: "1.5em" }}>
                                            <SeverityDot level={subVal.severity} /> <strong>{capitalizeWords(subMetric)}</strong> →{" "}
                                            {subVal.score && subVal.score !== "N/A" && (<><strong>Score:</strong> {subVal.score},{" "}</>)}
                                            {subVal.rescaled && subVal.rescaled !== "N/A" && (<><strong>Rescaled:</strong> {subVal.rescaled},{" "}</>)}
                                            {subVal.risk_level && subVal.risk_level !== "N/A" && (<><strong>Risk:</strong> {subVal.risk_level}</>)}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            // Default rendering for other metrics
                            const overallSeverity =
                              val.severity ||
                              (typeof val === "object" ? Object.values(val).find((v) => v?.severity)?.severity : "N/A");

                            return (
                              <div key={metric} style={{ marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 6 }}>
                                <SeverityDot level={overallSeverity} />
                                <div style={{ flex: 1 }}>
                                  <strong>{capitalizeWords(metric)}</strong>
                                  {Object.entries(val)
                                    .filter(([k, v]) => typeof v !== "object" && !k.toLowerCase().includes("rescaled") && v !== "N/A" && v !== "No Data" && v !== "" && v !== null)
                                    .map(([k, v], i) => (
                                      <span key={i} style={{ marginLeft: 12 }}>
                                        <strong>{capitalizeWords(k)}:</strong> {v}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Trends & Challenges */}
          {((content.analysis && content.analysis.trends_and_challenges) || content.trends_and_challenges) && (
            <div style={{ marginTop: 12, marginLeft: 18 }}>
              <strong>Trends & Challenges:</strong>
              <ul style={{ marginTop: 5, marginLeft: 18 }}>
                {content.analysis?.trends_and_challenges?.map((t, i) => <li key={`analysis-${i}`}>{t}</li>)}
                {content.trends_and_challenges?.map((t, i) => <li key={`top-${i}`}>{t}</li>)}
              </ul>
            </div>
          )}






          {/* Legal & Institutional Framework (Rule of Law only) */}
          {isRuleOfLaw && content.analysis?.legal_and_institutional_framework && (<div style={{ marginTop: 10, marginLeft: 18 }}> <strong>Legal & Institutional Framework:</strong> <ul style={{ marginTop: 5, marginLeft: 18 }}> {content.analysis.legal_and_institutional_framework.map((t, i) => (<li key={i}>{t}</li>))} </ul> </div>)}

          {/* Human Rights Sections (OWDIN + HRMI) */}




          {isHumanRights && (
            <HumanRightsSection
              content={content}
              countryName={countryName}
              category={category}
              expandedSubIndicators={expandedSubIndicators}
              setExpandedSubIndicators={setExpandedSubIndicators}
            />
          )}





          {/* Sources */}
          {Array.isArray(content.sources) && content.sources.length > 0 && (
            (() => {
              const sourceKey = `${countryName}_${category}_sources`;
              return (
                <>
                  <div onClick={() => toggle(setExpandedSources, sourceKey)} style={{ cursor: "pointer", fontWeight: 500, marginTop: 12, color: "#111827" }}>
                    Sources {expandedSources[sourceKey] ? "▲" : "▼"}
                  </div>
                  {expandedSources[sourceKey] && (
                    <ul style={{ marginTop: 5, marginLeft: 20 }}>
                      {content.sources.filter((s) => s && s.startsWith("http")).map((s, i) => (
                        <li key={i} style={{ lineHeight: "1.6em" }}>
                          <a href={s} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "none" }}
                            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                          >
                            {s}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              );
            })()
          )}




















        </div>
      )}
    </div>
  );
}






