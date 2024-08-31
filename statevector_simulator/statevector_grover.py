import numpy as np
from statevector_circuit import StatevectorCircuit
import os
import timeit

# INITIALIZATION OF STATEVECTOR QUBITS
# Define the statevector qubits
def create_statevector_qubits(num_qubits):
    statevector = StatevectorCircuit(num_qubits)
    return statevector

def oracle_circuit(StatevectorCircuit, marked_states):
    # check marked states and mark which states we need to find
    for mid, target in enumerate(marked_states):
        # Apply the X gate to non zero marked states qubits
        zero_inds = [ind for ind in range(StatevectorCircuit.num_qubits) if target[ind] == '0']
        if zero_inds != []:
            for i in range(len(zero_inds)):
                StatevectorCircuit.x(zero_inds[i])
        # mcz
        StatevectorCircuit.mcz(list(range(StatevectorCircuit.num_qubits - 1)), StatevectorCircuit.num_qubits - 1) # multi-controlled-x gate
        # Apply the X gate to non zero marked states qubits
        if zero_inds != []:
            for i in range(len(zero_inds)):
                StatevectorCircuit.x(zero_inds[i])
    return StatevectorCircuit

def diffuser_circuit(StatevectorCircuit):
    for qubit in range(StatevectorCircuit.num_qubits):
        StatevectorCircuit.h(qubit)
    for qubit in range(StatevectorCircuit.num_qubits):   
        StatevectorCircuit.x(qubit)
    StatevectorCircuit.h(StatevectorCircuit.num_qubits-1)
    # Apply the multi-controlled-x gate to the qubits
    StatevectorCircuit.mcx(list(range(StatevectorCircuit.num_qubits-1)), StatevectorCircuit.num_qubits-1)
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
    
    return statevector

### TESTING ###
# Define the number of qubits
number_of_qubits = 3

# Define the marked state
marked_states = ['101', '110']

# Create the grover cirquit and run
simulator = grover_cirquit(number_of_qubits, marked_states)

# Check the circuit correctness
print("Marked states: ", marked_states, "\n")
print("Top Possible qubit states ", simulator.top_possible_qubit_states(), "\n")   


# TODO
