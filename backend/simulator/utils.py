"""Translate the JSON circuit payload from the frontend into method calls
on a TensorNetworkCircuit instance.

Frontend payload shape (per qubit):
    {"id": int, "gates": [{"type": str, ...}, ...]}

For multi-qubit gates the target gate carries the routing info
(`backendType`, `controls`, `target`); the matching `Control_*` entries on
other qubits are render-only and are ignored here.

Gates are applied column-by-column (timestep order) across the lanes, not
lane-by-lane: quantum gates do not commute, so a qubit's gates must be
interleaved with the others in time order for the result to be correct.
"""

# Single-qubit gates: type -> circuit method name.
SINGLE_GATES = {
    "H": "h",
    "X": "x",
    "Y": "y",
    "Z": "z",
    "S": "s",
    "T": "t",
}

# Multi-qubit gates keyed by (gate.type, gate.backendType).
# Value is the circuit method name. Routing comes from gate["controls"]/["target"].
MULTI_GATES = {
    ("Target_X", "CX"): "cx",
    ("Target_Z", "CZ"): "cz",
    ("Target_X", "CCX"): "ccx",
    ("Target_X", "MCX"): "ccx",   # frontend treats MCX/CCX the same when arity=2
    ("Target_Z", "CCZ"): "ccz",
    ("Target_Z", "MCZ"): "ccz",
}


def apply_gate_from_json(qc, circuit_json):
    max_len = max((len(qubit["gates"]) for qubit in circuit_json), default=0)
    for col in range(max_len):
        for qubit in circuit_json:
            gates = qubit["gates"]
            if col >= len(gates):
                continue
            gate = gates[col]
            gtype = gate["type"]

            if gtype in SINGLE_GATES:
                getattr(qc, SINGLE_GATES[gtype])([qubit["id"]])
                continue

            method_name = MULTI_GATES.get((gtype, gate.get("backendType")))
            if method_name is None:
                # Control_* entries and padding ("None", "|0>") fall through silently;
                # they are render-only on the frontend.
                continue

            getattr(qc, method_name)(gate["controls"], gate["target"])
