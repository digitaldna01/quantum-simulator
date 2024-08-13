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
        self.state_nodes = []
        with tn.NodeCollection(self.state_nodes):
            state = [tn.Node(np.array([1.0 + 0.0j, 0.0 + 0.0j], dtype=complex)) for _ in range(num_qubits)]
            self.qubits = [node[0] for node in state]
        self.result = None

    
    # Define apply gate function
    # apply_qubit parameter is the list of qubit index that the gate will be applied to
    def apply_gate(self, gate, apply_qubit):
        gate_node = tn.Node(gate)
        for index_of_gate, qubit in enumerate(apply_qubit):
            tn.connect(self.qubits[qubit], gate_node[index_of_gate])
            self.qubits[qubit] = gate_node[index_of_gate + len(apply_qubit)]
    
    # Define the X gate
    def x(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(X, apply_qubit)
    
    # Define the Y gate
    def y(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(Y, apply_qubit)
    
    # Define the Z gate
    def z(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(Z, apply_qubit)
    
    ### Quantum Gates ###
    # Define the hadarmard gate
    def h(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(H, apply_qubit)
    
    # Define the S gate
    def s(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(S, apply_qubit)
    
    # Define the T gate
    def t(self, apply_qubit):
        with tn.NodeCollection(self.state_nodes):
            self.apply_gate(T, apply_qubit)
    
            
    # Define simulation run
    def run(self):
        self.result = tn.contractors.optimal(self.state_nodes, output_edge_order=self.qubits)
    
    def state_to_qubits(self):
        result_tensor = self.result.tensor
        print(result_tensor)
        result = ""
        for i in range(len(result_tensor)):
            if result_tensor[i] != 0:
                result += f'{result_tensor[i]:.2f} * |{i:0{self.num_qubits}b}> + '
        return result[:-2]
    
    def state_representation(self):
        result_tensor = self.result.tensor
        


