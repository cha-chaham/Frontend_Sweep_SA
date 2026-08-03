// src/components/MetricCard.jsx
export default function MetricCard({ title, value, unit, subtitle, statusColor = "text-indigo-600" }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <div className="flex items-baseline mt-2">
          <span className={`text-3xl font-bold tracking-tight ${statusColor}`}>{value}</span>
          {unit && <span className="ml-1.5 text-sm font-medium text-slate-500">{unit}</span>}
        </div>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-50">{subtitle}</p>}
    </div>
  );
}