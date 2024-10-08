# Quantum Simulator 

## Goal 
The purpose of this project is to create a quantum simulator using Google's Tensor Network framework. 

Google's tensor network represents complex, high-dimensional tensors as a network of smaller tensors. It can be expanded or contracted using edge contraction and edge splitting. Edge contraction in a tensor network can significantly increase computational speed by avoiding a large number of operations when performing extensive computations.

### Quantum Simulator
The unique feature of a tensor network is that it can represent quantum simulator circuits directly. For example, when applying Hadamard, X, or Y gates to the first qubit, the gate nodes will have input and output legs. The input leg is connected to the qubit where you want to apply the gate, and the leg coming out after the gate represents the result after the qubit has been computed.

![Alt text](/img/Tensornetwork.png "Tensor Network")

To implement a Tensor Network Quantum Simulator, it's worthwhile to be familiar with the Qiskit circuit simulator and the fundamental concepts of a state vector quantum simulator. In addition to the Tensor Network Quantum Simulator, I also implemented the Grover algorithm using Qiskit and the State Vector simulator. For the State Vector simulator, I utilized basic NumPy functions to compute the Kronecker product and inner product of state vectors.

## Qiskit Simulator(qiskit_simulator/README.md)
In order to understand how qiskit Simulator works, I implement the Grover Algorithm with qiskit framework by IBM. Follow the Qiskit README to further

[Link to Qiskit Simulator README](qiskit_simulator/README.md)

## State Vector Simulator

[Link to Statevector Simulator README](statevector_simulator/README.md)

## Tensor Network Simulator
[Link to Tensor Network README](tensornetwork_simulator/README.md)
* * * 
## Requirement Packages

### Python Version
    Python 3.12.0 

### Virtual Environment
Creating a virtual environment to install packages in Python app development instead of modifying the system-wide environment will allow you to seperate packages.

#### How to start Python Development with Python Environment
##### 1. Install `python3-venv` or `python3.x-venv`

If you system does not have `venv` library, install it using apt.
>   
    sudo apt install python3-venv

##### 2. Navigate to the project directory where you want to create a virtual environment and install the required packages for the quantum simulator.

##### 3. Run the 'venv' module in your designated directory
Replace 'myenv' with your virtual environment name
>
    python3 -m venv myenv

##### 4. Activate the virtual environment:
* For Mac
>   
    source myenv/bin/activate
  
* For Window
  * For Command Prompt:
    >
        myenv\Scripts\activate
  * For PowerSehll:
    >
        .\myenv\Scripts\Activate

After activation, you should see '(myenv)' at the beginning of your terminal prompt.

##### 5. Deactivate the virtual enviornment, run:
>
    deactivate

### Requirements.txt
The `requirements.txt` file should list all the Python libraries that these code files require, and the libraries will be installed by:
>
    pip install -r requirements.txt
