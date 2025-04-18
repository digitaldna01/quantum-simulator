import React, { useState } from "react";
import axios from "axios";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import "./App.css";

import Circuit from "./components/Circuit";
import Components from "./components/Components";

function App() {
  const [result, setResult] = useState(null);

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="grid gap-4 w-full max-w-6xl">
          {/* TODO Get rid of height constraint */}
          {/* Circuits and Component */}
          <div className="flex w-full max-h-[400px] h-[400px] border rounded-md overflow-hidden">
            <DndProvider backend={HTML5Backend}>
              <Circuit />
              <Components/>
            </DndProvider>
          </div>
          {/* Top Circuit Area */}
          

          {/* Bottom Result Area */}
          <div className="grid grid-cols-4 gap-4 ">
            <div className="col-span-2 p-4 border rounded-lg title">STATEVECTOR</div>
            <div className="col-span-1 p-4 border rounded-lg title">OUTPUT</div>
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
