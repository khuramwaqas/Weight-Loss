import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeightEntry, Unit } from '../types';

interface ComparisonChartProps {
  data: WeightEntry[];
  unit: Unit;
}

const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return { year: d.getUTCFullYear(), week: weekNo };
}


const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, unit }) => {
    if (data.length < 2) {
        return (
          <div className="flex items-center justify-center h-72 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">Not enough data to display a chart. Log at least two entries.</p>
          </div>
        );
    }
    
    const weeklyData: { [key: string]: { totalWeight: number, count: number, year: number, week: number } } = {};

    data.forEach(entry => {
        const date = new Date(entry.date + 'T00:00:00');
        const { year, week } = getWeekNumber(date);
        const key = `${year}-W${week.toString().padStart(2, '0')}`;
        if (!weeklyData[key]) {
            weeklyData[key] = { totalWeight: 0, count: 0, year, week };
        }
        weeklyData[key].totalWeight += entry.weight;
        weeklyData[key].count += 1;
    });

    const chartData = Object.keys(weeklyData).map(key => {
        const avgWeight = weeklyData[key].totalWeight / weeklyData[key].count;
        return {
            name: key,
            avgWeight: parseFloat(avgWeight.toFixed(1)),
            year: weeklyData[key].year,
            week: weeklyData[key].week,
        };
    })
    .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.week - b.week;
    })
    .slice(-8);

    if (chartData.length < 2) {
        return (
            <div className="flex items-center justify-center h-72 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-slate-500 dark:text-slate-400">Log entries for at least two different weeks to see a comparison.</p>
            </div>
        );
    }
    
    const renderTooltip = (props: any) => {
        const { active, payload, label } = props;
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded shadow-lg">
                    <p className="label font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                    <p className="intro text-violet-600 dark:text-violet-400">{`Avg Weight: ${payload[0].value.toFixed(1)} ${unit}`}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="w-full h-72">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis 
                        dataKey="name"
                        tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }}
                        stroke="rgb(156 163 175)"
                    />
                    <YAxis 
                        domain={['dataMin - 2', 'dataMax + 2']}
                        allowDataOverflow={true}
                        tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }}
                        stroke="rgb(156 163 175)"
                    />
                    <Tooltip
                        cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                        content={renderTooltip}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="avgWeight" fill="#8b5cf6" name={`Avg Weight (${unit})`} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ComparisonChart;
