import Gate from "./Gate";

const SINGLE = ["H", "S", "T", "X", "Y", "Z"];
const MULTI = ["CX", "CZ", "CCX", "CCZ", "MCX", "MCZ"];

export default function OperationGates() {
  return (
    <div className="card" id="dashboard-components">
      <div className="card-head">
        <div className="title">Operation Gates</div>
        <div className="meta">
          <span className="pill accent">drag</span>
        </div>
      </div>
      <div className="ops-body">
        <div className="ops-section">
          <div className="ops-label">Single qubit</div>
          <div className="ops-grid">
            {SINGLE.map((t) => (
              <div className="gate-tile" key={t}>
                <Gate type={t} />
                <span className="lbl">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ops-section">
          <div className="ops-label">Controlled · multi-qubit</div>
          <div className="ops-grid multi">
            {MULTI.map((t) => (
              <div className="gate-tile" key={t}>
                <Gate type={t} />
                <span className="lbl">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
