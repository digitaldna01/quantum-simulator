"""Runtime tensor-network circuit used by the Flask backend.

This file is intentionally a near-duplicate of
``tensornetwork_simulator/tensornetwork_circuit.py``. The other copy is the
educational artifact referenced by the project README; this copy is the
runtime dependency of ``backend/app.py``. Keep the two in sync when the
public surface (gate methods, ``run``, ``state_to_qubits``,
``top_possible_qubit_states``) changes.
"""

import tensornetwork as tn
import numpy as np

# Pauli gates
I = np.eye(2, dtype=complex)
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

# Other single-qubit gates
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
S = np.array([[1, 0], [0, 1j]], dtype=complex)
T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)


class TensorNetworkCircuit:
    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        self.state_nodes = []
        with tn.NodeCollection(self.state_nodes):
            state = [
                tn.Node(np.array([1.0 + 0.0j, 0.0 + 0.0j], dtype=complex))
                for _ in range(num_qubits)
            ]
            self.qubits = [node[0] for node in state]
        self.result = None

    def apply_gate(self, gate, apply_qubit):
        gate_node = tn.Node(gate)
        for index_of_gate, qubit in enumerate(apply_qubit):
            tn.connect(self.qubits[qubit], gate_node[index_of_gate])
            self.qubits[qubit] = gate_node[index_of_gate + len(apply_qubit)]

    def controls_target_gate_generator(self, gate, num_control_qubits):
        P0 = np.array([[1, 0], [0, 0]])
        P1 = np.array([[0, 0], [0, 1]])

        num_of_cases = 2 ** num_control_qubits
        total_qubits = num_control_qubits + 1

        matrix = np.zeros((2 ** total_qubits, 2 ** total_qubits), dtype=complex)

        for index in range(num_of_cases):
            term = np.eye(1)
            order = 0
            control_state = [int(x) for x in format(index, f'0{num_control_qubits}b')]
            for _ in range(total_qubits):
                if order < num_control_qubits:
                    term = np.kron(term, P0 if control_state[order] == 0 else P1)
                    order += 1
                else:
                    term = np.kron(term, gate if index == num_of_cases - 1 else I)
            matrix += term

        reshaped = [2] * (2 * (num_control_qubits + 1))
        return matrix.reshape(reshaped)

    # --- Single-qubit gates ---
    def x(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(X, apply_qubit)

    def y(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(Y, apply_qubit)

    def z(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(Z, apply_qubit)

    def h(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(H, apply_qubit)

    def s(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(S, apply_qubit)

    def t(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(T, apply_qubit)

    # --- Multi-qubit gates ---
    # Note: control lists are not mutated; we always build a fresh [*controls, target].
    def cx(self, control_qubit, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CX = self.controls_target_gate_generator(X, 1)
            self.apply_gate(CX, [*control_qubit, target_qubit])

    def cz(self, control_qubit, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CZ = self.controls_target_gate_generator(Z, 1)
            self.apply_gate(CZ, [*control_qubit, target_qubit])

    def ccx(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CCX = self.controls_target_gate_generator(X, 2)
            self.apply_gate(CCX, [*control_qubits, target_qubit])

    def ccz(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CCZ = self.controls_target_gate_generator(Z, 2)
            self.apply_gate(CCZ, [*control_qubits, target_qubit])

    def mcx(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            MCX = self.controls_target_gate_generator(X, len(control_qubits))
            self.apply_gate(MCX, [*control_qubits, target_qubit])

    def mcz(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            MCZ = self.controls_target_gate_generator(Z, len(control_qubits))
            self.apply_gate(MCZ, [*control_qubits, target_qubit])

    def run(self):
        self.result = tn.contractors.greedy(
            self.state_nodes, output_edge_order=self.qubits
        )

    def state_to_qubits(self):
        result_statevector = self.result.tensor.flatten()
        result = ""
        for i, amp in enumerate(result_statevector):
            if amp != 0:
                result += f'{amp:.3f} * |{i:0{self.num_qubits}b}> + '
        return result[:-2]

    def top_possible_qubit_states(self):
        max_prob = 0
        result = []
        result_statevector = self.result.tensor.flatten()
        for i, amp in enumerate(result_statevector):
            prob = np.round(np.abs(amp), decimals=5)
            if prob > max_prob:
                max_prob = prob
                result = [f'|{i:0{self.num_qubits}b}>']
            elif prob == max_prob:
                result.append(f'|{i:0{self.num_qubits}b}>')
        return result
