import React, { useState, useRef } from "react";
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
    item: { type }, // drag시 전달되는 payload
    collect: (monitor) => ({
      // 드래그 상태 추적용 -> isDragging값으로 스타일 조절
      isDragging: monitor.isDragging(),
    }),
  });

  const [showInfo, setShowInfo] = useState(false);
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowInfo(true);
    }, 1500); // 3초 후 showInfo = true
  };

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
        };
      case "S":
        return {
            name : "S GATE (PHASE)",
            description: "Adds a phase of π/2 to the |1⟩ state.",
        };
      case "X":
        return {
          name: "X GATE (PAULI-X)",
          description:
            "Equivalent to a classical NOT gate. Pauli-X gate: Bit flip.",
        };
        case "Y":
        return {
          name: "Y Gate (Pauli-Y)",
          description: "A 180° rotation around the y-axis.",
        };
      case "CX":
        return { name: "", description: "Controlled-X gate (CNOT)." };
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
        <div className="multi-gate-stack border">
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
          <div className="description">
            {getGateDescription(type).description}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gate;
