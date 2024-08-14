import sys, os
import timeit
import numpy as np
import random
import qiskit_aer as Aer
from qiskit import transpile
import logging
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'qiskit_simulator'))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'statevector_simulator'))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tensornetwork_simulator'))

# import the grover cirquit from the qiskit simulators
from qiskit_simulator.qiskit_grover import grover_circuit as qiskit_grover_cirquit
from qiskit_simulator.qiskit_grover import get_result as qiskit_get_result

# import the grover cirquit from the  statevector simulators
from statevector_simulator.statevector_grover import grover_cirquit as sv_grover_cirquit
from statevector_simulator.statevector_circuit import StatevectorCircuit

# import the grover cirquit from the  tensornetwork simulators
from tensornetwork_simulator.tensornetwork_grover import grover_cirquit as tn_grover_cirquit
from tensornetwork_simulator.tensornetwork_circuit import TensorNetworkCircuit



# random marked states generator 
def random_marked_states(num_qubits, num_marked_states):
    marked_states = []
    for _ in range(num_marked_states):
        # Generate a random state of num_qubits length and append it as a string
        state = ''.join(str(random.randint(0, 1)) for _ in range(num_qubits))
        marked_states.append(state)
    return marked_states

def 
# TESTING

# Define the number of qubits
number_of_qubits = 10

# Define the marked state
marked_states = random_marked_states(number_of_qubits, 2)

# Qiskit Simulator Execution
start_time = timeit.default_timer()
# Create the grover cirquit and run
qiskit_circuit = qiskit_grover_cirquit(number_of_qubits, marked_states)
qiskit_statevector = Aer.StatevectorSimulator().run(qiskit_circuit).result()
# Transpile the circuit for the given simulator
# transpiled_qiskit_circuit = transpile(qiskit_circuit, aer_sim)
# results = aer_sim.run(transpiled_qiskit_circuit).result()
end_time = timeit.default_timer()
qiskit_execution_time = end_time - start_time


# Statevector Simulator Execution
start_time = timeit.default_timer()
sv_simulator = sv_grover_cirquit(number_of_qubits, marked_states)
end_time = timeit.default_timer()
sv_execution_time = end_time - start_time

# Tensor Network Simulator Execution
start_time = timeit.default_timer()
tn_simulator = tn_grover_cirquit(number_of_qubits, marked_states)
tn_simulator.run()
end_time = timeit.default_timer()
tn_execution_time = end_time - start_time

# Check the circuit correctness
print("Marked states: ", marked_states, "\n")
print("Qiskit found result : ", qiskit_get_result(qiskit_statevector, number_of_qubits, marked_states))   
print("State Vector found result : ", sv_simulator.top_possible_qubit_states(),)   
print("Tensor Network found result : ", tn_simulator.top_possible_qubit_states())
print("\n")
# Check the execution time
print("Qiskit Execution time:", qiskit_execution_time, "seconds")
print("State Vector Execution time:", sv_execution_time, "seconds")
print("Tensor Network Execution time:", tn_execution_time, "seconds")
print("\n")