import "../App.css";
import Chart from "./Chart";
import { useEffect, useState } from "react";
import { parseTopStates } from "../utils/parseTopStates";

const Probability = ({ top_states, numQubits }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (top_states && numQubits) {
      const data = parseTopStates(top_states, numQubits);
      console.log("✅ Parsed Chart Data:", data);
      setChartData(data);
    }
  }, [top_states, numQubits]);

  return (
    <>
      <div className="col-span-2 border rounded-lg title">
        <div className="title p-4">PROBABILITY</div>
        <div className="p-4">
          <Chart data={chartData} />
        </div>
      </div>
    </>
  );
};
export default Probability;
