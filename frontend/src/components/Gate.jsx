import React, { useState, useRef, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useDrag } from "react-dnd"; //react-dnd의 훅, 이 요소를 드래그 가능한 컴포넌트로 등록
import "./Gate.css";
import "../App.css";

const Gate = ({ type, label }) => {
  const multiGates = {
    CZ: ["C", "Z"],
    MX: ["M", "X"],
    CCZ: ["C", "C", "Z"],
    MCX: ["M", "C", "X"],
  };

  const isMultiGates = Object.keys(multiGates).includes(type);

  const [{ isDragging }, dragRef] = useDrag({
    type: "GATE", // 나증에 drag영역에서 이 타입을 받아들이게 함
    item: { type }, // Payload when dragging  
    collect: (monitor) => ({
      // 드래그 상태 추적용 -> isDragging값으로 스타일 조절
      isDragging: monitor.isDragging(),
    }),
  });

  const [showInfo, setShowInfo] = useState(false);
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    if (!isDragging) {
      hoverTimer.current = setTimeout(() => {
        setShowInfo(true);
      }, 1500); // Set showInfo = True after 1.500 sec
    }
  };

  // Reset Timer when start Dragging 
  useEffect(() => { 
    if (isDragging) {
      clearTimeout(hoverTimer.current); // Clear the timer when dragging starts
      setShowInfo(false);
    }
  }, [isDragging]);

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setShowInfo(false);
  };

  const getGateDescription = (type) => {
    switch (type) {
      case "H":
        return {
          name: "H GATE (Hadamard)",
          description: "Hadamard gate: Creates superposition.",
          formula: "\\begin{bmatrix} 1 & 0 \\\\ 0 & i \\end{bmatrix}",
        };
      case "S":
        return {
          name: "S Gate (Phase Gate)",
          description: "Adds a phase of π/2 to the |1⟩ state.",
          formula: "\\begin{bmatrix} 1 & 0 \\\\ 0 & i \\end{bmatrix}",
        };
      case "T":
        return {
          name: "T Gate (π/8 Gate)",
          description: "Adds a phase of π/4 to the |1⟩ state.",
          formula: "\\begin{bmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{bmatrix}",
        };
      case "X":
        return {
          name: "X GATE (PAULI-X)",
          description: "Equivalent to a classical NOT gate.",
          formula: "\\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}",
        };
      case "Y":
        return {
          name: "Y Gate (Pauli-Y)",
          description: "A 180° rotation around the y-axis.",
          formula: "\\begin{bmatrix} 0 & -i \\\\ i & 0 \\end{bmatrix}",
        };
      case "Z":
        return {
          name: "Z GATE (PAULI-Z)",
          description: " Applies a phase flip to |1⟩ but leaves |0⟩ unchanged.",
          formula: "\\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}",
        };
      case "CZ":
        return {
          name: "CZ Gate (Controlled-Z)",
          description:
            "Applies Z to the target qubit only if the control qubit is in state |1⟩.",
          formula:
            "\\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & -1 \\end{bmatrix}",
        };
      case "MX":
        return {
          name: "MX Gate (Measurement-X)",
          description: "Measures in the X basis.",
          formula: "\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}",
        };
      case "CCZ":
        return {
          name: "CCZ Gate (Double Controlled-Z)",
          description:
            "Applies Z to the target qubit only if both control qubits are in state |1⟩.",
          formula:
            "\\begin{bmatrix} 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & -1 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 & -1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 & -1 \\end{bmatrix}",
        };
      case "MCX":
        return {
          name: "MCX Gate (Multi-Controlled-X)",
          description:
            "Applies X to the target qubit only if all control qubits are in state |1⟩.",
          formula:
            "\\begin{bmatrix} 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & -1 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & -1 \\end{bmatrix}",
        };
      case "|0>":
        return {
          name: "Initial State |0⟩",
          description:
            "The initial state of a qubit, representing the classical bit 0.",
          formula: "\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}",
        };
      default:
        return { name: "", description: "No description available." };
    }
  };

  return (
    <div
      ref={dragRef} // setting the ref to the dragRef
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`all-gate  text-black text-center cursor-pointer  ${
        isDragging ? "opacity-30" : "hover:brightness-110"
      }`} // Change opacity when dragging
    >
      {isMultiGates ? (
        <div className="multi-gate-stack">
          {multiGates[type].map((label, idx) => (
            <React.Fragment key={idx}>
              <div className="circle rounded-full">{label}</div>
              {idx < multiGates[type].length - 1 && (
                <div className="connector" />
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div
          className={`${
            type === "H"
              ? "hadamard"
              : type === "|0>"
              ? "initial-state"
              : "single-gate rounded-full"
          } flex items-center justify-center`}
        >
          {label}
        </div>
      )}
      {/* ✅ Gate Description */}
      {showInfo && (
        <div className="absolute top-full mt-2 background-color-black4 text-black p-2 rounded shadow z-[9999] whitespace-normal w-max max-w-[220px]">
          <div className="name">{getGateDescription(type).name}</div>
          {getGateDescription(type).formula && (
            <BlockMath math={getGateDescription(type).formula} />
          )}
          <div className="description">
            {getGateDescription(type).description}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gate;
