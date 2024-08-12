from qiskit import QuantumCircuit, transpile
import qiskit_aer as Aer
from qiskit_aer import StatevectorSimulator
from qiskit.quantum_info import Statevector, DensityMatrix
from qiskit.visualization import plot_histogram, plot_state_city

import matplotlib.pyplot as plt 
import math as m

# Define the number of qubits and the marked items
number_of_qubits = 3
marked_states = ['101', '110']

# Define the number of iterations
number_of_iteration = m.floor((m.pi/4)*m.sqrt(2**number_of_qubits / len(marked_states)))

### Create a Quantum Circuit with three qubits
qc = QuantumCircuit(number_of_qubits)

# Apply H-gate to each qubit:
for qubit in range(3):
    qc.h(qubit)
    
# Apply a barrier for visual separation
qc.barrier()
transpiled_qc = transpile(qc)
transpiled_qc.draw(output='mpl', filename='qiskit/initialized_circuit.png')

# Apply the Oracle
# for mid, marked_item in enumerate(marked_items):
    
# for qubit in range(number_of_qubits):
#     if marked_items[0][qubit] == '0':
#         qc.x(qubit)
#     qc.x(qubit)
# qc.cz(0, 2)
# qc.cz(1, 2)

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

# Apply a barrier for visual separation
qc.barrier()
transpiled_qc = transpile(qc)
transpiled_qc.draw(output='mpl', filename='qiskit/oracle_circuit.png')

# Apply the Diffuser
##########################################
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
##########################################
    
### from Leopard
##########################################
# qc.h(range(number_of_qubits))
# qc.x(range(number_of_qubits))
# qc.h(number_of_qubits - 1)
# qc.mcx(list(range(number_of_qubits - 1)), number_of_qubits - 1)
# qc.h(number_of_qubits - 1)
# qc.x(range(number_of_qubits))
# qc.h(range(number_of_qubits))
##########################################

##########################################
# for qubit in range(number_of_qubits):
#     qc.h(qubit)
#     qc.x(qubit)
# qc.ccz(0, 1, 2)
# for qubit in range(number_of_qubits):
#     qc.x(qubit)
#     qc.h(qubit)
##########################################
state = DensityMatrix(qc)
plot_state_city(state, color=['midnightblue', 'crimson'], title="New State City").savefig('qiskit/state_city.png')  
# Measure all qubits
qc.measure_all()

# Apply a barrier for visual separation
transpiled_qc = transpile(qc)
transpiled_qc.draw(output='mpl', filename='qiskit/diffuser_circuit.png')

### Run simulation on Statevector backend
statevector_sim = Aer.StatevectorSimulator()
qsam_sim = Aer.QasmSimulator()
aer_sim = Aer.AerSimulator(method='density_matrix')

transpiled_grover_circuit = transpile(qc, aer_sim)
results = aer_sim.run(transpiled_grover_circuit).result()
print(results.get_counts())
counts = results.get_counts()
plot_histogram(counts).savefig('qiskit/histogram.png')

# TODO 
# 1. Create a circuit for 110, 101 - done
# 2. Create a circuit for take in marked_states
# 3. Create a general grover simulator
