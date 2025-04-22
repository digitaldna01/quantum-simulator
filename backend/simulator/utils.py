# simulator/utils.py
def apply_gate_from_json(qc, circuit_json):
    for qubit in circuit_json:
        qid = qubit["id"]
        for gate in qubit["gates"]:
            gtype = gate["type"]
            if gtype == "H":
                qc.h([qid])
            elif gtype == "X":
                qc.x([qid])
            elif gtype == "S":
                qc.s([qid])
            elif gtype == "T":
                qc.t([qid])
            elif gtype == "Y":
                qc.y([qid])
            elif gtype == "Z":
                qc.z([qid])
            elif gtype == "CX":
                qc.cx([gate["control"]], gate["target"])
            elif gtype == "CZ":
                qc.cz([gate["control"]], gate["target"])
            elif gtype == "CCZ":
                qc.ccz(gate["controls"], gate["target"])
            elif gtype == "MCX":
                qc.mcx(gate["controls"], gate["target"])