import React, { useState } from "react";
import axios from "axios";
import "./Circuit.css";
import "../App.css";

export default function Circuit() {
    const [qubitCount, setQubitCount] = useState(1);

  const handleAddQubit = async () => {
    const newCount = qubitCount + 1;
    setQubitCount(newCount);

    // Update the qubits state to reflect the new count
    await axios.post('/api/init-circuit', { qubits: newCount });
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
      <div className="grid row-span-1 circuit  border rounded max-h-[400px] overflow-y-auto">
        <div className="title p-4">CIRCUIT</div>
        <div className="overflow-x-auto h-[300px]">
            <div className="min-w-[400px] border"></div>
        </div>
        {/* <div className="col-span-1 flex flex-col border rounded p-4">
          operators
        </div> */}
      </div>
    </>
  );
}
