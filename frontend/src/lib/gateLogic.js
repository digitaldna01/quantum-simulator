import { v4 as uuidv4 } from "uuid";

const MULTI_GATE_TYPES = ["CZ", "CX", "CCX", "CCZ", "MCX", "MCZ"];
const TRIPLE_GATE_TYPES = ["CCZ", "CCX", "MCX", "MCZ"];

export const isMultiGate = (type) => MULTI_GATE_TYPES.includes(type);
const isTripleGate = (type) => TRIPLE_GATE_TYPES.includes(type);

export const requiredQubits = (type) => (isTripleGate(type) ? 3 : 2);
const controlCount = (type) => (isTripleGate(type) ? 2 : 1);

export const initialQubit = (id) => ({ id, gates: [{ type: "|0>" }] });

export function addQubit(circuit) {
  return [...circuit, initialQubit(circuit.length)];
}

export function removeQubit(circuit, qubitId) {
  if (qubitId === 0) return circuit; // first qubit is permanent
  return circuit.filter((q) => q.id !== qubitId);
}

export function addSingleGate(circuit, qubitId, gate) {
  return circuit.map((q) =>
    q.id === qubitId ? { ...q, gates: [...q.gates, gate] } : q
  );
}

// Returns { circuit, error }. `error` is set when placement is rejected.
export function addMultiGate(circuit, qubitId, gate) {
  const needed = requiredQubits(gate.type);
  if (circuit.length < needed) {
    return {
      circuit,
      error: `${gate.type} requires at least ${needed} qubits.`,
    };
  }

  const ctrlCount = controlCount(gate.type);
  const controlIds = Array.from({ length: ctrlCount }, (_, i) => qubitId + i);
  const targetId = qubitId + ctrlCount;

  if (targetId >= circuit.length) {
    return { circuit, error: "Not enough qubits for multigate placement." };
  }

  const gateId = uuidv4();
  const involved = [...controlIds, targetId];
  const maxLength = Math.max(...involved.map((i) => circuit[i].gates.length));

  const updated = circuit.map((q, i) => {
    const padded = [...q.gates];
    while (padded.length < maxLength) {
      padded.push({ type: "None", linkedGateId: gateId });
    }

    if (controlIds.includes(i)) {
      const isLeadM = (gate.type === "MCX" || gate.type === "MCZ")
        && controlIds.indexOf(i) === 0;
      padded.push({
        type: `Control_${isLeadM ? "M" : "C"}`,
        linkedGateId: gateId,
      });
    } else if (i === targetId) {
      const targetSymbol = gate.type.slice(-1); // "X" or "Z"
      padded.push({
        type: `Target_${targetSymbol}`,
        linkedGateId: gateId,
        backendType: gate.type,
        controls: controlIds,
        target: targetId,
      });
    }

    return { ...q, gates: padded };
  });

  return { circuit: updated, error: null };
}

export function removeGate(circuit, qubitId, gateIndex) {
  const gate = circuit[qubitId].gates[gateIndex];

  // Multi-gate parts share a linkedGateId — remove all of them at once.
  if (gate.linkedGateId) {
    return circuit.map((q) => ({
      ...q,
      gates: q.gates.filter((g) => g.linkedGateId !== gate.linkedGateId),
    }));
  }

  return circuit.map((q) =>
    q.id === qubitId
      ? { ...q, gates: q.gates.filter((_, idx) => idx !== gateIndex) }
      : q
  );
}
