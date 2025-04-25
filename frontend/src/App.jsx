import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import introJs from "intro.js";
import "intro.js/introjs.css";

import "./App.css";

import Circuit from "./components/Circuit";
import Components from "./components/Components";
import Probability from "./components/Probability";
import Output from "./components/Output";
import Sphere from "./components/Sphere";

function App() {
  const [hasShownTour, setHasShownTour] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenTour");

    // 처음 방문 시에만 자동 실행
    if (!seen) {
      startIntroTour();
      localStorage.setItem("seenTour", "true");
      setHasShownTour(true); // 이미 실행했음을 기록
    }
  }, []);

  const handleRestartTour = () => {
    startIntroTour();
  };

  const [simulationResult, setSimulationResult] = useState(null);
  const [circuit, setCircuit] = useState([{ id: 0, gates: [{ type: "|0>" }] }]);

  const handleRemoveQubit = (id) => {
    if (id === 0) return; // 첫 번째 큐비트는 삭제 못함
    setCircuit((prev) => prev.filter((q) => q.id !== id));
  };

  const startIntroTour = () => {
    introJs()
      .setOptions({
        steps: [
          {
            intro:
              "⚛️ Welcome to your Quantum Playground. Let's take a quick tour!",
          },
          {
            element: "#dashboard-circuit",
            intro:
              "This is your circuit panel. Simply drag and drop gates to design quantum circuits.",
          },
          {
            element: "#dashboard-components",
            intro:
              "Here are your available quantum gates. Click or drag them into your circuit above.",
          },
          {
            element: "#dashboard-probability",
            intro:
              "This section shows the most probable quantum states after simulation.",
          },
          {
            element: "#dashboard-output",
            intro:
              "Here's the complete statevector — a full description of your quantum system.",
          },
          {
            element: "#dashboard-sphere",
            intro:
              "Visualize your quantum states on the Q-sphere for better geometric intuition.",
          },
        ],
        nextLabel: "Continue →",
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: true,
        doneLabel: "Let's Start!",
      })
      .start();
  };

  useEffect(() => {
    const seen = localStorage.getItem("seenTour");
    if (!seen) {
      startIntroTour();
      localStorage.setItem("seenTour", "true");
    }
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="grid gap-4 w-full max-w-6xl">
          {/* TODO Get rid of height constraint */}
          {/* Circuits and Component */}
          <div
            className="flex w-full max-h-[400px] border rounded-md "
            id="dashboard-circuit"
          >
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
          <button
            onClick={() => {
              localStorage.removeItem("seenTour");
              setTimeout(() => {
                startIntroTour();
              }, 100); // 살짝 delay로 localStorage 반영
            }}
            className="mt-4 px-4 py-2 rounded text-white"
          >
            Show Walkthrough Again
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
