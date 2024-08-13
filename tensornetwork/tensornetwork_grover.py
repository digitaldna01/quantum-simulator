import tensornetwork as tn
from tensornetwork_circuit import *
import numpy as np


# Define the number of qubits
number_of_qubits = 3

# Define the marked state
marked_states = ['101', '110']

tn_cirucit = TensorNetworkCircuit(number_of_qubits)
# print("number of qubits : ", tn_cirucit.num_qubits, "\n")
# print("`state_nodes : ", tn_cirucit.state_nodes, "\n")
# print("circuit qubits : ", tn_cirucit.qubits, "\n")

tn_cirucit.h([1])
tn_cirucit.run()
result = tn_cirucit.result

print("state : ")
print(tn_cirucit.state_to_qubits(), "\n")
