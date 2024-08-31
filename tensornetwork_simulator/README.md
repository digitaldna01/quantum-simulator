# Simulating a Tensor Network Quantum Circuit
With this framework, you can simulate quantum circuits with Tensor networks. By leveraging TensorNetwork, it efficiently represents and manipulates quantum states. Using tensor contraction, the framework implements basic quantum gates, controlled gates, and functionality to simulate quantum circuits.

## Usage

### 1. Creating a Quantum Circuit
To initialize a quantum circuit with a given number of qubits:

```python
from tensornetwork_circuit import TensorNetworkCircuit

# Create a quantum circuit with 3 qubits
circuit = TensorNetworkCircuit(3)
```

### 2. Applying Quantum Gates
You can apply various quantum gates to specific qubits in the circuit:
* Single Qubit Gates:
    ```python
    # Apply Pauli-X (NOT) gate to qubit 0
    circuit.x([0])

    # Apply Pauli-Y gate to qubit 1
    circuit.y([1])

    # Apply Pauli-Z gate to qubit 2
    circuit.z([2])

    # Apply Hadamard gate to qubit 0
    circuit.h([0])

    # Apply S and T gates
    circuit.s([1])
    circuit.t([2])
    ```
* Controlled Gates:
    ```python
    # Apply CNOT gate with control qubit 0 and target qubit 1
    circuit.cx([0], 1)

    # Apply CZ gate with control qubit 1 and target qubit 2
    circuit.cz([1], 2)

    # Apply Toffoli (CCX) gate with control qubits [0, 1] and target qubit 2
    circuit.ccx([0, 1], 2)

    # Apply a multi-controlled X gate (MCX) with control qubits [0, 1] and target qubit 2
    circuit.mcx([0, 1], 2)
    ```

### 3. Simulating the Circuit
* Run the Simulation:
    ```python
    # Run the quantum circuit simulation
    circuit.run()
    ```
#### 4. Converting State to Qubit States
* Convert the State to a Readable Format:
    ```python
    # Convert the state to a readable format
    readable_state = circuit.state_to_qubits()
    print(readable_state)
    ```
* Get the Most Probable Qubit States:
    ```python
    # Returns the most probable qubit states in the form of |000>, |001>, etc.
    probable_states = circuit.top_possible_qubit_states()
    print(probable_states)
    ```

## API **Reference
### Classes and Methods
TensorNetworkCircuit Class
* `__init__(self, num_qubits)`: Initializes a quantum circuit with a specified number of qubits.

* `apply_gate(self, gate, apply_qubit)`: Applies a single quantum gate to the specified qubits.

* `x(self, apply_qubit)`: Applies the Pauli-X gate to the specified qubit(s).

* `y(self, apply_qubit)`: Applies the Pauli-Y gate to the specified qubit(s).

* `z(self, apply_qubit)`: Applies the Pauli-Z gate to the specified qubit(s).

* `h(self, apply_qubit)`: Applies the Hadamard gate to the specified qubit(s).

* `s(self, apply_qubit)`: Applies the S gate to the specified qubit(s).

* `t(self, apply_qubit)`: Applies the T gate to the specified qubit(s).

* `cx(self, control_qubit, target_qubit)`: Applies the CNOT gate with the specified control and target qubits.

* `cz(self, control_qubit, target_qubit)`: Applies the controlled-Z gate.
  
* `ccx(self, control_qubits, target_qubit)`: Applies the Toffoli (CCX) gate.
  
* `ccz(self, control_qubits, target_qubit)`: Applies the controlled-controlled-Z gate.
  
* `mcx(self, control_qubits, target_qubit)`: Applies a multi-controlled X gate.
  
* `mcz(self, control_qubits, target_qubit)`: Applies a multi-controlled Z gate.
  
* `run(self)`: Executes the tensor network contraction to simulate the quantum circuit.
  
* `state_to_qubits(self)`: Converts the current state to a human-readable format showing the probability amplitudes.
  
* `top_possible_qubit_states(self)`: Returns the most probable qubit states based on the current state.
