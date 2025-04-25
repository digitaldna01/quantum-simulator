from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.dirname(__file__)) 

from simulator.tn_simulator import TensorNetworkCircuit
from simulator.utils import apply_gate_from_json

current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_build_path = os.path.join(current_dir, "../frontend/dist")

app = Flask(__name__, static_folder=frontend_build_path, static_url_path="/")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

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


@app.errorhandler(404)
def not_found(e):
    # React SPA에서 라우팅되도록 index.html로 fallback
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(port=5050, debug=True)