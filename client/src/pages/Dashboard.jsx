import React, { useEffect, useState } from "react";
import axios from "axios";
import LogForm from "../components/LogForm";
import Recommendation from "../components/Recommendation";
import Papa from 'papaparse';

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
// csv raw file URLs
const STATS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_measurements.csv';
const PROGRAMS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_programs.csv';
const LOCATIONS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_facilities.csv';

// CSV 텍스트를 파싱하는 헬퍼 함수
const parseCsv = (csvText) => {
    const { data } = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    });
    return Array.isArray(data) ? data : [];
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [avgData, setAvgData] = useState([]);
    const [myRecord, setMyRecord] = useState(null);

    // 💡 [추가] 나머지 2개의 데이터를 저장할 상태
    const [programsData, setProgramsData] = useState([]);
    const [locationsData, setLocationsData] = useState([]);

    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                // ----------------------------------------------------
                // 💡 [수정] 3개의 URL과 사용자 로그 API를 동시에 호출합니다.
                // ----------------------------------------------------
                const [statsRes, programsRes, locationsRes, logsRes] = await Promise.all([
                    // 3개의 CSV Raw Link 호출
                    axios.get(STATS_RAW_URL),
                    axios.get(PROGRAMS_RAW_URL),
                    axios.get(LOCATIONS_RAW_URL),
                    // 사용자 로그 API 호출
                    axios.get("/api/logs/physical")
                ]);
                // ----------------------------------------------------

                if (!mounted) return;

                // ----------------------------------------------------
                // 💡 [수정] 3개의 CSV 파일을 파싱하고 상태에 저장합니다.
                // ----------------------------------------------------
                const fullStats = parseCsv(statsRes.data);
                const programs = parseCsv(programsRes.data);
                const locations = parseCsv(locationsRes.data);

                setProgramsData(programs);      // 프로그램 데이터 저장
                setLocationsData(locations);    // 위치 데이터 저장
                // ----------------------------------------------------

                // 필터: 20대, 남자
                const filtered = fullStats.filter(
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
            <Recommendation userStats={myRecord} averageStats={avgData} programs={programsData} locations={locationsData} />
        </div>
    );
}