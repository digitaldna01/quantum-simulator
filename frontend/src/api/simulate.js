import { postJson } from "./client";

// Returns { statevector: string, top_states: string[] }.
export function simulateCircuit(circuit, options) {
  return postJson("/simulate", { circuit }, options);
}
