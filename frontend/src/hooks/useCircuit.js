import { useCallback, useState } from "react";
import {
  addMultiGate,
  addQubit as addQubitToCircuit,
  addSingleGate,
  initialQubit,
  isMultiGate,
  removeGate as removeGateFromCircuit,
  removeQubit as removeQubitFromCircuit,
} from "../lib/gateLogic";
import { PRESETS } from "../lib/presets";

const initialCircuit = () => PRESETS.bell.build();

export function useCircuit() {
  const [circuit, setCircuit] = useState(initialCircuit);

  const addQubit = useCallback(() => {
    setCircuit((prev) => addQubitToCircuit(prev));
  }, []);

  const removeQubit = useCallback((qubitId) => {
    setCircuit((prev) => {
      const trimmed = removeQubitFromCircuit(prev, qubitId);
      // Re-index ids so they're contiguous starting at 0.
      return trimmed.map((q, i) => ({ ...q, id: i }));
    });
  }, []);

  const dropGate = useCallback((qubitId, gate) => {
    if (!isMultiGate(gate.type)) {
      setCircuit((prev) => addSingleGate(prev, qubitId, gate));
      return;
    }
    setCircuit((prev) => {
      const { circuit: next, error } = addMultiGate(prev, qubitId, gate);
      if (error) {
        alert(`⚠️ ${error}`);
        return prev;
      }
      return next;
    });
  }, []);

  const removeGate = useCallback((qubitId, gateIndex) => {
    setCircuit((prev) => removeGateFromCircuit(prev, qubitId, gateIndex));
  }, []);

  const clear = useCallback(() => {
    setCircuit((prev) => prev.map((_, i) => initialQubit(i)));
  }, []);

  const loadPreset = useCallback((key) => {
    const preset = PRESETS[key];
    if (preset) setCircuit(preset.build());
  }, []);

  return {
    circuit,
    addQubit,
    removeQubit,
    dropGate,
    removeGate,
    clear,
    loadPreset,
  };
}
