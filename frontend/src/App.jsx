import React, { useState } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

import Circuit from "./components/Circuit";
import Components from "./components/Components";
import Probability from "./components/Probability";
import Output from "./components/Output";
import Sphere from "./components/Sphere";

function App() {
  const [simulationResult, setSimulationResult] = useState(null);
  const [circuit, setCircuit] = useState([{ id: 0, gates: [{ type: "|0>" }] }]);

  const handleRemoveQubit = (id) => {
    if (id === 0) return; // 첫 번째 큐비트는 삭제 못함
    setCircuit((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="grid gap-4 w-full max-w-6xl">
          {/* TODO Get rid of height constraint */}
          {/* Circuits and Component */}
          <div className="flex w-full max-h-[400px] border rounded-md ">
            <DndProvider backend={HTML5Backend}>
              <Circuit
                setCircuit={setCircuit}
                circuit={circuit}
                setSimulationResult={setSimulationResult}
                onRemoveQubit={handleRemoveQubit}
              />
              <Components />
            </DndProvider>
          </div>
          {/* Top Circuit Area */}

          {/* Bottom Result Area */}
          <div className="grid grid-cols-4 gap-4 ">
            <Probability
              top_states={simulationResult?.top_states}
              numQubits={circuit.length}
            />
            <Output statevector={simulationResult?.statevector} />
            <Sphere
              statevector={simulationResult?.statevector}
              numQubits={circuit.length}
            />
          </div>
        </div>
      </div>
      {/* <button onClick={handleSimulate}>Run Simulation</button>
        {result && (
          <pre style={{ marginTop: "1rem" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )} */}
    </>
  );
}

export default App;
