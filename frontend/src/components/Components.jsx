import React, { useState } from "react";
import axios from "axios";
import "./Components.css";
import Gate from "./Gate";
import "../App.css";

export default function Components() {
  return (
    <>
      {/* The Width of the circuit is 2/3 initially  */}
      <div className="w-1/3  h-full p-4" id="dashboard-components">
        {" "}
        {/* h-full*/}
        <div className="title">OPERATION GATES</div>
        <div className="flex flex-col gap-4 p-4 w-full h-full max-w-md">
          {" "}
          {/* h-full*/}
          {/* Single Gates */}
          <div className=" relative z-50 flex gap-4 border-b p-2">
            <Gate type="H" label="H" />
            <Gate type="S" label="S" />
            <Gate type="T" label="T" />
            <Gate type="X" label="X" />
            <Gate type="Y" label="Y" />
            <Gate type="Z" label="Z" />
          </div>
          <div className="flex h-full justify-between ">
            {" "}
            {/* h-full*/}
            {/* Left 2 gates */}
            <div className="relative w-1/3 flex gap-4 border-r pl-2">
              <Gate type="CX" label="CX" />
              <Gate type="CZ" label="CZ" />
            </div>
            {/* Right 3 gates */}
            <div className="w-2/3 flex gap-4 pl-2">
              <Gate type="CCX" label="CCX" />
              <Gate type="CCZ" label="CCZ" />
              <Gate type="MCX" label="MCX" />
              <Gate type="MCZ" label="MCZ" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

