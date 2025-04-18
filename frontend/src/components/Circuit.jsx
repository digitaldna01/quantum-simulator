import React, { useState } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import Gate from "./Gate.jsx";
import QubitLine from "./QubitLine";
import "./Circuit.css";
import "../App.css";

export default function Circuit() {
  const [circuit, setCircuit] = useState([
    { id: 0, gates: [{ type: "|0>" }] }, // q[0] id is qubit number, q[0], q[2]...
  ]);

  const handleDropGate = (qubitId, gate) => {
    setCircuit((prev) =>
      prev.map((q) =>
        q.id === qubitId ? { ...q, gates: [...q.gates, gate] } : q
      )
    );
  };

  const addQubit = () => {
    setCircuit((prev) => [
      ...prev,
      { id: prev.length, gates: [{ type: "|0>" }] },
    ]);
  };

  // =====================

  const [gates, setGates] = useState([]); // 👈 This state saves the putted Gates ex:  [ { type: 'H' }, { type: 'X' } ]

  const [{ isOver }, dropRef] = useDrop({
    accept: "GATE",
    drop: (item) => {
      // 👈 This function is called when a gate is dropped
      setGates((prev) => [...prev, item]); // 👈 드롭된 게이트 추가
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [qubitCount, setQubitCount] = useState(1);

  const handleAddQubit = async () => {
    const newCount = qubitCount + 1;
    setQubitCount(newCount);

    // Update the qubits state to reflect the new count
    await axios.post("/api/init-circuit", { qubits: newCount });
  };

  const handleRemoveQubit = () => {
    if (qubits.length > 1) {
      setQubits(qubits.slice(0, -1)); // Remove last qubit
    }
  };

  const handleSimulate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/simulate", {
        qubits,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error during simulation:", error);
    }
  };

  const handleReset = () => {
    setQubits([0]); // Reset to initial state
  };

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
}
