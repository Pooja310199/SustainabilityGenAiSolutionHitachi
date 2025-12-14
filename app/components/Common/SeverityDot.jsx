export default function SeverityDot({ level }) {
  const colors = { RED: "🔴", ORANGE: "🟠", GREEN: "🟢" };
  return <span>{colors[level] || "⚪"}</span>;
}
