from qiskit import QuantumCircuit, transpile
import qiskit_aer as Aer
from qiskit_aer import StatevectorSimulator
from qiskit.quantum_info import Statevector, DensityMatrix
from qiskit.visualization import plot_histogram, plot_state_city

import matplotlib.pyplot as plt 
import math as m

# Oracle Circuit
def oracle_circuit(qc, number_of_qubits, marked_states):
    for mid, target in enumerate(marked_states):
        qc.barrier()
        rev_target = target[::-1]
        zero_inds = [ind for ind in range(number_of_qubits) if rev_target[ind] == '0']
        if zero_inds != []:
            qc.x(zero_inds)
        # mcz
        qc.h(number_of_qubits - 1) # Apply H-gate to the last qubit
        qc.mcx(list(range(number_of_qubits - 1)), number_of_qubits - 1) # multi-controlled-x gate
        qc.h(number_of_qubits - 1) # Apply H-gate to the last qubit
        if zero_inds != []:
            qc.x(zero_inds)

# Diffuser Circuit
def diffuser_circuit(qc, number_of_qubits):
    for qubit in range(number_of_qubits):
        qc.h(qubit)
    for qubit in range(number_of_qubits):   
        qc.x(qubit)
    qc.h(number_of_qubits-1)
    qc.mcx(list(range(number_of_qubits-1)), number_of_qubits-1)
    qc.h(number_of_qubits-1)
    for qubit in range(number_of_qubits):
        qc.x(qubit)
    for qubit in range(number_of_qubits):  
        qc.h(qubit)
    return qc

def grover_circuit(num_qubits, marked_states):
    ### Create a Quantum Circuit with three qubits
    qc = QuantumCircuit(num_qubits)
    
    # Apply H-gate to each qubit:
    for qubit in range(3):
        qc.h(qubit)
        
    # Apply a Oracle
    oracle_circuit(qc, num_qubits, marked_states)
    
    # Apply a diffuser
    diffuser_circuit(qc, num_qubits)
    
    return qc

def get_result(result, num_of_qubits, marked_states):
    statevector = result.get_statevector().data
    amp = abs(statevector).argsort()[::-1][:len(marked_states)]
    
    result = []
    for i in range(len(amp)):
        result.append(f'|{amp[i]:0{num_of_qubits}b}>')
    return result
    
### TESTING ###
# Define the number of qubits
number_of_qubits = 3

# Define the marked state
marked_states = ['101', '110']

## Run simulation on Statevector backend
statevector_sim = Aer.StatevectorSimulator()
qsam_sim = Aer.QasmSimulator()

sim = Aer.StatevectorSimulator()
qc = grover_circuit(number_of_qubits, marked_states)

result = sim.run(qc).result()
result = get_result(result, number_of_qubits, marked_states)

print("Marked states : ", marked_states, "\n")
print("Qiskit Found Result : ", result, "\n")

# TODO 
# Plot the results
# state = DensityMatrix(qc)
# plot_state_city(state, color=['midnightblue', 'crimson'], title="New State City").savefig('qiskit/state_city.png')  