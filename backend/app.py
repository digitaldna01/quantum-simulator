import os

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from simulator.tn_simulator import TensorNetworkCircuit
from simulator.utils import apply_gate_from_json

STATIC_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
)

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path="/")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


@app.route("/simulate", methods=["POST", "OPTIONS"])
def simulate():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
    circuit = data.get("circuit")
    if not isinstance(circuit, list) or not circuit:
        return jsonify({"error": "circuit must be a non-empty list"}), 400

    qc = TensorNetworkCircuit(len(circuit))
    apply_gate_from_json(qc, circuit)
    qc.run()

    return jsonify({
        "statevector": qc.state_to_qubits(),
        "top_states": qc.top_possible_qubit_states(),
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
