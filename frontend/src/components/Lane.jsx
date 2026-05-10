import { useState } from "react";
import Gate from "./Gate";

export default function Lane({
  qubitId,
  gates,
  isFirst,
  onDropGate,
  onClickQubit,
  onRemoveGate,
}) {
  const [over, setOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setOver(true);
  };
  const handleDragLeave = () => setOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const type = e.dataTransfer.getData("text/plain");
    if (type) onDropGate(qubitId, { type });
  };

  return (
    <div className="lane">
      <div className={"lane-label" + (isFirst ? " first" : "")}>
        <button
          className="qid"
          onClick={() => !isFirst && onClickQubit(qubitId)}
          type="button"
        >
          Q[{qubitId}] <span className="x">{!isFirst ? "✕" : ""}</span>
        </button>
        <span className="stateLabel">|0⟩</span>
      </div>
      <div
        className={"lane-track" + (over ? " over" : "")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="lane-wire" />
        {gates.map((g, i) => (
          <div className="cell" key={i}>
            <Gate
              type={g.type}
              backendType={g.backendType}
              placed
              draggable={false}
              onClick={() => g.type !== "|0>" && onRemoveGate(qubitId, i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
