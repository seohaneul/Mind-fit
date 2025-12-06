import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
} from "recharts";
import LogForm from '../components/LogForm';

export default function RecordPage({ avgData, userRecord, setUserRecord }) {
    // Prepare chart data
    const chartData = avgData.map((a) => {
        const mineVal = userRecord && userRecord[a.metric] != null ? userRecord[a.metric] : null;
        return {
            metric: a.metric,
            average: a.average != null ? Number(a.average) : null,
            mine: mineVal != null ? Number(mineVal) : null,
        };
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 leading-snug">
                        홍길동님의 과거 측정 기록 <br />
                        <span className="text-gray-500">및 마인드 변화를 확인하세요.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-800">대한민국 20대 남성 표준 대비 나의 위치</h2>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="metric"
                                        tick={{ fontSize: 11 }}
                                        stroke="#9ca3af"
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Bar dataKey="average" name="표준(AVG)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20}>
                                        <LabelList dataKey="average" position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={(v) => v || ''} />
                                    </Bar>
                                    <Bar dataKey="mine" name="나(ME)" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20}>
                                        <LabelList dataKey="mine" position="top" style={{ fontSize: '10px', fill: '#6b7280' }} formatter={(v) => v || ''} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Log Form Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-800">실제 측정 기록 입력</h2>
                            <p className="text-xs text-gray-400">국민체력100 기준 측정값을 입력하세요</p>
                        </div>
                        <LogForm onLogSubmit={(values) => setUserRecord(prev => ({ ...prev, ...values }))} />
                    </div>
                </div>
            </div>
        </div>
    );
}
