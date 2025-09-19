import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function BalanceLineChart({ balanceData }) {
  return (
    <div className="card shadow-lg border-0"
      style={{ borderRadius: "20px", background: "#1e1e2f" }}>
      <div className="card-body">
        <h4 className="text-center text-light mb-4">📊 Prehľad zostatku</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
            <YAxis tick={{ fill: "#aaa" }} />
            <Tooltip
              formatter={(v) => `${v} €`}
              contentStyle={{ background: "#2a2a3d", border: "none" }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#00d4ff"
              strokeWidth={3}
              dot={{ r: 5, fill: "#00d4ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
