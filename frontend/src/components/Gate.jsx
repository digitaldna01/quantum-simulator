import React from "react";
import { useDrag } from "react-dnd"; //react-dnd의 훅, 이 요소를 드래그 가능한 컴포넌트로 등록
import "./Gate.css";
import "../App.css";


const Gate = ({ type, label }) => {

  const multiGates = {
    CZ : ['C', 'Z'],
    MX : ['M', 'X'],
    CCZ : ['C', 'C', 'Z'],
    MCX : ['M', 'C', 'X'],
  }

  const isMultiGates = Object.keys(multiGates).includes(type);

  const [{ isDragging }, dragRef] = useDrag({
    type: "GATE", // 나증에 drag영역에서 이 타입을 받아들이게 함
    item: { type }, // drag시 전달되는 payload
    collect: (monitor) => ({
      // 드래그 상태 추적용 -> isDragging값으로 스타일 조절
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef} // setting the ref to the dragRef
      className={`all-gate text-black text-center cursor-pointer  ${ isDragging ? "opacity-30" : "hover:brightness-110"  }`} // Change opacity when dragging
    >
      {isMultiGates ? (
        <div className="multi-gate-stack">
            {multiGates[type].map((label, idx) => (
                <React.Fragment key={idx}>
                    <div className="circle rounded-full">{label}</div>
                    { idx < multiGates[type].length - 1 && (
                        <div className="connector" />
                    )}
                </React.Fragment>
            ))}
        </div>
      ): (
        <div className={`${
            type === 'H' ? 'hadamard' : 'single-gate rounded-full'
        } flex items-center justify-center`}>
            {label}
        </div>
      )}
      </div>
  );
};

export default Gate;
