import { useEffect, useMemo, useState } from "react";

import "./styles/dashboard.css";

import TopBar from "./components/TopBar";
import Banner from "./components/Banner";
import Circuit from "./components/Circuit";
import OperationGates from "./components/OperationGates";
import Probability from "./components/Probability";
import Output from "./components/Output";
import Sphere from "./components/Sphere";
import ConfirmModal from "./components/ConfirmModal";

import { useCircuit } from "./hooks/useCircuit";
import { useSimulation } from "./hooks/useSimulation";
import { useTour } from "./hooks/useTour";
import { parseStatevector } from "./lib/parseStatevector";

const REPO_URL = "https://github.com/digitaldna01/quantum-simulator";

const BANNER_MESSAGES = {
  empty: "Drop a gate from the right onto a qubit lane to begin.",
  default: (
    <>
      <strong>Circuit ready.</strong> Drag a gate from the right onto a qubit, or load a preset to explore.
    </>
  ),
};

function countGates(circuit) {
  return circuit.reduce(
    (sum, q) =>
      sum +
      q.gates.filter((g) => g.type !== "|0>" && g.type !== "None").length,
    0
  );
}

export default function App() {
  const {
    circuit,
    addQubit,
    removeQubit,
    dropGate,
    removeGate,
    clear,
    loadPreset,
  } = useCircuit();
  const { result, error, simulating, rerun } = useSimulation(circuit);
  const { restart: restartTour } = useTour();

  const [confirmId, setConfirmId] = useState(null);

  const numQubits = circuit.length;
  const gateCount = countGates(circuit);
  const basisDim = 1 << numQubits;

  const amplitudes = useMemo(
    () => parseStatevector(result?.statevector, numQubits),
    [result, numQubits]
  );

  const activeStates = useMemo(
    () => amplitudes.filter((a) => a.prob >= 0.001).length,
    [amplitudes]
  );

  const bannerMessage = gateCount === 0 ? BANNER_MESSAGES.empty : BANNER_MESSAGES.default;
  const [lastRunTime, setLastRunTime] = useState("");
  useEffect(() => {
    if (result) {
      setLastRunTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  }, [result]);

  const handleConfirmDelete = () => {
    if (confirmId !== null) removeQubit(confirmId);
    setConfirmId(null);
  };

  return (
    <div className={"app" + (simulating ? " simulating" : "")}>
      <TopBar
        numQubits={numQubits}
        gateCount={gateCount}
        basisDim={basisDim}
        activeStates={activeStates}
        onReset={clear}
        onRun={rerun}
        onTour={restartTour}
      />

      <Banner message={bannerMessage} onLoadPreset={loadPreset} />

      <div className="top-grid">
        <Circuit
          circuit={circuit}
          gateCount={gateCount}
          onAddQubit={addQubit}
          onClickQubit={(id) => setConfirmId(id)}
          onDropGate={dropGate}
          onRemoveGate={removeGate}
          onClear={clear}
        />
        <OperationGates />
      </div>

      <div className="bottom-grid">
        <Probability amplitudes={amplitudes} numQubits={numQubits} />
        <Output amplitudes={amplitudes} />
        <Sphere amplitudes={amplitudes} numQubits={numQubits} />
      </div>

      <div className="foot">
        <div>
          {error
            ? `ERROR · ${error.message}`
            : `READY · backend: tensornetwork · last run ${lastRunTime}`}
        </div>
        <div className="links">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">docs</a>
        </div>
      </div>

      {confirmId !== null && (
        <ConfirmModal
          qubitId={confirmId}
          onCancel={() => setConfirmId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
