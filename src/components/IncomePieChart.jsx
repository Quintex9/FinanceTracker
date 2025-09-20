import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function IncomePieChart({ data, getCategoryColor }) {
  return (
    <div className="card shadow-lg border-0 mt-5"
      style={{ borderRadius: "20px", background: "#1e1e2f" }}>
      <div className="card-body">
        <h4 className="text-center text-light mb-4">Príjmy podľa kategórií</h4>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={(e) => `${e.name}: ${e.value}€`}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={getCategoryColor(entry.name)} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              formatter={(v, n) => [`${v} €`, n]}
              contentStyle={{ background: "#2a2a3d", border: "none", color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
