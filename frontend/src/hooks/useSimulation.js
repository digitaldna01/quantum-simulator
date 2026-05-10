import { useCallback, useEffect, useState } from "react";
import { simulateCircuit } from "../api/simulate";

// Runs the simulator whenever `circuit` changes (or rerun() is called).
// Cancels any in-flight request so rapid edits don't race; the latest
// circuit always wins.
export function useSimulation(circuit) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [tick, setTick] = useState(0);

  const rerun = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!circuit?.length) return;

    const controller = new AbortController();
    setSimulating(true);
    simulateCircuit(circuit, { signal: controller.signal })
      .then((data) => {
        setResult(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSimulating(false);
      });

    return () => controller.abort();
  }, [circuit, tick]);

  return { result, error, simulating, rerun };
}
