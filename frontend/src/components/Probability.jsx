export default function Probability({ amplitudes, numQubits }) {
  const dim = 1 << numQubits;
  return (
    <div className="card" id="dashboard-probability">
      <div className="card-head">
        <div className="title">Probability</div>
        <div className="meta">
          <span className="pill">{dim} states</span>
        </div>
      </div>
      <div className="chart">
        <div className="yaxis">
          <span>1.00</span>
          <span>0.75</span>
          <span>0.50</span>
          <span>0.25</span>
          <span>0.00</span>
        </div>
        <div className="plot">
          <div className="gridlines">
            <i /><i /><i /><i /><i />
          </div>
          <div
            className="bars"
            style={{ gridTemplateColumns: `repeat(${amplitudes.length}, 1fr)` }}
          >
            {amplitudes.map((a) => (
              <div className="col" key={a.state}>
                <div
                  className={"bar" + (a.prob < 0.001 ? " zero" : "")}
                  style={{ height: `${Math.max(0.6, a.prob * 100)}%` }}
                >
                  <span className="val">{(a.prob * 100).toFixed(1)}%</span>
                </div>
                <span className="tick">|{a.state}⟩</span>
              </div>
            ))}
          </div>
          <div className="xlabel">Basis States</div>
        </div>
      </div>
    </div>
  );
}
