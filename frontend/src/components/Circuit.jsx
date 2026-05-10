import Lane from "./Lane";

const MAX_QUBITS = 3;

export default function Circuit({
  circuit,
  gateCount,
  onAddQubit,
  onClickQubit,
  onDropGate,
  onRemoveGate,
  onClear,
}) {
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
        <div className="circuit-toolbar">
          <span className="arrow">Time →</span>
          <div className="timesteps">
            <span className="active">t₀ init</span>
            <span>t₁</span>
            <span>t₂</span>
            <span>t₃</span>
            <span>t₄</span>
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
  );
}
