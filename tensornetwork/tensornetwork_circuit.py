import tensornetwork as tn
import numpy as np

# initiate Pauli logic gates
I = np.eye(2, dtype=complex)
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

# initiate quantum gates
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2) 
S = np.array([[1, 0], [0, 1j]], dtype=complex)
T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)


class TensorNetworkCircuit(object):
    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        self.state_nodes = [
            tn.Node(np.array([1.0 + 0.0j, 0.0 + 0.0j], dtype=complex)) for _ in range(num_qubits)
        ]
        self.qubits = [node[0] for node in self.state_nodes]
    
    # Define apply gate function
    # apply_qubit parameter is the list of qubit index that the gate will be applied to
    def apply_gate(self, gate, apply_qubit):
        gate_node = tn.Node(gate)
        for index, bit in enumerate(apply_qubit):
            tn.connect(self.qubits[bit], gate_node[index])
            self.qubits[bit] = gate_node[index + len(apply_qubit)]
    
    def run(self):
        all_nodes = []
        result = tn.contractors.optimal(all_nodes, output_edge_order=self.qubits)
        return result.tensor
    
    # Define the hadarmard gate
    def h(self, apply_qubit):
        self.apply_gate(H, apply_qubit)


