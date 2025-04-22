import "../App.css";
import "./Output.css";
import { useState } from "react";



const  Output = ({statevector}) => {
  return <>
    <div className="col-span-1 p-4 border rounded-lg">
        <div className="title">Output</div>
        <div className="result h-5/6">
            <div className="result-text">{statevector}</div>
        </div>
    </div>
  </>;
}

export default Output;
