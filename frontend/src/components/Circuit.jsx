import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import Gate from "./Gate.jsx";
import QubitLine from "./QubitLine";
import "./Circuit.css";
import "../App.css";
import { v4 as uuidv4 } from "uuid";

const Circuit = ({
  setSimulationResult,
  circuit,
  setCircuit,
  onRemoveQubit,
}) => {
  const handleDropGate = (qubitId, gate) => {
    // gate type for
    const isMultiGate = ["CZ", "CX", "CCX", "CCZ", "MCX", "MCZ"].includes(
      gate.type
    );

    if (!isMultiGate) {
      setCircuit((prev) => {
        const updated = prev.map((q) =>
          q.id === qubitId ? { ...q, gates: [...q.gates, gate] } : q
        );
        sendCircuitToBackend(updated); // ✅ 이제 정상 작동
        return updated;
      });
    } else {
      // 2️⃣ 멀티게이트 처리
      const requiredQubits =
        gate.type === "CCZ" ||
        gate.type === "MCX" ||
        gate.type === "CCX" ||
        gate.type === "MCZ"
          ? 3
          : 2;
      if (circuit.length < requiredQubits) {
        alert(`⚠️ ${gate.type} requires at least ${requiredQubits} qubits.`);
        return;
      }

      // Create id number first
      const gateId = uuidv4();

      // 컨트롤과 타겟 결정
      const controlCount =
        gate.type === "CCZ" ||
        gate.type === "MCX" ||
        gate.type === "CCX" ||
        gate.type === "MCZ"
          ? 2
          : 1;
      const controlIds = [...Array(controlCount)].map((_, i) => qubitId + i);
      const targetId = qubitId + controlCount;

      if (targetId >= circuit.length) {
        alert("⚠️ Not enough qubits for multigate placement.");
        return;
      }

      setCircuit((prev) => {
        const allQubits = [...controlIds, targetId];

        // 현재 각 큐비트에 있는 게이트 수
        const maxLength = Math.max(
          ...allQubits.map((i) => prev[i].gates.length)
        );

        // 업데이트된 회로
        const updated = prev.map((q, i) => {
          let padded = [...q.gates];
          while (padded.length < maxLength) {
            padded.push({ type: "None", linkedGateId: gateId });
          }

          if (controlIds.includes(i)) {
            let controlType = "C";
            if (gate.type === "MCX" || gate.type === "MCZ") {
              const controlIndex = controlIds.indexOf(i);
              controlType = controlIndex === 0 ? "M" : "C";
            }
            // const controlType = gate.type.startsWith("M") ? "M" : "C";
            padded.push({
              type: `Control_${controlType}`,
              linkedGateId: gateId,
            });
          } else if (i === targetId) {
            const targetType = gate.type.slice(-1); // 'Z' or 'X'
            padded.push({
              type: `Target_${targetType}`,
              linkedGateId: gateId,
              backendType: gate.type,
              controls: controlIds,
              target: targetId,
            });
          }

          return { ...q, gates: padded };
        });

        sendCircuitToBackend(updated);
        return updated;
      });
    }
  };

  const addQubit = () => {
    setCircuit((prev) => {
      const updated = [...prev, { id: prev.length, gates: [{ type: "|0>" }] }];
      sendCircuitToBackend(updated); // 🔥 업데이트된 회로로 시뮬레이션 실행
      return updated;
    });
  };

  const handleRemoveGate = (qubitId, gateIndex) => {
    setCircuit((prev) => {
      const gate = prev[qubitId].gates[gateIndex];

      if (gate.linkedGateId) {
        // ❌ 멀티게이트 삭제 시 연결된 부분 모두 제거
        return prev.map((q) => ({
          ...q,
          gates: q.gates.filter((g) => g.linkedGateId !== gate.linkedGateId),
        }));
      }

      return prev.map((q) =>
        q.id === qubitId
          ? { ...q, gates: q.gates.filter((_, idx) => idx !== gateIndex) }
          : q
      );
    });
  };

  useEffect(() => {
    if (circuit.length > 0) {
      sendCircuitToBackend(circuit);
    }
  }, [circuit]);

  // =====================

  // const [simulationResult, setSimulationResult] = useState(null); // Initiate simulationResult as Null

  const sendCircuitToBackend = async (updatedCircuit) => {
    // backend로 보내서 결과 가지고 오는 함수
    try {
      const response = await fetch("http://localhost:5050/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circuit: updatedCircuit }), // Send Circuit Status
      });
      console.log("🚀 Circuit Sent to Backend:", circuit);
      const data = await response.json();
      console.log("🧪 Backend Response:", data);
      setSimulationResult(data); // Save to show later
    } catch (error) {
      console.error("❌ Simulation Fail:", error);
    }
  };

  // =====================

  return (
    <>
      {/* The Width of the circuit is 2/3 initially  */}
      {/* Circuit Area - 2/3 width */}
      <div className="w-2/3 min-h-[150px] border-r overflow-y-auto">
        {" "}
        {/* h-full*/}
        <div className="title p-4">CIRCUIT</div>
        {/* Circuit Drop Bar */}
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* TODO Need to Fix this Set a minimum width for the circuit area */}
            {/* your circuit drawing here */}
            {circuit.map((q) => {
              console.log(`q.id: ${q.id}, gates:`, q.gates);
              return (
                <QubitLine
                  key={q.id}
                  qubitId={q.id}
                  gates={q.gates}
                  onDropGate={handleDropGate}
                  onRemoveQubit={onRemoveQubit}
                  onRemoveGate={handleRemoveGate}
                />
              );
            })}
            {circuit.length < 3 && (
              <div className="flex flex-row p-4 gap-4">
                <button
                  onClick={addQubit}
                  className=" text-white w-[60px] hover:text-blue-400 button"
                >
                  ＋
                </button>
                <div className="relative flex flex-row grow min-h-[48px] py-4 transition-all">
                  <div className="absolute top-1/3 left-0 w-full border-t border-color-black4 z-0"></div>
                  <div className="absolute top-1/2 left-0 w-full border-t border-color-black4 z-0"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Circuit;
