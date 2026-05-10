import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const GATE_INFO = {
  H: { name: "H · Hadamard", desc: "Creates equal superposition. |0⟩ → (|0⟩ + |1⟩)/√2." },
  S: { name: "S · Phase", desc: "Adds a phase of π/2 to the |1⟩ component." },
  T: { name: "T · π/8", desc: "Adds a phase of π/4 to the |1⟩ component." },
  X: { name: "X · Pauli-X", desc: "Bit-flip. |0⟩ ↔ |1⟩." },
  Y: { name: "Y · Pauli-Y", desc: "180° rotation around the y-axis." },
  Z: { name: "Z · Pauli-Z", desc: "Phase-flip on |1⟩, leaves |0⟩ unchanged." },
  CX: { name: "CX · CNOT", desc: "X on target only when control = |1⟩." },
  CZ: { name: "CZ · Controlled-Z", desc: "Z on target only when control = |1⟩." },
  CCX: { name: "CCX · Toffoli", desc: "X on target when both controls = |1⟩." },
  CCZ: { name: "CCZ", desc: "Z on target when both controls = |1⟩." },
  MCX: { name: "MCX", desc: "X on target when all controls = |1⟩." },
  MCZ: { name: "MCZ", desc: "Z on target when all controls = |1⟩." },
  "|0>": { name: "|0⟩ · Initial state", desc: "The qubit's initial state." },
};

const MULTI_LAYOUT = {
  CX: ["C", "X"],
  CZ: ["C", "Z"],
  CCX: ["C", "C", "X"],
  CCZ: ["C", "C", "Z"],
  MCX: ["M", "C", "X"],
  MCZ: ["M", "C", "Z"],
};

const PAULI = new Set(["X", "Y", "Z", "S", "T"]);

// Renders the tooltip into document.body so .card's overflow:hidden can't
// clip it. Position is computed in viewport coordinates from the anchor's
// bounding rect; the arrow stays centered horizontally on the anchor.
function TipPortal({ info, anchorRect }) {
  if (!info || !anchorRect) return null;
  const top = anchorRect.bottom + 12;
  const left = anchorRect.left + anchorRect.width / 2;
  return createPortal(
    <div className="tip show" style={{ position: "fixed", top, left, transform: "translateX(-50%)" }}>
      <div className="name">{info.name}</div>
      <div className="desc">{info.desc}</div>
    </div>,
    document.body
  );
}

function GateGlyph({ type }) {
  if (MULTI_LAYOUT[type]) {
    const labels = MULTI_LAYOUT[type];
    return (
      <div className="gate-stack">
        {labels.map((label, i) => (
          <span key={i} style={{ display: "contents" }}>
            <div className="gate ctrl">{label}</div>
            {i < labels.length - 1 && <div className="gate-wire" />}
          </span>
        ))}
      </div>
    );
  }
  if (type === "|0>") return <div className="gate state">|0⟩</div>;
  if (type === "H") return <div className="gate h">H</div>;
  if (PAULI.has(type)) return <div className="gate pauli">{type}</div>;
  if (type === "Control_C") return <div className="gate ctrl">C</div>;
  if (type === "Control_M") return <div className="gate ctrl">M</div>;
  if (type === "Target_X") return <div className="gate ctrl">X</div>;
  if (type === "Target_Z") return <div className="gate ctrl">Z</div>;
  if (type === "None") return <div className="gate" style={{ visibility: "hidden" }} />;
  return <div className="gate ctrl">{type}</div>;
}

export default function Gate({
  type,
  backendType,
  placed = false,
  draggable = true,
  onClick,
}) {
  const [showTip, setShowTip] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef(null);
  const timer = useRef(null);

  const onEnter = () => {
    timer.current = setTimeout(() => {
      if (wrapRef.current) {
        setAnchorRect(wrapRef.current.getBoundingClientRect());
        setShowTip(true);
      }
    }, 600);
  };
  const onLeave = () => {
    clearTimeout(timer.current);
    setShowTip(false);
  };

  // Hide on scroll/resize so a stale fixed position never lingers on screen.
  useEffect(() => {
    if (!showTip) return;
    const hide = () => setShowTip(false);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [showTip]);

  const isInit = type === "|0>";
  const canDrag = draggable && !isInit && !placed;

  const handleDragStart = (e) => {
    if (!canDrag) return;
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "move";
    setDragging(true);
    setShowTip(false);
  };
  const handleDragEnd = () => setDragging(false);

  const tipInfo = GATE_INFO[backendType || type];

  return (
    <>
      <div
        ref={wrapRef}
        className={
          "gate-wrap" +
          (placed ? " placed" : "") +
          (dragging ? " dragging" : "")
        }
        draggable={canDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        <GateGlyph type={type} />
      </div>
      {showTip && <TipPortal info={tipInfo} anchorRect={anchorRect} />}
    </>
  );
}
