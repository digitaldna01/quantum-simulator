import tensornetwork as tn
from tensornetwork_circuit import TensorNetworkCircuit
import numpy as np

def grover_cirquit(num_qubits, marked_states):
    # Initialize the statevector qubits
    tn_circuit = TensorNetworkCircuit(num_qubits)
    
    # Apply H-gate to each qubit
    for qubit in range(num_qubits):
        tn_circuit.h([qubit])
    
    # Apply the Oracle
    # TODO Create the oracle circuit
    for mid, target in enumerate(marked_states):
        # Apply the X gate to non zero marked states qubits
        zero_inds = [ind for ind in range(num_qubits) if target[ind] == '0']
        if zero_inds != []:
            for i in range(len(zero_inds)):
                tn_circuit.x([zero_inds[i]])
        # mcz
        tn_circuit.mcz(list(range(num_qubits - 1)), num_qubits - 1) # multi-controlled-x gate
        # Apply the X gate to non zero marked states qubits
        if zero_inds != []:
            for i in range(len(zero_inds)):
                tn_circuit.x([zero_inds[i]])

    # Apply the diffuser
    for qubit in range(num_qubits):
        tn_circuit.h([qubit])
    for qubit in range(num_qubits):   
        tn_circuit.x([qubit])
    tn_circuit.h([num_qubits-1])
    # Apply the multi-controlled-x gate to the qubits
    tn_circuit.mcx(list(range(num_qubits-1)), num_qubits-1)
    tn_circuit.h([num_qubits-1])
    for qubit in range(num_qubits):
        tn_circuit.x([qubit])
    for qubit in range(num_qubits):  
        tn_circuit.h([qubit])
    
    return tn_circuit



# TESTING Example   
# Define the number of qubits
number_of_qubits = 4

# Define the marked state
marked_states = ['1010', '1110', '0001']

# Create the grover cirquit and run    
tn_cirucit = grover_cirquit(number_of_qubits, marked_states)
tn_cirucit.run()

# Check the circuit correctness
print("Marked_states : ", marked_states, "\n")
print("state : ")
print(tn_cirucit.state_to_qubits(), "\n")
print("Top possible qubit states : ")
print(tn_cirucit.top_possible_qubit_states(), "\n")

# TODO


