"""Tests for the circuit serialization/execution path.

Regression coverage for the gate-ordering bug: gates must be applied in
timestep (column) order across lanes, not lane-by-lane. A 3-qubit Grover
search marking |101> is the canonical case that exposes it.

Runnable two ways:
    pytest backend/tests/test_simulate.py
    python  backend/tests/test_simulate.py     # no pytest needed
"""

import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
ROOT = os.path.dirname(BACKEND)
for path in (BACKEND, os.path.join(ROOT, "statevector_simulator"),
             os.path.join(ROOT, "qiskit_simulator")):
    if path not in sys.path:
        sys.path.insert(0, path)

from simulator.tn_simulator import TensorNetworkCircuit
from simulator.utils import apply_gate_from_json


# --- Build circuit JSON exactly as the frontend's gateLogic.js does ---
def initial_qubit(i):
    return {"id": i, "gates": [{"type": "|0>"}]}


def add_single(circuit, qid, gate):
    return [{**q, "gates": q["gates"] + [gate]} if q["id"] == qid else q
            for q in circuit]


def add_multi(circuit, qid, gtype):
    triple = gtype in ("CCZ", "CCX", "MCX", "MCZ")
    ctrl_count = 2 if triple else 1
    controls = [qid + i for i in range(ctrl_count)]
    target = qid + ctrl_count
    involved = controls + [target]
    max_len = max(len(circuit[i]["gates"]) for i in involved)
    out = []
    for i, q in enumerate(circuit):
        gates = list(q["gates"])
        while len(gates) < max_len:
            gates.append({"type": "None"})
        if i in controls:
            gates.append({"type": "Control_C"})
        elif i == target:
            gates.append({"type": f"Target_{gtype[-1]}", "backendType": gtype,
                          "controls": controls, "target": target})
        out.append({**q, "gates": gates})
    return out


def build_bell():
    c = [initial_qubit(0), initial_qubit(1)]
    c = add_single(c, 0, {"type": "H"})
    return add_multi(c, 0, "CX")


def build_grover():
    c = [initial_qubit(0), initial_qubit(1), initial_qubit(2)]
    for q in (0, 1, 2):
        c = add_single(c, q, {"type": "H"})       # init
    c = add_single(c, 1, {"type": "X"})           # oracle |101>
    c = add_multi(c, 0, "CCZ")
    c = add_single(c, 1, {"type": "X"})
    for q in (0, 1, 2):
        c = add_single(c, q, {"type": "H"})       # diffuser
    for q in (0, 1, 2):
        c = add_single(c, q, {"type": "X"})
    c = add_multi(c, 0, "CCZ")
    for q in (0, 1, 2):
        c = add_single(c, q, {"type": "X"})
    for q in (0, 1, 2):
        c = add_single(c, q, {"type": "H"})
    return c


def run_tn(circuit_json, num_qubits):
    qc = TensorNetworkCircuit(num_qubits)
    apply_gate_from_json(qc, circuit_json)
    qc.run()
    sv = qc.result.tensor.flatten()
    return {f"{i:0{num_qubits}b}": float(abs(amp) ** 2) for i, amp in enumerate(sv)}


# --- Tests ---
def test_grover_marks_101():
    probs = run_tn(build_grover(), 3)
    assert abs(probs["101"] - 0.781) < 0.02, probs
    # every other basis state stays small
    for state, p in probs.items():
        if state != "101":
            assert p < 0.05, (state, p)


def test_bell_is_balanced():
    probs = run_tn(build_bell(), 2)
    assert abs(probs["00"] - 0.5) < 0.02, probs
    assert abs(probs["11"] - 0.5) < 0.02, probs
    assert probs["01"] < 0.02 and probs["10"] < 0.02, probs


def test_statevector_engine_agrees():
    # The standalone statevector engine (separate code, not the live backend)
    # must concentrate ~0.78 on the same marked state.
    from statevector_grover import grover_cirquit
    sim = grover_cirquit(3, ["101"])
    probs = np.abs(sim.statevector) ** 2
    top = int(np.argmax(probs))
    assert format(top, "03b") == "101", format(top, "03b")
    assert abs(probs[top] - 0.781) < 0.02, probs[top]


def test_qiskit_engine_agrees():
    # Best-effort: the standalone qiskit engine should also peak at ~0.78.
    # qiskit uses little-endian, so we check the dominant probability, not the label.
    try:
        from qiskit_grover import grover_circuit
        import qiskit_aer as Aer
    except Exception as exc:  # noqa: BLE001 - qiskit/matplotlib env optional
        print(f"  (skipped qiskit engine: {exc})")
        return
    qc = grover_circuit(3, ["101"])
    sv = Aer.StatevectorSimulator().run(qc).result().get_statevector().data
    probs = np.abs(sv) ** 2
    assert abs(float(np.max(probs)) - 0.781) < 0.02, float(np.max(probs))


if __name__ == "__main__":
    tests = [
        test_grover_marks_101,
        test_bell_is_balanced,
        test_statevector_engine_agrees,
        test_qiskit_engine_agrees,
    ]
    failed = 0
    for test in tests:
        try:
            test()
            print(f"PASS  {test.__name__}")
        except AssertionError as exc:
            failed += 1
            print(f"FAIL  {test.__name__}: {exc}")
    sys.exit(1 if failed else 0)
