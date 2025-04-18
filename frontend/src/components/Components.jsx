import React, { useState } from "react";
import axios from "axios";
import "./Components.css";
import Gate from "./Gate";
import "../App.css";

export default function Components() {
  return (
    <>
      {/* The Width of the circuit is 2/3 initially  */}
      <div className="w-1/3  h-full p-4"> {/* h-full*/}
        <div className="title">OPERATION GATES</div>
        <div className="flex flex-col gap-4 p-4 w-full h-full max-w-md"> {/* h-full*/}
        {/* Single Gates */}
          <div className="flex gap-4 border-b p-2">
            <Gate type="H" label="H" />
            <Gate type="S" label="S" />
            <Gate type="T" label="T" />
            <Gate type="X" label="X" />
            <Gate type="Y" label="Y" />
            <Gate type="Z" label="Z" />
          </div>
          <div className="flex h-full justify-between "> {/* h-full*/}
            {/* Left 2 gates */}
            <div className="w-1/2 flex gap-4 border-r pl-2">
              <Gate type="CZ" label="CZ" />
              <Gate type="MX" label="MX" />
            </div>
            {/* Right 3 gates */}
            <div className="w-1/2 flex gap-4 pl-2">
              <Gate type="CCZ" label="CCZ" />
              <Gate type="MCX" label="MCX" />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="col-span-1 flex flex-col border rounded p-4">
          operators
        </div> */}
    </>
  );
}
