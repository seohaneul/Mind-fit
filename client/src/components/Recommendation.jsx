import React, { useEffect, useState } from "react";
import { getGeminiPrescription } from "../api/gemini";

// Gemini UI component
function GeminiPanel({ userMood, userStress, userNote }) {
    const [prescription, setPrescription] = useState("");
    const [loading, setLoading] = useState(false);

    // Initial trigger when props change
    useEffect(() => {
        if (userMood) {
            handlePrescription();
        }
    }, [userMood, userStress, userNote]);

    const handlePrescription = async () => {
        setLoading(true);
        setPrescription("");
        try {
            const promptContext = `
[사용자 감정 분석 요청]
- 현재 기본 기분: ${userMood}
- 스트레스 정도: ${userStress}
- 사용자가 직접 작성한 감정 일기: "${userNote || "특별한 기록 없음"}"

위 정보를 바탕으로 심리 상담가처럼 공감해주고, 현재 감정 상태를 개선하거나 해소할 수 있는 구체적인 운동 하나를 추천해주세요.
일기 내용에 담긴 감정(불안, 분노, 무기력, 슬픔 등)을 읽어내어 그에 맞는 톤으로 답변해주세요.
`;
            const result =
                typeof getGeminiPrescription === "function"
                    ? await getGeminiPrescription("감정 기반 맞춤 운동 처방", promptContext)
                    : `Gemini 추천: 작성해주신 글(${userNote})을 바탕으로, 마음의 짐을 덜 수 있는 가벼운 산책이나 명상을 권해드립니다.`;
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
                입력하신 <span className="font-bold text-blue-600">마인드 데이터</span>를 분석하여
                <br />
                홍길동님에게 딱 맞는 운동 솔루션을 제공합니다.
            </p>

            {(loading) && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-500 font-medium">Gemini가 맞춤 처방을 작성 중입니다...</span>
                </div>
            )}

            {!loading && prescription && (
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

// Mood to Exercise Keyword Mapping
const getKeywordsFromMood = (mood, stress) => {
    const m = mood || "보통";
    const s = stress || "보통";

    // High Stress -> Calming
    if (s.includes("높음") || s.includes("많음")) return ["요가", "필라테스", "명상"];

    // Bad Mood -> Uplifting but gentle
    if (m.includes("나쁨") || m.includes("우울")) return ["산책", "스트레칭", "수영"];

    // Good Mood -> Active
    if (m.includes("좋음") || m.includes("활기")) return ["헬스", "크로스핏", "축구", "풋살"];

    // Normal -> Balanced
    return ["배드민턴", "탁구", "수영", "헬스"];
};

// Helper for Haversine distance calculation
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// main Recommendation component
export default function Recommendation({ userStats, userMood, userStress, userNote, locations = [] }) {
    const [keywords, setKeywords] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLoc, setUserLoc] = useState(null); // { lat, lon }
    const [locError, setLocError] = useState(null);

    // Get User Location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLoc({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Location error:", error);
                    setLocError("위치 정보를 가져올 수 없어 기본 순서로 표시합니다.");
                }
            );
        } else {
            setLocError("브라우저가 위치 정보를 지원하지 않습니다.");
        }
    }, []);

    // Derive keywords from Mood/Stress (ignoring physical stats as requested)
    useEffect(() => {
        const derivedKeywords = getKeywordsFromMood(userMood, userStress);
        setKeywords(derivedKeywords);
    }, [userMood, userStress]);

    // Search Facilities based on Keywords & Location
    useEffect(() => {
        if (!keywords || keywords.length === 0 || !locations || locations.length === 0) return setPlaces([]);

        setLoading(true);
        setPlaces([]);

        try {
            // Combine all keywords for broader search
            const terms = keywords.map(k => k.toLowerCase());

            let filtered = locations.filter(loc => {
                const name = (loc.FCLTY_NM || loc.facilityName || "").toLowerCase();
                const addr = (loc.RDNMADR_NM || loc.address || "").toLowerCase();
                // Check if ANY keyword matches
                return terms.some(term => name.includes(term) || addr.includes(term));
            });

            // If user location exists, calculate distance and sort
            if (userLoc) {
                filtered = filtered.map(loc => {
                    // Try to parse coordinates. CSV columns: FCLTY_LA, FCLTY_LO
                    const lat = parseFloat(loc.FCLTY_LA || loc.latitude);
                    const lon = parseFloat(loc.FCLTY_LO || loc.longitude);

                    let dist = null;
                    if (!isNaN(lat) && !isNaN(lon)) {
                        dist = getDistanceFromLatLonInKm(userLoc.lat, userLoc.lon, lat, lon);
                    }
                    return { ...loc, _distance: dist };
                });

                // Sort by distance (asc), verify valid distance
                filtered.sort((a, b) => {
                    if (a._distance === null) return 1;
                    if (b._distance === null) return -1;
                    return a._distance - b._distance;
                });
            }

            // Slice top results
            const sliced = filtered.slice(0, 6); // Limit results

            // Map to display format
            const mapped = sliced.map((item, idx) => ({
                _id: idx,
                facilityName: item.FCLTY_NM || item.facilityName,
                address: item.RDNMADR_NM || item.ROAD_NM_CTPRVN_NM + " " + item.ROAD_NM_SIGNGU_NM || item.address,
                distance: item._distance
            }));

            setPlaces(mapped);
        } catch (e) {
            console.error("Filtering error", e);
        } finally {
            setLoading(false);
        }

    }, [keywords, locations, userLoc]);

    if (!userMood) {
        return <div className="mt-4 text-gray-600">마인드 기록이 없습니다. 메인 화면에서 상태를 입력해 주세요.</div>;
    }

    return (
        <div className="mt-6">
            <div className="mb-3">
                <div className="text-lg">
                    <span className="font-bold text-indigo-600">{userMood}</span> 기분과 <span className="font-bold text-indigo-600">{userStress}</span> 스트레스 수준에 맞는 활동입니다.
                </div>
                <div className="text-sm mt-1">
                    추천 키워드: <span className="font-semibold text-blue-600">{(keywords || []).join(", ")}</span>
                </div>
            </div>

            {/* Gemini prescription panel */}
            <GeminiPanel userMood={userMood} userStress={userStress} userNote={userNote} />

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">내 주변 추천 공공시설 (TOP 3)</h2>
                {loading && <div className="text-gray-500 mb-2">시설을 찾고 있습니다...</div>}

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {places.length === 0 && !loading && (
                        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
                            해당 키워드({keywords.join(", ")})와 일치하는 주변 공공시설을 찾지 못했습니다.
                        </div>
                    )}

                    {places.map((p) => (
                        <div
                            key={p._id}
                            className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Placeholder Image */}
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden mr-4 relative group">
                                <img
                                    src={`https://source.unsplash.com/200x200/?${keywords[0] || "gym"},sports`}
                                    alt="facility"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Mind-Fit' }}
                                />
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-lg font-bold text-gray-800 mb-1">{p.facilityName}</div>
                                    <div className="text-sm text-gray-500 mb-2">{p.address}</div>
                                </div>
                                {p.distance != null && (
                                    <div className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                                        {p.distance.toFixed(1)}km
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
