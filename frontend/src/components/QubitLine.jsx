import { useDrop } from "react-dnd";
import Gate from "./Gate";
import "./QubitLine.css";
import "../App.css";

const QubitLine = ({ qubitId, gates, onDropGate }) => {
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
      <span className="text-white w-[60px] label">Q[{qubitId}]</span>
      <div
        ref={dropRef}
        className={`relative flex flex-row gap-4 grow min-h-[48px] py-4 transition-all ${
          isOver ? "bg-blue-900/20" : ""
        }`}
      >
        {/* 회로선 (가로줄) */}
        <div className="absolute top-1/2 left-0 w-full border-color-black4 border-t z-0"></div>

        {gates.map((gate, idx) => (
          <div className="gap-4 z-10">
            <Gate key={idx} type={gate.type} label={gate.type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QubitLine;
