export default function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-white/50 text-xs uppercase tracking-wide mb-2">{label}</div>
      <div className="font-display text-2xl sm:text-3xl" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
