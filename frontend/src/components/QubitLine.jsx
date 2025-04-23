import { useDrop } from "react-dnd";
import Gate from "./Gate";
import "./QubitLine.css";
import "../App.css";
import { useState } from "react";

const QubitLine = ({ qubitId, gates, onDropGate, onRemoveQubit, onRemoveGate }) => {
  const [showModal, setShowModal] = useState(false);

  const [{ isOver }, dropRef] = useDrop({
    accept: "GATE",
    drop: (item) => {
      onDropGate(qubitId, item),
        console.log("Dropped Gate:", item.type, "on Qubit:", qubitId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="flex items-center p-4">
      <span
        className="text-white w-[60px] label cursor-pointer hover:text-orange-500 transition"
        onClick={() => {
          if (qubitId !== 0) setShowModal(true);
        }}
      >
        Q[{qubitId}]
      </span>
      <div
        ref={dropRef}
        className={`relative flex flex-row gap-6 grow min-h-[48px] py-4 transition-all ${
          isOver ? "bg-blue-900/20" : ""
        }`}
      >
        {/* 회로선 (가로줄) */}
        <div className="absolute top-1/2 left-0 w-full border-color-black4 border-t z-0"></div>

        {gates.map((gate, idx) => (
          <div key={idx}>
            {/* Gate Line (세로줄) */}
            <Gate
              type={gate.type}
              label={gate.type}
              onCircuit={true}
              onRemove={() => onRemoveGate(qubitId, idx)}
            />
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 shadow-lg text-white max-w-sm w-full">
            <div className="text-lg mb-4">Delete Q[{qubitId}]?</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                CANCEL
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
                onClick={() => {
                  setShowModal(false);
                  onRemoveQubit(qubitId);
                }}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QubitLine;
