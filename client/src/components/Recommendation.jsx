import React, { useEffect, useState } from "react";
import axios from "axios";
import { getGeminiPrescription } from "../api/gemini"; // optional API helper

// Gemini UI as a separate component to avoid name collisions
function GeminiPanel({ weakMetric }) {
    const [mood, setMood] = useState(null);
    const [prescription, setPrescription] = useState("");
    const [loading, setLoading] = useState(false);

    const moodOptions = [
        { label: "지치고 무기력해 💧", value: "무기력함" },
        { label: "스트레스 폭발 💥", value: "스트레스 많음" },
        { label: "평온한 상태 🌿", value: "평온함" },
        { label: "에너지 뿜뿜 🔥", value: "활기참" },
    ];

    const handlePrescription = async (selectedMood) => {
        setMood(selectedMood);
        setLoading(true);
        setPrescription("");
        try {
            const result =
                typeof getGeminiPrescription === "function"
                    ? await getGeminiPrescription(weakMetric || "체력", selectedMood)
                    : `추천 처방: ${weakMetric || "체력"} 개선을 위한 기본 루틴 (기분: ${selectedMood})`;
            setPrescription(result);
        } catch (e) {
            console.error(e);
            setPrescription("처방을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">✨ Gemini 마인드 처방소</h2>
            <p className="text-gray-500 mb-6">
                현재 <span className="font-bold text-blue-600">{weakMetric || "전반적인 체력"}</span> 관리가 필요하시군요.
                <br />
                오늘 기분은 어떠세요? Gemini가 딱 맞는 운동을 찾아드릴게요!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {moodOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handlePrescription(option.value)}
                        disabled={loading}
                        className={`p-4 rounded-xl font-medium transition-all transform hover:scale-105 ${mood === option.value
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {loading && mood === option.value ? "Gemini가 생각 중..." : option.label}
                    </button>
                ))}
            </div>

            {prescription && (
                <div className="animate-fade-in-up p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-l-4 border-purple-500">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">🤖</span>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-1">Gemini의 처방전</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{prescription}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const MAP = {
    유연성: ["요가", "필라테스"],
    악력: ["헬스", "웨이트"],
    윗몸일으키기: ["크로스핏", "체력"],
    BMI: ["수영", "에어로빅"],
    체지방률: ["수영", "에어로빅"],
};

// main Recommendation component
export default function Recommendation({ userStats = {}, averageStats = [] }) {
    const [weakMetric, setWeakMetric] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const avgMap = {};
        for (const a of averageStats || []) {
            if (a.metric != null) avgMap[String(a.metric).trim()] = Number(a.average ?? a.mean ?? 0);
        }

        let best = { metric: null, diff: 0 };
        const METRICS = ["악력", "윗몸일으키기", "유연성", "BMI", "체지방률"];
        for (const m of METRICS) {
            const avg = avgMap[m];
            const me = userStats && userStats[m] != null ? Number(userStats[m]) : null;
            if (avg == null || me == null) continue;
            let diff = 0;
            if (m === "BMI" || m === "체지방률") diff = me - avg; // higher-than-average is weakness
            else diff = avg - me; // lower-than-average is weakness
            if (diff > best.diff) best = { metric: m, diff };
        }

        if (best.metric && best.diff > 0) {
            setWeakMetric(best.metric);
            setKeywords(MAP[best.metric] || []);
        } else {
            setWeakMetric(null);
            setKeywords([]);
            setPlaces([]);
        }
    }, [userStats, averageStats]);

    useEffect(() => {
        if (!keywords || keywords.length === 0) return setPlaces([]);
        const keyword = keywords[0];
        setLoading(true);
        setPlaces([]);
        axios
            .get(`/api/facilities/search?keyword=${encodeURIComponent(keyword)}`)
            .then((res) => setPlaces(Array.isArray(res.data) ? res.data : []))
            .catch((e) => {
                console.error("Recommendation search error", e);
                setPlaces([]);
            })
            .finally(() => setLoading(false));
    }, [keywords]);

    if (!userStats || Object.keys(userStats).length === 0) {
        return <div className="mt-4 text-gray-600">내 기록이 없습니다. 기록을 먼저 입력해 주세요.</div>;
    }

    if (!weakMetric) {
        return <div className="mt-4 text-green-600 font-semibold">현재 평균 대비 뚜렷한 약점이 없습니다.</div>;
    }

    return (
        <div className="mt-6">
            <div className="mb-3">
                <div className="text-lg">
                    당신의 부족한 점은 <span className="font-bold text-indigo-600">{weakMetric}</span>입니다.
                </div>
                <div className="text-sm mt-1">
                    추천 운동: <span className="font-semibold text-blue-600">{(keywords || []).join(", ")}</span>
                </div>
            </div>

            {/* Gemini prescription panel */}
            <GeminiPanel weakMetric={weakMetric} />

            {loading && <div className="text-gray-500 mb-2">시설을 불러오는 중...</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {places.length === 0 && !loading && <div className="text-gray-600">추천 시설이 없습니다.</div>}

                {places.map((p) => (
                    <div
                        key={p._id}
                        className="p-4 bg-white border-2 rounded-lg hover:shadow-lg transition-shadow duration-200"
                        style={{ borderColor: "#c7d2fe" }}
                    >
                        <div className="text-base font-semibold text-gray-800 mb-1">{p.facilityName}</div>
                        <div className="text-sm text-gray-500">
                            {p.address || (p.location && `${p.location.coordinates[1]}, ${p.location.coordinates[0]}`)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
