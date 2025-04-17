import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import Circuit from "./components/Circuit";

function App() {
  const [result, setResult] = useState(null);

  return (
    <>
      <div className="w-screen h-screen  flex justify-center items-center">
        <div className="grid gap-4 w-full max-w-6xl">
          {/* Top Circuit Area */}
          <Circuit />

          {/* Bottom Result Area */}
          <div className="grid grid-cols-4 gap-4 ">
            <div className="col-span-2 p-4 border rounded-lg">statevector</div>
            <div className="col-span-1 p-4 border rounded-lg">output</div>
            <div className="col-span-1 p-4 border rounded-lg">sphere</div>
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
