import { useMemo, useState } from "react";

const fmt = (n) => n.toFixed(3);

export default function Output({ amplitudes }) {
  const [copied, setCopied] = useState(false);

  const text = useMemo(
    () =>
      amplitudes
        .filter((a) => a.prob >= 0.001)
        .map((a) => `${fmt(a.re)}${a.im >= 0 ? "+" : ""}${fmt(a.im)}j * |${a.state}>`)
        .join(" + "),
    [amplitudes]
  );

  const onCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="card" id="dashboard-output">
      <div className="card-head">
        <div className="title">Output</div>
        <div className="meta">
          <span className="pill">|ψ⟩</span>
        </div>
      </div>
      <div className="console">
        {copied && <span className="copied">Copied</span>}
        <button className="copy" title="Copy statevector" onClick={onCopy} type="button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        {amplitudes.map((a) => (
          <div className={"amp" + (a.prob < 0.001 ? " zero" : "")} key={a.state}>
            <span className="real">{fmt(a.re)}</span>
            <span className="op">{a.im >= 0 ? "+" : ""}</span>
            {fmt(a.im)}
            <span className="op">j</span>
            <span className="op"> · </span>
            <span className="ket">|{a.state}⟩</span>
          </div>
        ))}
      </div>
    </div>
  );
}
