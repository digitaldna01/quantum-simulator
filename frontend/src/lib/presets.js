import { initialQubit, addSingleGate, addMultiGate } from "./gateLogic";

// Each preset is built up using the same logic the UI uses, so the
// resulting circuit shape is exactly what the backend dispatch expects.

function buildBell() {
  let circuit = [initialQubit(0), initialQubit(1)];
  circuit = addSingleGate(circuit, 0, { type: "H" });
  const result = addMultiGate(circuit, 0, { type: "CX" });
  return result.error ? circuit : result.circuit;
}

function buildSuperposition() {
  let circuit = [initialQubit(0), initialQubit(1)];
  circuit = addSingleGate(circuit, 0, { type: "H" });
  circuit = addSingleGate(circuit, 1, { type: "H" });
  return circuit;
}

function buildFlip() {
  let circuit = [initialQubit(0)];
  circuit = addSingleGate(circuit, 0, { type: "X" });
  return circuit;
}

export const PRESETS = {
  bell: { label: "Bell pair", build: buildBell },
  superposition: { label: "Superposition", build: buildSuperposition },
  flip: { label: "Bit flip", build: buildFlip },
};
