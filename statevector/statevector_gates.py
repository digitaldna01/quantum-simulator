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
CX = np.zeros((2, 2, 2, 2), dtype=complex)
CX[0][0][0][0] = 1
CX[0][1][0][1] = 1
CX[1][0][1][1] = 1
CX[1][1][1][0] = 1

CZ = np.zeros((2, 2, 2, 2), dtype=complex)
CZ[0][0][0][0] = 1
CZ[0][1][0][1] = 1
CZ[1][0][1][0] = 1
CZ[1][1][1][1] = -1

# initiate 3-qubit gates
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



class statevector_circuit(object):
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
                apply_gate = np.kron(gate, apply_gate)
            else:
                apply_gate = np.kron(I, apply_gate)
        self.statevector = np.dot(apply_gate, self.statevector)

    # Define the hadarmard gate
    def h(self, apply_qubit):
        # create applying matrix with hadamard gate
        self.apply_gate(H, apply_qubit)
    
    # TODO                                                                                                                    
    def __repr__(self):
        return print(self.statevector_to_qubits())
# Define the hadarmard gate
def h(n):
    """_summary_

    Args:
        n (np.array): takes statevector of n qubits

    Returns:
        superpositioned: return the superpositioned state of n qubits after applying the hadarmard gate
    """
    return np.array([1/np.sqrt(2**n) for i in range(2**n)])