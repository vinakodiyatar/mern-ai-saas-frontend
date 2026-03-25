export default function OutputPanel({ result }) {
  if (!result) {
    return <p className="text-sm text-slate-300">Run a generation to see results.</p>;
  }

  if (result.raw) {
    return (
      <pre className="whitespace-pre-wrap text-sm text-emerald-100 bg-black/30 rounded-lg p-3 border border-white/10 overflow-auto max-h-96">
        {result.raw}
      </pre>
    );
  }

  return (
    <div className="space-y-4">
      {result.metaTitle && (
        <p className="text-xl font-semibold text-white">{result.metaTitle}</p>
      )}
      {result.metaDescription && (
        <p className="text-sm text-slate-200">{result.metaDescription}</p>
      )}
      {result.outline && result.outline.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-emerald-200 mb-1">Outline</p>
          <ul className="list-disc pl-5 text-sm text-slate-200 space-y-1">
            {result.outline.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {result.faqs && result.faqs.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-emerald-200 mb-1">FAQs</p>
          <div className="space-y-2">
            {result.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg bg-white/5 p-3 border border-white/10">
                <p className="text-sm font-medium text-white">{faq.q}</p>
                <p className="text-xs text-slate-300 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {result.internalLinks && result.internalLinks.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-emerald-200 mb-1">Internal Links</p>
          <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
            {result.internalLinks.map((link, idx) => (
              <li key={idx}>{link}</li>
            ))}
          </ul>
        </div>
      )}
      {result.ads && result.ads.length > 0 && (
        <div className="space-y-3">
          {result.ads.map((ad, idx) => (
            <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="font-semibold text-emerald-100 text-sm mb-1">Variant {idx + 1}</p>
              <p className="text-sm text-white">
                {ad.headline1} · {ad.headline2}
                {ad.headline3 ? ` · ${ad.headline3}` : ""}
              </p>
              <p className="text-xs text-slate-200 mt-1">{ad.description1}</p>
              {ad.description2 && (
                <p className="text-xs text-slate-300">{ad.description2}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {result.notes && (
        <p className="text-xs text-slate-400 italic">{result.notes}</p>
      )}
    </div>
  );
}
