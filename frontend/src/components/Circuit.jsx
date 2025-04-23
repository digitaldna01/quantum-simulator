import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import Gate from "./Gate.jsx";
import QubitLine from "./QubitLine";
import "./Circuit.css";
import "../App.css";

const Circuit = ({ setSimulationResult, circuit, setCircuit, onRemoveQubit }) => {

  // const [circuit, setCircuit] = useState([
  //   { id: 0, gates: [{ type: "|0>" }] }, // q[0] id is qubit number, q[0], q[2]...
  // ]);

  const handleDropGate = (qubitId, gate) => {
    setCircuit((prev) => {
      const updated = prev.map((q) =>
        q.id === qubitId ? { ...q, gates: [...q.gates, gate] } : q
      );
      sendCircuitToBackend(updated); // ✅ 이제 정상 작동
      return updated;
    });
  };

  const addQubit = () => {
    setCircuit((prev) => {
      const updated = [...prev, { id: prev.length, gates: [{ type: "|0>" }] }];
      sendCircuitToBackend(updated); // 🔥 업데이트된 회로로 시뮬레이션 실행
      return updated;
    });
  };

  const handleRemoveGate = (qubitId, gateIndex) => {
    setCircuit(prev =>
      prev.map(q =>
        q.id === qubitId
          ? { ...q, gates: q.gates.filter((_, idx) => idx !== gateIndex) }
          : q
      )
    );
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
        body: JSON.stringify({ circuit : updatedCircuit }), // Send Circuit Status
      });
      console.log("🚀 Circuit Sent to Backend:", circuit);
      const data = await response.json();
      console.log("🧪 Backend Response:", data);
      setSimulationResult(data); // Save to show later
    } catch (error) {
      console.error("❌ Simulation Fail:", error);
    }
  };

  // const sendCircuitToBackend = async (updatedCircuit) => {
  //   const response = await fetch("http://localhost:5050/simulate", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ circuit: updatedCircuit }),
  //   });
  //   const data = await response.json();
  //   setSimulationResult(data);  // ✅ App으로 올림
  // };

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
            {/* {circuit.length > 1 && <RemoveButton />} */}
            {/* <div
              ref={dropRef}
              className={`h-[300px] border rounded p-4 transition-all ${
                isOver ? "bg-blue-100" : "bg-black"
              }`}
            > */}
            {/* 여기에 회로 렌더링 */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Circuit;