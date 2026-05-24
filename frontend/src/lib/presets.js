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

// One Grover iteration over 3 qubits marking |101> (Q0=1, Q1=0, Q2=1).
// The oracle wraps a CCZ in X gates on the zero-bit qubit (Q1); the diffuser
// is H·X·CCZ·X·H on all qubits. Running this concentrates ~78% on |101>.
function buildGrover() {
  let c = [initialQubit(0), initialQubit(1), initialQubit(2)];
  for (const q of [0, 1, 2]) c = addSingleGate(c, q, { type: "H" }); // init
  c = addSingleGate(c, 1, { type: "X" }); // oracle: mark |101>
  c = addMultiGate(c, 0, { type: "CCZ" }).circuit;
  c = addSingleGate(c, 1, { type: "X" });
  for (const q of [0, 1, 2]) c = addSingleGate(c, q, { type: "H" }); // diffuser
  for (const q of [0, 1, 2]) c = addSingleGate(c, q, { type: "X" });
  c = addMultiGate(c, 0, { type: "CCZ" }).circuit;
  for (const q of [0, 1, 2]) c = addSingleGate(c, q, { type: "X" });
  for (const q of [0, 1, 2]) c = addSingleGate(c, q, { type: "H" });
  return c;
}

export const PRESETS = {
  bell: { label: "Bell pair", build: buildBell },
  superposition: { label: "Superposition", build: buildSuperposition },
  flip: { label: "Bit flip", build: buildFlip },
  grover: { label: "Grover (3q · |101⟩)", build: buildGrover },
};
