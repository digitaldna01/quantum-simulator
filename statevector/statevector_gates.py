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

# initiate 2-qubit gates
CX = np.zeros((4, 4), dtype=complex)
CX[0][0] = 1
CX[1][1] = 1
CX[2][3] = 1
CX[3][2] = 1

CZ = np.zeros((4, 4), dtype=complex)
CZ[0][0] = 1
CZ[1][1] = 1
CZ[2][2] = 1
CZ[3][3] = -1

# CX = np.zeros((2, 2, 2, 2), dtype=complex)
# CX[0][0][0][0] = 1
# CX[0][1][0][1] = 1
# CX[1][0][1][1] = 1
# CX[1][1][1][0] = 1

# CZ = np.zeros((2, 2, 2, 2), dtype=complex)
# CZ[0][0][0][0] = 1
# CZ[0][1][0][1] = 1
# CZ[1][0][1][0] = 1
# CZ[1][1][1][1] = -1

# initiate 3-qubit gates
CCX = np.zeros((8, 8), dtype=complex)
CCX[0][0] = 1
CCX[1][1] = 1
CCX[2][2] = 1
CCX[3][3] = 1
CCX[4][4] = 1
CCX[5][5] = 1
CCX[6][7] = 1
CCX[7][6] = 1

CCX = np.zeros((2, 2, 2, 2, 2, 2), dtype=complex)
CCX[0][0][0][0][0][0] = 1
CCX[0][0][1][0][0][1] = 1
CCX[0][1][0][0][1][0] = 1
CCX[0][1][1][1][1][1] = 1
CCX[1][0][0][1][0][0] = 1
CCX[1][0][1][1][0][1] = 1
CCX[1][1][0][1][1][0] = 1
CCX[1][1][1][0][1][1] = 1

CCZ = np.zeros((2, 2, 2, 2, 2, 2), dtype=complex)
CCZ[0][0][0][0][0][0] = 1
CCZ[0][0][1][0][0][1] = 1
CCZ[0][1][0][0][1][0] = 1
CCZ[0][1][1][0][1][1] = 1
CCZ[1][0][0][1][0][0] = 1
CCZ[1][0][1][1][0][1] = 1
CCZ[1][1][0][1][1][0] = 1
CCZ[1][1][1][1][1][1] = -1

# gate generator
def gate_generator(gate, num_qubits, apply_qubit):
    pass

