# Simulating a Statevector Quantum Circuit
A statevector is a common method for representing qubit states in quantum computing. Each possible state is ordered from `|0...0⟩` to `|1...1⟩` in ascending order. For instance, with three qubits, the possible states are `|000⟩, |001⟩, |010⟩, |011⟩, |100⟩, |101⟩, |110⟩, and |111⟩`. Each of these states represents a unique combination of the three qubits in binary form, creating a complete basis for the three-qubit system. In statevector notation, every state is expressed as a vector in a \(2^n\)-dimensional complex vector space, where \(n\) is the number of qubits. For example, the state `|000⟩` is represented as a column vector with a 1 in the first position and 0s in all others, while `|111⟩` has a 1 in the last position. This notation provides a precise mathematical framework for representing quantum states and allows for easy manipulation of concepts like superposition and entanglement.

This framework provides tools for simulating quantum circuits using statevector representations. It includes implementations of basic quantum gates, such as Pauli matrices (X, Y, Z), the Hadamard gate (H), S and T gates, as well as controlled gates like CNOT, Toffoli, and multi-controlled versions.

## Usage

### 1. Creating a Quantum Circuit
To initialize a quantum circuit with a given number of qubits:

```python
from statevector_circuit import StatevectorCircuit

# Create a quantum circuit with 3 qubits
statevector = StatevectorCircuit(3)
```
### 2. Applying Quantum Gates
You can apply various quantum gates to specific qubits in the circuit:
* Single Qubit Gates:
    ```python
    # Apply Pauli-X (NOT) gate to qubit 0
    circuit.x(0)

    # Apply Pauli-Y gate to qubit 1
    circuit.y(1)

    # Apply Pauli-Z gate to qubit 2
    circuit.z(2)

    # Apply Hadamard gate to qubit 0
    circuit.h(0)

    # Apply S and T gates
    circuit.s(1)
    circuit.t(2)
    ```
* Controlled Gates:
    ```python
    # Apply CNOT gate with control qubit 0 and target qubit 1
    circuit.cx(0, 1)

    # Apply CZ gate with control qubit 1 and target qubit 2
    circuit.cz(1, 2)

    # Apply Toffoli (CCX) gate with control qubits [0, 1] and target qubit 2
    circuit.ccx([0, 1], 2)

    # Apply a multi-controlled X gate (MCX) with control qubits [0, 1] and target qubit 2
    circuit.mcx([0, 1], 2)
    ```
### 3. Converting Statevector to Qubit States
* Get the Most Probable Qubit States:
    ```python
    # Returns the most probable qubit states in the form of |000>, |001>, etc.
    probable_states = circuit.top_possible_qubit_states()
    print(probable_states)
    ```
* Convert the Statevector to a Readable Format:
    ```python
    # Convert the statevector to a readable format
    readable_statevector = circuit.statevector_to_qubits()
    print(readable_statevector)
    ```

## API Reference
### Classes and Methods
StatevectorCircuit Class
* `__init__(self, num_qubits)`: Initializes a quantum circuit with a specified number of qubits.

* `top_possible_qubit_states(self)`: Returns the most probable qubit states based on the current statevector.

* `statevector_to_qubits(self)`: Converts the statevector to a human-readable string format.

* `x(self, apply_qubit)`: Applies the Pauli-X gate to a specified qubit.

* `y(self, apply_qubit)`: Applies the Pauli-Y gate to a specified qubit.

* `z(self, apply_qubit)`: Applies the Pauli-Z gate to a specified qubit.

* `h(self, apply_qubit)`: Applies the Hadamard gate to a specified qubit.

* `s(self, apply_qubit)`: Applies the S gate to a specified qubit.

* `t(self, apply_qubit)`: Applies the T gate to a specified qubit.

* `cx(self, control_qubit, target_qubit)`: Applies the CNOT gate with a control and target qubit.

* `cz(self, control_qubit, target_qubit)`: Applies the controlled-Z gate.

* `ccx(self, control_qubits, target_qubit)`: Applies the Toffoli (CCX) gate.

* `ccz(self, control_qubits, target_qubit)`: Applies the controlled-controlled-Z gate.

* `mcx(self, control_qubits, target_qubit)`: Applies a multi-controlled X gate.

* `mcz(self, control_qubits, target_qubit)`: Applies a multi-controlled Z gate.
