from qiskit import QuantumCircuit, transpile
import qiskit_aer as Aer
from qiskit_aer import StatevectorSimulator
from qiskit.visualization import plot_histogram, plot_state_city

import matplotlib.pyplot as plt 
import math as m

# Define the number of qubits and the marked items
number_of_qubits = 3
marked_items = ['110']

# Define the number of iterations
number_of_iteration = m.floor((m.pi/4)*m.sqrt(2**number_of_qubits / len(marked_items)))

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
qc.cz(0, 2)
qc.cz(1, 2)

# Apply a barrier for visual separation
qc.barrier()
transpiled_qc = transpile(qc)
transpiled_qc.draw(output='mpl', filename='qiskit/oracle_circuit.png')

# Apply the Diffuser
# for qubit in range(number_of_qubits):
#     qc.h(qubit)
#     qc.x(qubit)
    
# qc.ccz(0, 1, 2)

# for qubit in range(number_of_qubits):
#     qc.x(qubit)
#     qc.h(qubit)

for qubit in range(number_of_qubits):
    qc.h(qubit)
    qc.x(qubit)

qc.ccz(0, 1, 2)

for qubit in range(number_of_qubits):
    qc.x(qubit)
    qc.h(qubit)
    
# Apply a barrier for visual separation
qc.barrier()
transpiled_qc = transpile(qc)
transpiled_qc.draw(output='mpl', filename='qiskit/diffuser_circuit.png')

# Measure all qubits
qc.measure_all()

### Run simulation on Statevector backend
statevector_sim = Aer.StatevectorSimulator()
transpiled_grover_circuit = transpile(qc, statevector_sim)
results = statevector_sim.run(transpiled_grover_circuit).result()
counts = results.get_counts()
plot_histogram(counts).savefig('qiskit/histogram.png')
# result = StatevectorSimulator().run(qc).result()
# statevector = result.get_statevector().data

# print("\nStatevector of the circuit is:",statevector)
# plot_state_city(statevector).savefig('statevector.png')

# TODO 
# 1. Create a circuit for 110, 101
# 2. Create a circuit for take in marked_states
# 3. Create a general grover simulator
