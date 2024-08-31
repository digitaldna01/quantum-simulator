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
    
    # Define the multi-controlled gate
    def controls_target_gate_generator(self, gate, num_control_qubits):
        # Define projectors |0><0| and |1><1|
        P0 = np.array([[1, 0], [0, 0]])  # Projector for |0>
        P1 = np.array([[0, 0], [0, 1]])  # Projector for |1>
        
        # define numer of cases
        num_of_cases = 2 ** num_control_qubits
        total_qubits = num_control_qubits + 1
        
        matrix = np.zeros((2 ** (num_control_qubits + 1), 2 ** (num_control_qubits + 1)), dtype=complex)

        for index in range(num_of_cases):
            # local variable for each cases matrix
            term = np.eye(1)
            order = 0
            # cases box
            control_state = [int(x) for x in format(index, f'0{num_control_qubits}b')]
            for qubit in range(total_qubits):
                if order < num_control_qubits :
                    checker = control_state[order]
                    if checker == 0:
                        term = np.kron(term, P0)
                    else:
                        term = np.kron(term, P1)
                    order += 1
                else:
                    if index == num_of_cases - 1:
                        term = np.kron(term, gate)
                    else:
                        term = np.kron(term, I) 
            
            matrix += term
        
        matrix = matrix.flatten()
        reshaped = []
        for i in range(num_control_qubits + 1):
            for _ in range(2):
                reshaped.append(2)
        matrix = matrix.reshape(reshaped)
        return matrix

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
    
    ### 2-qubit Gates ###
    # Define the CNOT gate
    def cx(self, control_qubit, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CX = self.controls_target_gate_generator(X, 1)
            control_qubit.append(target_qubit)
            self.apply_gate(CX, control_qubit)
    
    # Define the CZ gate
    def cz(self, control_qubit, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CZ = self.controls_target_gate_generator(Z, 1)
            control_qubit.append(target_qubit)
            self.apply_gate(CZ, control_qubit)
    
    def ccx(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CCX = self.controls_target_gate_generator(X, 2)
            control_qubits.append(target_qubit)
            self.apply_gate(CCX, control_qubits)
    
    def ccz(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            CCZ = self.controls_target_gate_generator(Z, 2)
            control_qubits.append(target_qubit)
            self.apply_gate(CCZ, control_qubits)
            
    def mcx(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            MCX = self.controls_target_gate_generator(X, len(control_qubits))
            control_qubits.append(target_qubit)
            self.apply_gate(MCX, control_qubits)
    
    def mcz(self, control_qubits, target_qubit):
        with tn.NodeCollection(self.state_nodes):
            MCZ = self.controls_target_gate_generator(Z, len(control_qubits))
            control_qubits.append(target_qubit)
            self.apply_gate(MCZ, control_qubits)
    
    # Define simulation run
    def run(self):
        self.result = tn.contractors.greedy(self.state_nodes, output_edge_order=self.qubits)
    
    # Define the convert function of matrix state to qubits
    def state_to_qubits(self):
        result_statevector = self.result.tensor.flatten()
        result = ""
        for i in range(len(result_statevector)):
            if result_statevector[i] != 0:
                result += f'{result_statevector[i]:.2f} * |{i:0{self.num_qubits}b}> + '
        return result[:-2]
    
    # Define the top possible qubit states
    def top_possible_qubit_states(self):
        num_qubits = self.num_qubits
        max_prob = 0
        result = []
        result_statevector = self.result.tensor.flatten()
        for i in range(len(result_statevector)):
            if np.round(np.abs(result_statevector[i]), decimals=5) > max_prob:
                max_prob = np.round(np.abs(result_statevector[i]), decimals=5)
                result = []
                result.append(f'|{i:0{num_qubits}b}>')
            elif np.round(np.abs(result_statevector[i]), decimals=5) == max_prob:
                result.append(f'|{i:0{num_qubits}b}>')
        return result   
    
    # TODO
    # Create target and control gate apply function
    
        


