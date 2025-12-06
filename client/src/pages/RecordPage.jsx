import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

export default function RecordPage({ userId, onLogin, avgData, userRecord, setUserRecord }) {
    const [loginName, setLoginName] = useState("");
    const [history, setHistory] = useState([]);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Fetch History when userId changes
    useEffect(() => {
        if (userId) {
            axios.get("/api/logs/physical", {
                headers: { "x-user-id": userId }
            })
                .then(res => setHistory(res.data))
                .catch(e => console.error("History fetch error", e));
        }
    }, [userId]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginName.trim()) return alert("이름을 입력해주세요.");
        setIsLoggingIn(true);
        await onLogin(loginName);
        setIsLoggingIn(false);
    };

    const handleRecordSubmit = async (values) => {
        // Update local state for chart
        setUserRecord(prev => ({ ...prev, ...values }));

        // Save to backend
        if (userId) {
            try {
                await axios.post("/api/logs/physical", { metrics: values }, {
                    headers: { "x-user-id": userId }
                });
                // Refresh history
                const res = await axios.get("/api/logs/physical", {
                    headers: { "x-user-id": userId }
                });
                setHistory(res.data);
                alert("기록이 저장되었습니다.");
            } catch (e) {
                console.error("Save error", e);
                const msg = e.response?.data?.error || e.message;
                alert("저장 중 오류가 발생했습니다: " + msg);
            }
        }
    };

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
                    <p className="text-gray-500 mb-6">기록 기능을 사용하려면 먼저 로그인해주세요.</p>

                    <form onSubmit={handleLoginSubmit}>
                        <input
                            type="text"
                            placeholder="이름 (또는 닉네임) 입력"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled={isLoggingIn}
                        />
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className={`w-full py-3 text-white font-bold rounded-lg transition ${isLoggingIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoggingIn ? "로그인 중..." : "로그인하고 시작하기"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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
            <div className="max-w-6xl mx-auto px-4 pt-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 leading-snug">
                        나의 과거 측정 기록 <br />
                        <span className="text-gray-500">변화 추이를 확인하세요.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Chart & Input */}
                    <div className="space-y-6">
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
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} />
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
                                <h2 className="text-lg font-bold text-gray-800">새로운 기록 입력</h2>
                                <p className="text-xs text-gray-400">국민체력100 수치를 입력하고 저장하세요.</p>
                            </div>
                            <LogForm onLogSubmit={handleRecordSubmit} />
                        </div>
                    </div>

                    {/* Right Column: History Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">측정 기록 히스토리</h2>
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">날짜</th>
                                        <th className="px-2 py-3">악력</th>
                                        <th className="px-2 py-3">윗몸</th>
                                        <th className="px-2 py-3">유연성</th>
                                        <th className="px-2 py-3 rounded-r-lg">BMI</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                                                아직 기록이 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((h) => (
                                            <tr key={h._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {new Date(h.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-2 py-3">{h.metrics?.악력 || "-"}</td>
                                                <td className="px-2 py-3">{h.metrics?.윗몸일으키기 || "-"}</td>
                                                <td className="px-2 py-3">{h.metrics?.유연성 || "-"}</td>
                                                <td className="px-2 py-3">{h.metrics?.BMI || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
