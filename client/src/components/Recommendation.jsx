import React, { useEffect, useState } from "react";
import { getGeminiPrescription } from "../api/gemini";

// Gemini UI component
// Gemini UI component
function GeminiPanel({ userMood, userStress, userNote, userName, onKeywordsChange }) {
    const [prescription, setPrescription] = useState("");
    const [loading, setLoading] = useState(false);

    const displayName = userName || "회원";

    // Initial trigger when props change
    useEffect(() => {
        if (userMood) {
            handlePrescription();
        }
    }, [userMood, userStress, userNote, userName]);


    const handlePrescription = async () => {
        setLoading(true);
        setPrescription("");

        // Reset keywords briefly while loading new ones
        if (onKeywordsChange) onKeywordsChange([]);

        try {
            const promptContext = `
[사용자 감정 분석 요청]
- 사용자 이름: ${displayName}
- 현재 기본 기분: ${userMood}
- 스트레스 정도: ${userStress}
- 사용자가 직접 작성한 감정 일기: "${userNote || "특별한 기록 없음"}"

위 정보를 바탕으로 심리 상담가처럼 공감해주고, 현재 감정 상태를 개선하거나 해소할 수 있는 구체적인 운동 하나를 추천해주세요.
일기 내용에 담긴 감정(불안, 분노, 무기력, 슬픔 등)을 읽어내어 그에 맞는 톤으로 답변해주세요.
`;
            // Call API
            const result = typeof getGeminiPrescription === "function"
                ? await getGeminiPrescription("감정 기반 맞춤 운동 처방", promptContext)
                : { prescription: `Gemini 연결 실패.`, keywords: ["산책", "스트레칭"] };

            // Handle result object or string fallback
            let text = "";
            let keys = [];

            if (typeof result === 'object' && result.prescription) {
                text = result.prescription;
                keys = result.keywords || [];
            } else if (typeof result === 'string') {
                // Fallback if legacy string return
                text = result;
                // Try basic extraction
                const basicKeys = ["수영", "요가", "헬스", "필라테스", "산책", "배드민턴", "탁구"];
                keys = basicKeys.filter(k => text.includes(k));
            }

            setPrescription(text);

            // Pass keywords to parent for searching
            if (onKeywordsChange && keys.length > 0) {
                onKeywordsChange(keys);
            } else if (onKeywordsChange) {
                // Fallback keywords if none found
                onKeywordsChange(getKeywordsFromMood(userMood, userStress));
            }

        } catch (e) {
            console.error(e);
            setPrescription("처방을 불러오는 중 오류가 발생했습니다.");
            if (onKeywordsChange) onKeywordsChange(getKeywordsFromMood(userMood, userStress));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/30 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Gemini 마인드 처방소</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">AI가 분석한 맞춤형 운동 솔루션</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-bold mr-2 mb-1">분석 대상</span>
                        {displayName}님의 현재 기분 <span className="font-bold text-gray-900">'{userMood}'</span>과 스트레스 <span className="font-bold text-gray-900">'{userStress}'</span> 상태
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-500 font-medium animate-pulse">처방전을 작성하고 있습니다...</p>
                    </div>
                ) : (
                    prescription && (
                        <div className="animate-fade-in-up bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                💊 오늘의 처방전
                            </h3>
                            <div className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line font-medium">
                                {prescription}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

// Mood to Exercise Keyword Mapping (Fallback)
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
export default function Recommendation({ userStats, userMood, userStress, userNote, locations = [], programs = [], userName }) {
    const [keywords, setKeywords] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLoc, setUserLoc] = useState(null); // { lat, lon }
    const [locError, setLocError] = useState(null);

    // Modal State
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [facilityPrograms, setFacilityPrograms] = useState([]);

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

    // Derive keywords from Mood/Stress - Handled by GeminiPanel now
    // useEffect(() => {
    //     // const derivedKeywords = getKeywordsFromMood(userMood, userStress);
    //     // setKeywords(derivedKeywords);
    // }, [userMood, userStress]);

    // Search Facilities
    useEffect(() => {
        if (!keywords || keywords.length === 0 || !locations || locations.length === 0) return setPlaces([]);

        setLoading(true);
        setPlaces([]);

        try {
            const terms = keywords.map(k => k.toLowerCase());

            let filtered = locations.filter(loc => {
                const name = (loc.FCLTY_NM || loc.facilityName || "").toLowerCase();
                const addr = (loc.RDNMADR_NM || loc.address || "").toLowerCase();
                return terms.some(term => name.includes(term) || addr.includes(term));
            });

            if (userLoc) {
                filtered = filtered.map(loc => {
                    const lat = parseFloat(loc.FCLTY_LA || loc.latitude);
                    const lon = parseFloat(loc.FCLTY_LO || loc.longitude);
                    let dist = null;
                    if (!isNaN(lat) && !isNaN(lon)) {
                        dist = getDistanceFromLatLonInKm(userLoc.lat, userLoc.lon, lat, lon);
                    }
                    return { ...loc, _distance: dist };
                });

                filtered.sort((a, b) => {
                    if (a._distance === null) return 1;
                    if (b._distance === null) return -1;
                    return a._distance - b._distance;
                });
            }

            const sliced = filtered.slice(0, 6);
            const mapped = sliced.map((item, idx) => ({
                _id: idx,
                facilityName: item.FCLTY_NM || item.facilityName,
                address: item.RDNMADR_NM || item.ROAD_NM_CTPRVN_NM + " " + item.ROAD_NM_SIGNGU_NM || item.address,
                distance: item._distance,
                tel: item.RPRSNTV_TEL_NO || item.tel // Added phone if available
            }));

            setPlaces(mapped);
        } catch (e) {
            console.error("Filtering error", e);
        } finally {
            setLoading(false);
        }

    }, [keywords, locations, userLoc]);

    // Handle Facility Click
    const handleFacilityClick = (facility) => {
        const relatedPrograms = programs.filter(p =>
            p.FCLTY_NM === facility.facilityName
        );
        setFacilityPrograms(relatedPrograms);
        setSelectedFacility(facility);
    };

    const closePopup = () => {
        setSelectedFacility(null);
        setFacilityPrograms([]);
    };

    if (!userMood) {
        return <div className="mt-4 text-gray-600">마인드 기록이 없습니다. 메인 화면에서 상태를 입력해 주세요.</div>;
    }

    return (
        <div className="mt-6">
            <div className="mb-3">
                <div className="text-lg">
                    <span className="font-bold text-indigo-600">{userMood}</span> 기분과 <span className="font-bold text-indigo-600">{userStress}</span> 스트레스 수준에 맞는 활동입니다.
                </div>
                {keywords.length > 0 && (
                    <div className="text-sm mt-1">
                        AI 추천 키워드: <span className="font-bold text-blue-600 animate-pulse-once">{keywords.join(", ")}</span>
                    </div>
                )}
            </div>

            <GeminiPanel
                userMood={userMood}
                userStress={userStress}
                userNote={userNote}
                userName={userName}
                onKeywordsChange={setKeywords} // Pass setter to child
            />

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">내 주변 추천 공공시설 (TOP 6)</h2>
                <p className="text-sm text-gray-500 mb-4">시설을 클릭하면 상세 프로그램 정보를 볼 수 있습니다.</p>

                {loading && <div className="text-gray-500 mb-2">시설을 찾고 있습니다...</div>}

                <div className="flex flex-col gap-3">
                    {places.length === 0 && !loading && (
                        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
                            해당 키워드({keywords.join(", ")})와 일치하는 주변 공공시설을 찾지 못했습니다.
                        </div>
                    )}

                    {places.map((p) => (
                        <div
                            key={p._id}
                            onClick={() => handleFacilityClick(p)}
                            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer active:scale-[0.99] flex justify-between items-center gap-3"
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 flex items-center gap-2 truncate">
                                    <span className="truncate">{p.facilityName}</span>
                                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal whitespace-nowrap hidden sm:inline-block">상세보기 &gt;</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{p.address}</p>
                            </div>
                            {p.distance != null && (
                                <div className="text-right shrink-0">
                                    <span className="block text-blue-600 font-bold text-xs sm:text-sm">{p.distance.toFixed(1)}km</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Popup */}
            {selectedFacility && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closePopup}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedFacility.facilityName}</h3>
                                <p className="text-sm text-gray-500 mt-1">{selectedFacility.address}</p>
                            </div>
                            <button onClick={closePopup} className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                📢 운영 중인 프로그램
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{facilityPrograms.length}개</span>
                            </h4>

                            {facilityPrograms.length > 0 ? (
                                <div className="space-y-3">
                                    {facilityPrograms.map((prog, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                                            <div className="font-bold text-gray-800 mb-1">{prog.PROGRM_NM || "프로그램명 없음"}</div>
                                            <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                                {prog.PROGRM_PRC_BH ? <span>⏱ {prog.PROGRM_PRC_BH}</span> : null}
                                                {prog.PROGRM_TRGET_NM ? <span>👥 {prog.PROGRM_TRGET_NM}</span> : null}
                                                {prog.PROGRM_PRC_MTH ? <span>📅 {prog.PROGRM_PRC_MTH}</span> : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    등록된 프로그램 정보가 없습니다.
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                            <button onClick={closePopup} className="px-6 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
