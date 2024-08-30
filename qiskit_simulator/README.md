# Simulating using Qiskit Circuit

## Qiskit 
Qiskit is IBM's open source Quantum Computing software framework. It provides circuit simulator and execute Quantum programs on Cloud Quantum Computer.

## Grover Algorithm
One potential advantage of a quantum computer over a classical computer is its ability to search faster. Imagine a library filled with books, where one page has a big red X. If you wanted to find that specific page, instead of manually searching for it, you could use a computer.

A classical computer would have to search sequentially through each book and then through each page within those books until it found the X. In contrast, a quantum computer could search through all books, or even all pages, simultaneously.

This illustrates how a quantum computer can achieve exponentially faster search speeds than a classical computer.

Grover Algorithm takes a marked state or states (could be multiples) as input. Instead of traversing through an average of N/2 of the states, find the marked items in substantially fewer steps, $\sqrt{N}$. This algorithm consists of three parts Initialization, Oracle, and Diffuser states.

### Initialization State
The initialization State creates the search space, which is all possible cases the answer could take. The search space would be all the items of that list. To initialize the space, apply Hadamard Gate to each qubits to superposition. 

### Oracle
Apply the Oracle reflection to the initialized state S. 

### Diffuser

![Alt text](/img/grover_circuit.png "Grover Circuit")
* * *
### References 
If you want to know more, follow this link from IBM. They explained it so well.

[Link to IBM Grover Algorithm Textbook](https://github.com/Qiskit/textbook/blob/main/notebooks/ch-algorithms/grover.ipynb)
