import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WeightEntry, Unit } from '../types';
import { formatDate } from '../utils';

interface ProgressChartProps {
  data: WeightEntry[];
  unit: Unit;
  goalWeight: number | null;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded shadow-lg">
                <p className="label font-semibold text-slate-800 dark:text-slate-200">{formatDate(label)}</p>
                <p className="intro text-violet-600 dark:text-violet-400">{`Weight: ${payload[0].value.toFixed(1)} ${unit}`}</p>
                 {payload[0].payload.notes && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{`Notes: ${payload[0].payload.notes}`}</p>}
            </div>
        );
    }

    return null;
};


const ProgressChart: React.FC<ProgressChartProps> = ({ data, unit, goalWeight }) => {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-72 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">Not enough data to display a chart. Log at least two entries.</p>
      </div>
    );
  }

  const chartData = data
    .map(entry => ({
      ...entry,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5, right: 20, left: -10, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => formatDate(tick)}
            tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }}
            stroke="rgb(156 163 175)"
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            allowDataOverflow={true}
            tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }}
            stroke="rgb(156 163 175)"
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>
          <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, stroke: '#8b5cf6', fill: '#fff', strokeWidth: 2 }} name={`Weight (${unit})`} />
          {goalWeight && (
            <ReferenceLine y={goalWeight} label={{ value: "Goal", position: "insideTopRight", fill: '#16a34a', fontSize: 12 }} stroke="#16a34a" strokeDasharray="5 5" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
