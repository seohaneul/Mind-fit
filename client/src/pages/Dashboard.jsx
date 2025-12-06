import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LogForm from "../components/LogForm";
import Recommendation from "../components/Recommendation";
import Papa from 'papaparse';
import './Dashboard.css';

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
const STATS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_measurements.csv';
const PROGRAMS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_programs.csv';
const LOCATIONS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_facilities.csv';

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
    const [myMood, setMyMood] = useState(null);
    const [programsData, setProgramsData] = useState([]);
    const [locationsData, setLocationsData] = useState([]);

    const handleLogSubmit = (records, mood) => {
        setMyRecord(records);
        setMyMood(mood);
    };
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const [statsRes, programsRes, locationsRes] = await Promise.all([
                    axios.get(STATS_RAW_URL),
                    axios.get(PROGRAMS_RAW_URL),
                    axios.get(LOCATIONS_RAW_URL),
                ]);

                if (!mounted) return;

                const fullStats = parseCsv(statsRes.data);
                setProgramsData(parseCsv(programsRes.data));
                setLocationsData(parseCsv(locationsRes.data));

                const targetUsers = fullStats.filter(d => {
                    const age = d.MESURE_AGE_CO;
                    const gender = d.SEXDSTN_FLAG_CD;
                    return (
                        Number(age) >= 19 && Number(age) <= 29 &&
                        ['M', 'm', '남', '남자'].includes(gender)
                    );
                });

                const getAvg = (list) => {
                    const valid = list.filter(v => v != null && !isNaN(v));
                    if (valid.length === 0) return 0;
                    return Number((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1));
                };

                const bmiList = targetUsers.map(d => {
                    const h = d.MESURE_IEM_001_VALUE;
                    const w = d.MESURE_IEM_002_VALUE;
                    if (h && w) return w / Math.pow(h / 100, 2);
                    return null;
                });

                const fatList = targetUsers.map(d => d.MESURE_IEM_003_VALUE);
                const gripList = targetUsers.map(d => Math.max(d.MESURE_IEM_007_VALUE || 0, d.MESURE_IEM_008_VALUE || 0));
                const situpList = targetUsers.map(d => d.MESURE_IEM_019_VALUE);
                const flexList = targetUsers.map(d => d.MESURE_IEM_012_VALUE);

                const meanMap = {
                    "악력": getAvg(gripList),
                    "윗몸일으키기": getAvg(situpList),
                    "유연성": getAvg(flexList),
                    "BMI": getAvg(bmiList),
                    "체지방률": getAvg(fatList)
                };

                const avgArr = METRICS.map((m) => ({ metric: m, average: meanMap[m] != null ? meanMap[m] : null }));
                setAvgData(avgArr);

                const myRecordObject = {};
                avgArr.forEach(item => {
                    if (item.metric && item.average != null) {
                        myRecordObject[item.metric] = item.average;
                    }
                });

                setMyRecord(myRecordObject);
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

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-orb dashboard-orb-1"></div>
                <div className="dashboard-orb dashboard-orb-2"></div>
                <div className="dashboard-orb dashboard-orb-3"></div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.125rem' }}>데이터 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#ef4444', fontSize: '1.125rem' }}>{error}</p>
                </div>
            </div>
        );
    }

    const chartData = avgData.map((a) => {
        const mineVal = myRecord && myRecord[a.metric] != null ? myRecord[a.metric] : null;
        return {
            metric: a.metric,
            average: a.average != null ? Number(a.average) : null,
            mine: mineVal != null ? Number(mineVal) : null,
        };
    });

    return (
        <div className="dashboard-container">
            {/* Floating Orbs Background */}
            <div className="dashboard-orb dashboard-orb-1"></div>
            <div className="dashboard-orb dashboard-orb-2"></div>
            <div className="dashboard-orb dashboard-orb-3"></div>

            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    나의 <span className="dashboard-title-gradient">체력 분석</span>
                </h1>
                <Link to="/" className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    홈으로
                </Link>
            </div>

            {/* Input Form Card */}
            <div className="glass-card" style={{ animationDelay: '0.1s' }}>
                <div className="card-header">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                    </div>
                    <h2 className="card-title">체력 데이터 입력</h2>
                </div>
                <LogForm onLogSubmit={handleLogSubmit} />
            </div>

            {/* Chart Card */}
            <div className="glass-card" style={{ animationDelay: '0.2s' }}>
                <div className="card-header">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                    </div>
                    <h2 className="card-title">체력 분석 차트</h2>
                </div>
                <div className="info-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    평균 대비 나의 체력 수준을 확인하세요
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="metric"
                                interval={0}
                                angle={-20}
                                textAnchor="end"
                                height={60}
                                stroke="rgba(255,255,255,0.7)"
                                style={{ fontSize: '0.875rem' }}
                            />
                            <YAxis stroke="rgba(255,255,255,0.7)" style={{ fontSize: '0.875rem' }} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                            <Legend wrapperStyle={{ color: 'white' }} />
                            <Bar dataKey="average" name="평균" fill="#3b82f6" barSize={40} radius={[8, 8, 0, 0]}>
                                <LabelList dataKey="average" position="top" formatter={(v) => (v != null ? v : "")} fill="white" />
                            </Bar>
                            <Bar dataKey="mine" name="내 기록" fill="#06b6d4" barSize={40} radius={[8, 8, 0, 0]}>
                                <LabelList dataKey="mine" position="top" formatter={(v) => (v != null ? v : "")} fill="white" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recommendation Section */}
            <div className="recommendation-section" style={{ animationDelay: '0.3s' }}>
                <Recommendation userStats={myRecord} userMood={myMood} averageStats={avgData} programs={programsData} locations={locationsData} />
            </div>
        </div>
    );
}