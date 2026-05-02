'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ProgressRing({ percentage, label, color = '#8b5cf6' }) {
  const data = [
    { name: 'completed', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={50}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold">{percentage}%</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}
