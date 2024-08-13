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

def oracle_circuit(StatevectorCircuit, marked_states):
    # check marked states and mark which states we need to find
    for mid, target in enumerate(marked_states):
        rev_target = target[::-1]
        zero_inds = [ind for ind in range(number_of_qubits) if rev_target[ind] == '0']
    if zero_inds != []:
        StatevectorCircuit.x(zero_inds)
    # mcz
    StatevectorCircuit.h(number_of_qubits - 1) # Apply H-gate to the last qubit
    # TODO Apply the multi-controlled-x gate
    StatevectorCircuit.mcx(list(range(number_of_qubits - 1)), number_of_qubits - 1) # multi-controlled-x gate
    StatevectorCircuit.h(number_of_qubits - 1) # Apply H-gate to the last qubit
    if zero_inds != []:
        StatevectorCircuit.x(zero_inds)
    pass

def diffuser_circuit(StatevectorCircuit):
    for qubit in range(StatevectorCircuit.num_qubits):
        StatevectorCircuit.h(qubit)
    for qubit in range(StatevectorCircuit.num_qubits):   
        StatevectorCircuit.x(qubit)
    StatevectorCircuit.h(StatevectorCircuit.num_qubits-1)
    # Apply the multi-controlled-x gate 
    # TODO Apply the multi-controlled-x gate
    StatevectorCircuit.mcx(list(range(StatevectorCircuit.num_qubits-1)), StatevectorCircuit.num_qubits-1)
    ### ###
    StatevectorCircuit.h(StatevectorCircuit.num_qubits-1)
    for qubit in range(StatevectorCircuit.num_qubits):
        StatevectorCircuit.x(qubit)
    for qubit in range(StatevectorCircuit.num_qubits):  
        StatevectorCircuit.h(qubit)
    return StatevectorCircuit

# GROVER ALGORITHM
# Define the number of iterations of grover algorithm
def num_of_iterations(N, M):
    return int(np.pi/4 * np.sqrt(N/M))

# Define the grover cirquit
def grover_cirquit(num_qubits, marked_states):
    ### Initialize the statevector qubits ###
    statevector = StatevectorCircuit(num_qubits)
    
    ### All superposition ###
    # Apply H-gate to each qubit
    for qubit in range(num_qubits):
        statevector.h(qubit)
    
    ### Oracle ###
    # Apply the Oracle
    # TODO Create the oracle circuit
    statevector = oracle_circuit(statevector, marked_states)
    
    ### Diffuser ###
    # Apply the Diffuser
    # TODO Create the diffuser circuit
    statevector = diffuser_circuit(statevector)


# TESTING
# Define the number of qubits
number_of_qubits = 3
# Define the marked state
marked_state = ['101']

simulator = StatevectorCircuit(number_of_qubits)
simulator.h(0)
simulator.x(1)
print("Statevector to qubits", simulator.statevector_to_qubits(), "\n")
print("Top Possible qubit states ", simulator.top_possible_qubit_states(), "\n")
print("statevector: ", simulator.statevector, "\n")


# TODO
# 1. implement the grover algorithm
# 2. implement MCX gate
# 3. test the grover algorithm