export default function TopBar({
  numQubits,
  gateCount,
  basisDim,
  activeStates,
  onReset,
  onRun,
  onTour,
}) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-text">
          <span className="name">Quantum Simulator</span>
          <span className="sub">Circuit Playground · v0.4</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="v">{numQubits}</span>
          <span className="l">Qubits</span>
        </div>
        <div className="stat">
          <span className="v accent">{gateCount}</span>
          <span className="l">Gates</span>
        </div>
        <div className="stat">
          <span className="v">{basisDim}</span>
          <span className="l">Basis dim</span>
        </div>
        <div className="stat">
          <span className="v">{activeStates}</span>
          <span className="l">Active</span>
        </div>
      </div>
      <div className="controls">
        <button className="btn btn-ghost" onClick={onTour} type="button">
          Tour <span className="kbd">?</span>
        </button>
        <button className="btn btn-ghost" onClick={onReset} type="button">
          Reset
        </button>
        <button className="btn btn-primary" onClick={onRun} type="button">
          ▶ Run <span className="kbd">⏎</span>
        </button>
      </div>
    </div>
  );
}
