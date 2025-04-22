from flask import Flask, request, jsonify
from flask_cors import CORS
from simulator.tn_simulator import TensorNetworkCircuit
from simulator.utils import apply_gate_from_json

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route('/simulate', methods=['POST', 'OPTIONS'])
def simulate():
    if request.method == 'OPTIONS':
        return '', 204  # Preflight response
    
    data = request.get_json()
    circuit = data.get("circuit")
    print("Circuit received:", circuit)
    num_qubits = len(circuit)
    
    qc = TensorNetworkCircuit(num_qubits)
    apply_gate_from_json(qc, circuit)
    qc.run()
    # print("Result is " , qc.result.tensor.flatten())
    print("Statevector is " , qc.state_to_qubits())
    print("Top states are " , qc.top_possible_qubit_states())
    return jsonify({
        "statevector" : qc.state_to_qubits(),
        "top_states" : qc.top_possible_qubit_states()
    })

if __name__ == '__main__':
    app.run(port=5050, debug=True)