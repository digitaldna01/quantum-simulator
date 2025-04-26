from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from simulator.tn_simulator import TensorNetworkCircuit
from simulator.utils import apply_gate_from_json


app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# @app.route("/")
# def serve_react():
#     return send_from_directory(app.static_folder, "index.html")

# 👉 assets와 JS 경로를 위한 fallback
# @app.route('/<path:path>')
# def static_proxy(path):
#     file_path = os.path.join(frontend_dir, path)
#     if os.path.exists(file_path):
#         return send_from_directory(frontend_dir, path)
#     else:
#         return send_from_directory(frontend_dir, 'index.html')

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