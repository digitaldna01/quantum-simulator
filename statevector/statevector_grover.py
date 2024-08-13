import numpy as np
from statevector_gates import *

# INITIALIZATION OF STATEVECTOR QUBITS
# Define the statevector qubits
def create_statevector_qubits(n):
    statevector = np.zeros(2**n, dtype=complex)
    statevector[0] = 1
    return statevector

# Define the convert function of possible qubit states from statevector
def top_possible_qubit_states(statevector):
    num_qubits = len(statevector).bit_length() - 1
    max_prob = 0
    result = []
    for i in range(len(statevector)):
        if np.abs(statevector[i]) > max_prob:
            max_prob = np.abs(statevector[i])
            result = []
            result.append(f'|{i:0{num_qubits}b}>')
        elif np.abs(statevector[i]) == max_prob:
            result.append(f'|{i:0{num_qubits}b}>')
    return result

# GROVER ALGORITHM
# Define the number of iterations of grover algorithm
def num_of_iterations(N, M):
    return int(np.pi/4 * np.sqrt(N/M))



# TESTING
# Define the number of qubits
number_of_qubits = 3

# Define the marked state
marked_state = ['101']

simulator = statevector_circuit(number_of_qubits)
simulator.h(0)
print("Statevector to qubits", simulator.statevector_to_qubits(), "\n")
print("Top Possible qubit states ", simulator.top_possible_qubit_states(), "\n")
print("statevector: ", simulator.statevector, "\n")

# statevector = create_statevector_qubits(number_of_qubits)
# statevector = h(number_of_qubits) @ statevector
# TODO
# 1. connect the gates file to this file
# 2. implement the grover algorithm
# 3. test the grover algorithm