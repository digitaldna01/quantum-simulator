import React, { useState } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

import Circuit from "./components/Circuit";
import Components from "./components/Components";
import Probability from "./components/Probability";
import Output from "./components/Output";

function App() {
  const [simulationResult, setSimulationResult] = useState(null);
  const [circuit, setCircuit] = useState([{ id: 0, gates: [{ type: "|0>" }] }]);

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
              />
              <Components />
            </DndProvider>
          </div>
          {/* Top Circuit Area */}

          {/* Bottom Result Area */}
          <div className="grid grid-cols-4 gap-4 ">
            <Probability 
            top_states={simulationResult?.top_states}
            numQubits={circuit.length}/>
            <Output
            statevector={simulationResult?.statevector} />
            <div className="col-span-1 p-4 border rounded-lg title">SPHERE</div>
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
