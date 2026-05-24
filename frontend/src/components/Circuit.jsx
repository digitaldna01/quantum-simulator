import Lane from "./Lane";

const MAX_QUBITS = 3;

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";
const toSubscript = (n) =>
  String(n)
    .split("")
    .map((d) => SUBSCRIPTS[+d])
    .join("");

export default function Circuit({
  circuit,
  gateCount,
  onAddQubit,
  onClickQubit,
  onDropGate,
  onRemoveGate,
  onClear,
}) {
  // Timeline grows with the deepest lane (index 0 is the |0> init column).
  const depth = Math.max(...circuit.map((q) => q.gates.length));

  return (
    <div className="card" id="dashboard-circuit">
      <div className="card-head">
        <div className="title">Circuit</div>
        <div className="meta">
          <span>
            {circuit.length} qubit{circuit.length !== 1 ? "s" : ""} ·{" "}
            {gateCount} gate{gateCount !== 1 ? "s" : ""}
          </span>
          <button className="pill clickable" onClick={onClear} type="button">
            Clear
          </button>
        </div>
      </div>
      <div className="circuit-body">
        <div className="circuit-scroll">
          <div className="circuit-toolbar">
            <span className="arrow">Time →</span>
            <div className="timesteps">
              {Array.from({ length: depth }, (_, i) => (
                <span key={i} className={i === 0 ? "active" : ""}>
                  {i === 0 ? "t₀ init" : `t${toSubscript(i)}`}
                </span>
              ))}
              <span className="ghost">＋</span>
            </div>
          </div>
          <div className="lanes">
            {circuit.map((q, idx) => (
              <Lane
                key={q.id}
                qubitId={q.id}
                gates={q.gates}
                isFirst={idx === 0}
                onDropGate={onDropGate}
                onClickQubit={onClickQubit}
                onRemoveGate={onRemoveGate}
              />
            ))}
            {circuit.length < MAX_QUBITS && (
              <div className="add-lane">
                <button onClick={onAddQubit} title="Add qubit" type="button">
                  ＋
                </button>
                <div className="ghostwire">
                  <span className="hint">+ Add qubit</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
