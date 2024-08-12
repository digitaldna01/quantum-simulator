from qiskit import QuantumCircuit, Aer, execute



# Create a Quantum Circuit with three qubits
qc = QuantumCircuit(3)

# Apply H-gate to each qubit:
for qubit in range(3):
    qc.h(qubit)
    
# Apply a barrier for visual separation
qc.barrier()


# Apply the Oracle
qc.cz(0, 2)
qc.cz(1, 2)
