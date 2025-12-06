import React from 'react';
import Recommendation from '../components/Recommendation';

export default function ResultPage({ userRecord, userMood, userStress, userNote, avgData, locationsData, programsData }) {
    // Current date formatting
    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]})`;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-10">
                {/* Greeting Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 leading-snug">
                        오늘도 건강한 하루 되세요, 홍길동님! <br />
                        <span className="text-gray-500">현재 상태와 마인드를 기록해보세요.</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">{dateString}</p>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">분석 결과 및 요약</h2>

                    <div className="mb-6">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            홍길동님의 오늘 마음 상태는 <span className="font-bold text-blue-600">'{userMood || "'알 수 없음'"}'</span>이며,
                            스트레스 수준은 <span className="font-bold text-blue-600">'{userStress || "'알 수 없음'"}'</span>으로 기록되었습니다.
                        </p>
                        {userNote && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="block text-sm font-bold text-gray-500 mb-1">오늘의 기록</span>
                                <p className="text-gray-700 italic">" {userNote} "</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area - Just Recommendation for now as per "Analysis Result" */}
                {/* The Recommendation component handles logic for "Gemini Analysis" and "Facilities" */}
                <Recommendation
                    userStats={userRecord}
                    userMood={userMood}
                    averageStats={avgData}
                    programs={programsData}
                    locations={locationsData}
                />
            </div>
        </div>
    );
}
