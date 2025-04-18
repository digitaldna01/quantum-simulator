import React, { useState } from "react";
import axios from "axios";
import { useDrop } from "react-dnd";
import "./Circuit.css";
import "../App.css";

export default function Circuit() {
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

  const [{ isOver }, dropRef] = useDrop({
    accept: "GATE",
    drop: (item) => {
      console.log("Dropped gate:", item.type); // 여기에 회로 추가 로직 연결 예정
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <>
      {/* The Width of the circuit is 2/3 initially  */}
      {/* Circuit Area - 2/3 width */}
      <div className="w-2/3 h-full border-r overflow-y-auto">
        <div className="title p-4">CIRCUIT</div>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* your circuit drawing here */}
            <div
              ref={dropRef}
              className={`h-[300px] border rounded p-4 transition-all ${
                isOver ? "bg-blue-100" : "bg-black"
              }`}
            >
              {/* 여기에 회로 렌더링 */}
              Drop gate here!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
