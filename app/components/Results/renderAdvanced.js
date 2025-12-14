import SeverityDot from "../Common/SeverityDot";
import { capitalizeWords, getCategoryColor } from "../Common/Utils";

export function renderAdvanced({
  data,
  countryName,
  expandedAdvSections,
  setExpandedAdvSections,
  expandedQueries,
  setExpandedQueries,
}) {
  if (!Array.isArray(data)) return null;

  const toggle = (setter, key) =>
    setter((prev) => ({ ...prev, [key]: !prev[key] }));

  const categoryKey = `${countryName}_advanced_main`;

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Advanced Main Header */}
      <div
        onClick={() => toggle(setExpandedAdvSections, categoryKey)}
        style={{
          cursor: "pointer",
          fontWeight: "700",
          backgroundColor: "#e5e7eb",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span> {data[0]?.category || "Advanced"}</span>
        <span>{expandedAdvSections[categoryKey] ? "▲" : "▼"}</span>
      </div>

      {expandedAdvSections[categoryKey] && (
        <div style={{ marginLeft: "10px" }}>
          {data[0]?.results?.map((sub, idx) => {
            const subKey = `${countryName}_${sub.subcategory}_${idx}`;
            const severityColor = getCategoryColor(sub.overall_severity); // ✅ Correct position

            return (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  background: "white",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              >
                {/* ✅ Subcategory Header */}
                <div
                  onClick={() => toggle(setExpandedAdvSections, subKey)}
                  style={{
                    padding: "12px 15px",
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    backgroundColor: severityColor,
                    borderRadius: "8px 8px 0 0",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <SeverityDot level={sub.overall_severity} />
                    {sub.subcategory}
                  </div>
                  <span style={{ fontSize: "14px" }}>
                    {expandedAdvSections[subKey] ? "▲" : "▼"}
                  </span>
                </div>

                {expandedAdvSections[subKey] && (
                  <div style={{ padding: "10px 15px" }}>
                    {/* Metrics */}
                    {renderSubcategory(sub, countryName, expandedQueries, setExpandedQueries)}

                    {/* Analysis (always visible) */}
                    {sub.analysis && (
                      <div style={{ marginTop: "10px" }}>
                        {Object.entries(sub.analysis).map(([k, v], i) => (
                          <div key={i} style={{ marginBottom: "8px", lineHeight: "1.5rem" }}>
                            <strong>{capitalizeWords(k.replaceAll("_", " "))}:</strong> {v}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sources (collapsible only) */}
                    {Array.isArray(sub.sources) && sub.sources.length > 0 && (
                      <div style={{ marginTop: "10px" }}>
                        {renderSources(
                          sub.sources,
                          countryName,
                          sub.subcategory,
                          idx,
                          expandedQueries,
                          setExpandedQueries
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderSubcategory(sub, countryName, expandedQueries, setExpandedQueries) {
  const metrics = sub.metrics || {};
  const scores = metrics.scores || {};
  const scoreKeys = Object.keys(scores);

  // ✅ CASE 1: RSF style (NO scores object)
  // ✅ CASE 1: RSF style (no country dropdown, keep Score and Rank always visible)
  if (scoreKeys.length === 0 && metrics.score) {
    const contextKey = `${countryName}_${sub.subcategory}_contexts`;
    const overallSeverity = metrics.overall_severity || "ORANGE";

    return (
      <div
        style={{
          marginTop: "10px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px 14px",
        }}
      >
        {/* Header Row */}
        <div
          style={{
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SeverityDot level={overallSeverity} />
            <span>
              {countryName} {metrics.year ? `(${metrics.year})` : ""}
            </span>
          </div> */}
        </div>

        {/* ✅ Score and Rank (always visible) */}
        <div style={{ lineHeight: "1.6rem", marginBottom: "10px" }}>
          <div>
            <SeverityDot level={metrics.score.severity} />
            <strong>Score:</strong> {metrics.score.original_value}
          </div>

          <div>
            <SeverityDot level={metrics.rank.severity} />
            <strong>Rank:</strong> {metrics.rank.original_value}
          </div>
        </div>

        {/* ✅ Previous year details (optional) */}
        {(metrics.score_previous_year || metrics.rank_previous_year) && (
          <div
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              color: "#444",
              display: "flex",
              gap: "12px",
            }}
          >
            {metrics.score_previous_year && (
              <span>
                <strong>Prev Score:</strong> {metrics.score_previous_year}
              </span>
            )}
            {metrics.rank_previous_year && (
              <span>
                <strong>Prev Rank:</strong> {metrics.rank_previous_year}
              </span>
            )}
          </div>
        )}

        {/* ✅ Context Details (collapsible) */}
        {metrics.contexts && (
          <div style={{ marginTop: "10px" }}>
            <div
              onClick={() =>
                setExpandedQueries((prev) => ({
                  ...prev,
                  [contextKey]: !prev[contextKey],
                }))
              }
              style={{
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Context Details</span>
              <span>{expandedQueries[contextKey] ? "▲" : "▼"}</span>
            </div>

            {expandedQueries[contextKey] && (
              <div
                style={{
                  marginTop: "8px",
                  marginLeft: "8px",
                  lineHeight: "1.6rem",
                }}
              >
                {Object.entries(metrics.contexts).map(([ctxKey, ctx], i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: "6px",
                      borderLeft: "3px solid #ddd",
                      paddingLeft: "8px",
                    }}
                  >
                    <SeverityDot level={ctx.severity} />{" "}
                    <strong>{capitalizeWords(ctxKey.replaceAll("_", " "))}:</strong>{" "}
                    {ctx.original_value} — {ctx.risk_level}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ✅ CASE 2: V-Dem style (no queries, but still a score)
  if (
    scoreKeys.length > 0 &&
    !Object.values(scores)[0]?.queries
  ) {
    return (
      <div style={{ padding: "10px 15px" }}>
        {scoreKeys.map((key, i) => {
          const m = scores[key];

          return (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                lineHeight: "1.4rem",
              }}
            >
              <SeverityDot level={m.severity} />
              <span>
                <strong>
                  {capitalizeWords(
                    key.replaceAll("_", " ")
                  )}
                </strong>{" "}
                {m.original_value !== undefined && (
                  <> – Value: {m.original_value}</>
                )}
                {/* {m.rescaled !== undefined && (
                  <> – Rescaled: {m.rescaled}</>
                )} */}
                {m.risk_level && <> – Risk: {m.risk_level}</>}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // ✅ CASE 3: Internet Freedom (nested Scores collapsible)
  // ✅ CASE 3: Internet Freedom (keep only Scores dropdown, remove country header + overall score)
  // ✅ CASE 3: Internet Freedom (keep only Scores dropdown, add bold overall score, no color dot)
  if (scoreKeys.length > 0 && Object.values(scores)[0]?.queries) {
    const scoresKey = `${countryName}_${sub.subcategory}_scores`;
    const overallValue = metrics.value;
    const overallMax = metrics.max_value;

    return (
      <div style={{ marginTop: "10px" }}>
        {/* Collapsible Scores section */}
        <div
          onClick={() =>
            setExpandedQueries((prev) => ({
              ...prev,
              [scoresKey]: !prev[scoresKey],
            }))
          }
          style={{
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 10px",
            borderRadius: "6px",
            background: "#f9fafb",
            border: "1px solid #ddd",
            marginBottom: "10px",
          }}
        >
          <span>Scores</span>
          <span>{expandedQueries[scoresKey] ? "▲" : "▼"}</span>
        </div>

        {/* Expanded Scores section */}
        {expandedQueries[scoresKey] && (
          <div
            style={{
              marginLeft: "10px",
              marginTop: "8px",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #eee",
              padding: "10px 14px",
            }}
          >
            {scoreKeys.map((scoreKey, i) => {
              const metric = scores[scoreKey];
              const metricKey = `${countryName}_${sub.subcategory}_${scoreKey}_${i}`;

              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "10px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "6px",
                  }}
                >
                  {/* Each score category header */}
                  <div
                    onClick={() =>
                      setExpandedQueries((prev) => ({
                        ...prev,
                        [metricKey]: !prev[metricKey],
                      }))
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "600",
                      cursor: "pointer",
                      gap: "8px",
                    }}
                  >
                    <SeverityDot level={metric.severity} />
                    <span>{metric.name || scoreKey}</span>
                    <span style={{ marginLeft: "auto" }}>
                      {expandedQueries[metricKey] ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Queries for each score */}
                  {expandedQueries[metricKey] && (
                    <div style={{ marginLeft: "20px", marginTop: "6px" }}>
                      {(metric?.queries || []).map((q, j) => (
                        <div
                          key={j}
                          style={{
                            marginBottom: "8px",
                            lineHeight: "1.4rem",
                            paddingLeft: "10px",
                            borderLeft: "3px solid #ddd",
                          }}
                        >
                          <SeverityDot level={q.severity} />{" "}
                          <strong>{q.code}</strong> — {q.query}
                          <div style={{ fontSize: "14px", marginLeft: "18px" }}>
                            <strong>Score:</strong> {q.value} / {q.max_value},{" "}
                            <strong>Risk:</strong> {q.risk_level}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ✅ Overall Score (bold, no color code) */}
            {overallValue !== undefined && overallMax !== undefined && (
              <div
                style={{
                  marginTop: "12px",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                Overall Score: {overallValue} / {overallMax}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }





}
function renderSources(sources, countryName, subcategory, idx, expandedQueries, setExpandedQueries) {
  const sourceKey = `${countryName}_${subcategory}_sources_${idx}`;
  return (


    <div style={{ marginTop: "8px" }}>
      {/* Collapsible Title */}
      <div
        onClick={() =>
          setExpandedQueries((prev) => ({
            ...prev,
            [sourceKey]: !prev[sourceKey],
          }))
        }
        style={{
          cursor: "pointer",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >

        <span>Sources</span>
        <span style={{ marginLeft: "4px" }}>
          {expandedQueries[sourceKey] ? "▲" : "▼"}
        </span>
      </div>

      {/* Collapsible List */}
      {expandedQueries[sourceKey] && (
        <div style={{ marginTop: "4px", marginLeft: "22px" }}>
          {sources.map((src, i) => (
            <div key={i} style={{ marginBottom: "4px" }}>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb", // Tailwind blue-600
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                {src}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
