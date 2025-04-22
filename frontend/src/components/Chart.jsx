import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Chart = ({ data }) => {
  return (
    <>
      <div className="w-full h-48 border">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#444" /> */}
            <XAxis
              dataKey="state"
              interval={0}
              stroke="#ccc"
              label={{
                value: "BASIS STATES",
                position: "insideBottom",
                offset: -5,
                fill: "#ccc",
              }}
            />
            <YAxis
              stroke="#ccc"
              domain={[0, 1]}
              label={{
                value: "PROBABILITY",
                angle: -90,
                position: "insideLeft",
                fill: "#ccc",
              }}
            />
            {/* <Tooltip /> */}
            <Tooltip
              formatter={(value, name, props) => {
                return [`${(value * 100).toFixed(1)}%`, props.payload.state];
              }}
            //   formatter={(value) => `${(value * 100).toFixed(1)}%`}
              labelStyle={{ color: "#fff" }}
              labelFormatter={(label) => `Qubit: ${label}`}
              cursor={{ fill: "#444", opacity: 0.1 }}
            />
            <Bar
              dataKey="probability"
              barSize={20}
              fill="#ff5722"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Chart;
