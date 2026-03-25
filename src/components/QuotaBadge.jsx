export default function QuotaBadge({ remaining, plan }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
      <p className="font-medium">{plan ? plan.toUpperCase() : "FREE"}</p>
      <p className="text-emerald-200">
        {remaining !== null && remaining !== undefined
          ? `${remaining} runs left`
          : "Loading quota..."}
      </p>
    </div>
  );
}