class StatevectorCircuit(object):
    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        for i in range(num_qubits):
            if i == 0:
                self.statevector = np.array([1, 0], dtype=complex)
            else:
                self.statevector = np.kron(self.statevector, np.array([1, 0], dtype=complex))
        # self.statevector = np.zeros(2**num_qubits, dtype=complex)
        # self.statevector[0] = 1
    
    # Define the convert function of possible qubit states from statevector
    def top_possible_qubit_states(self):
        num_qubits = self.num_qubits
        max_prob = 0
        result = []
        for i in range(len(self.statevector)):
            if np.abs(self.statevector[i]) > max_prob:
                max_prob = np.abs(self.statevector[i])
                result = []
                result.append(f'|{i:0{num_qubits}b}>')
            elif np.abs(self.statevector[i]) == max_prob:
                result.append(f'|{i:0{num_qubits}b}>')
        return result   
    
    # Define the convert function of statevector to qubits
    def statevector_to_qubits(self):
        result = ""
        for i in range(len(self.statevector)):
            if self.statevector[i] != 0:
                result += f'{self.statevector[i]:.2f} * |{i:0{self.num_qubits}b}> + '
        return result[:-2]
    
    # Define the apply gate function
    def apply_gate(self, gate, apply_qubit):
        apply_gate = 1
        # If apply gate index is the same as the current loop index, kron gate to apply gate
        for i in range(self.num_qubits):
            if i == apply_qubit:
                apply_gate = np.kron(apply_gate, gate)
            else:
                apply_gate = np.kron(apply_gate, I)
        self.statevector = np.dot(apply_gate, self.statevector)
    
    # TODO Need to Implement the multi-gate-function
    
    # Apply the gates box to the designated qubits 
    def control_target_gate(self, gate, control_qubit, target_qubit):
        # Define projectors |0><0| and |1><1|
        control = np.array([[1, 0], [0, 0]])
        target = np.array([[0, 0], [0, 1]])

        control_gate = 1
        target_gate = 1
        # Define the control-target gate
        for qubit in range(self.num_qubits):
            if qubit == control_qubit:
                control_gate = np.kron(control_gate, control)
                target_gate = np.kron(target_gate, target)
            elif qubit == target_qubit:
                control_gate = np.kron(control_gate, I)
                target_gate = np.kron(target_gate, gate)
            else:
                control_gate = np.kron(control_gate, I)
                target_gate = np.kron(target_gate, I)
        
        gate = control_gate + target_gate  
        return gate
    
    # Apply the gates box to the designated qubits 
    def controls_target_gate(self, gate, control_qubits, target_qubit):
        # Define projectors |0><0| and |1><1|
        P0 = [[1, 0], [0, 0]]
        P1 = [[0, 0], [0, 1]]

        # case P0, P1
        cases = [P0, P1]
        # define numer of cases
        num_of_cases = 2 ** len(control_qubits)
        
        # Define empty matrix
        matrix = np.zeros((2 ** self.num_qubits, 2 ** self.num_qubits), dtype=complex)
        
        # Define the control-target gate
        ### TODO
        # 둘다 하나씩일때 하는거다
        for cases in range(num_of_cases - 1):
            # local variable for each cases matrix
            term = np.eye(1)
            order = 0
            # cases box
            control_state = [int(x) for x in format(cases, f'0{len(control_qubits)}b')]
            print(control_state[0])
            for qubit in range(self.num_qubits):
                # loop
                if qubit in control_qubits:
                    index = control_state[order]
                    if index == 0:
                        term = np.kron(term, P0)
                    else:
                        term = np.kron(term, P1)
                    order += 1
                else:
                    term = np.kron(term, I)
            matrix += term
        
        last_term = np.eye(1)
        # Both controls are |1>
        for qubit in range(self.num_qubits):
            if qubit in control_qubits:
                last_term = np.kron(last_term, P1)
            elif qubit == target_qubit:
                last_term = np.kron(last_term, gate)
            else:
                last_term = np.kron(last_term, I)
        
        matrix += last_term
        print(matrix)
        return matrix
    

    def apply_mul_gates(self, gates, operating_qubits):
        for i, apply_qubit in enumerate(operating_qubits):
            self.apply_gate(gates[i], [apply_qubit])

    ### Pauli Gates ###
    # Define the X gate
    def x(self, apply_qubit):
        # create applying matrix with X gate
        self.apply_gate(X, apply_qubit)
    
    # Define the Y gate
    def y(self, apply_qubit):
        # create applying matrix with Y gate
        self.apply_gate(Y, apply_qubit)
    
    # Define the Z gate
    def z(self, apply_qubit):
        # create applying matrix with Z gate
        self.apply_gate(Z, apply_qubit)
    
    ### Quantum Gates ###
    # Define the hadarmard gate
    def h(self, apply_qubit):
        # create applying matrix with hadamard gate
        self.apply_gate(H, apply_qubit)
    
    # Define the S gate
    def s(self, apply_qubit):
        # create applying matrix with S gate
        self.apply_gate(S, apply_qubit)
    
    # Define the T gate
    def t(self, apply_qubit):
        # create applying matrix with T gate
        self.apply_gate(T, apply_qubit)
        
    ### 2-qubit Gates ###
    # Define the CNOT gate
    def cx(self, control_qubit, target_qubit):
        # create applying matrix with CNOT gate
        CX = self.controls_target_gate(X, [control_qubit], target_qubit)
        self.statevector = np.dot(CX, self.statevector)
    
    def cz(self, control_qubit, target_qubit):
        # create applying matrix with CZ gate
        CZ = self.controls_target_gate(Z, [control_qubit], target_qubit)
        self.statevector = np.dot(CZ, self.statevector)
    
    def ccx(self, control_qubits, target_qubit):
        # create applying matrix with CCX gate
        CCX = self.controls_target_gate(X, control_qubits, target_qubit)
        self.statevector = np.dot(CCX, self.statevector)
    
    def ccz(self, control_qubits, target_qubit):
        # create applying matrix with CCZ gate
        CCZ = self.controls_target_gate(Z, control_qubits, target_qubit)
        self.statevector = np.dot(CCZ, self.statevector)    
        
    # TODO                                                                                                                    
    def __repr__(self):
        return print(self.statevector_to_qubits())

# TODO 
# Implement applying CNOT gate
# Implement applying CZ gate
# Implement the multi-controlled-x gate
