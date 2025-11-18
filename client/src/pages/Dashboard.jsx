import React, { useEffect, useState } from "react";
import axios from "axios";
import LogForm from "../components/LogForm";
import Recommendation from "../components/Recommendation";

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

const METRICS = ["악력", "윗몸일으키기", "유연성", "BMI", "체지방률"];

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [avgData, setAvgData] = useState([]);
    const [myRecord, setMyRecord] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const [statsRes, logsRes] = await Promise.all([axios.get("/api/stats"), axios.get("/api/logs/physical")]);
                if (!mounted) return;

                const stats = Array.isArray(statsRes.data) ? statsRes.data : [];
                // 필터: 20대, 남자
                const filtered = stats.filter(
                    (d) =>
                        String(d.ageGroup).trim() === "20대" &&
                        ["M", "m", "남", "남자", "Male"].includes(String(d.gender).trim())
                );

                const meanMap = {};
                for (const s of filtered) {
                    const key = String(s.metric).trim();
                    meanMap[key] = Number(String(s.mean).replace(/,/g, "")) || 0;
                }

                // build avg array in desired order
                const avgArr = METRICS.map((m) => ({ metric: m, average: meanMap[m] != null ? meanMap[m] : null }));
                setAvgData(avgArr);

                const logs = Array.isArray(logsRes.data) ? logsRes.data : [];
                const latest = logs.length ? logs[0] : null;
                if (latest && latest.metrics) {
                    setMyRecord(latest.metrics);
                } else {
                    setMyRecord(null);
                }
            } catch (e) {
                console.error(e);
                setError("데이터 로드 실패");
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) return <div>데이터 불러오는 중...</div>;
    if (error) return <div>{error}</div>;

    // merge for chart: create data array with average and mine
    const chartData = avgData.map((a) => {
        const mineVal = myRecord && myRecord[a.metric] != null ? myRecord[a.metric] : null;
        return {
            metric: a.metric,
            average: a.average != null ? Number(a.average) : null,
            mine: mineVal != null ? Number(mineVal) : null,
        };
    });

    return (
        <div style={{ padding: 16 }}>
            <LogForm />
            <div style={{ width: "100%", height: 420 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" interval={0} angle={-20} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" name="Average" fill="#1976d2" barSize={40}>
                            <LabelList dataKey="average" position="top" formatter={(v) => (v != null ? v : "")} />
                        </Bar>
                        <Bar dataKey="mine" name="My Record" fill="#ff8a65" barSize={40}>
                            <LabelList dataKey="mine" position="top" formatter={(v) => (v != null ? v : "")} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recommendation: userStats = myRecord, averageStats = avgData */}
            <Recommendation userStats={myRecord} averageStats={avgData} />
        </div>
    );
}