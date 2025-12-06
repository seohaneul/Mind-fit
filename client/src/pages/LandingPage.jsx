import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ userName, setUserMood, setUserStress, setUserNote }) {
    const navigate = useNavigate();
    const [mood, setMood] = useState('보통');
    const [stress, setStress] = useState('보통');
    const [note, setNote] = useState('');

    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]})`;

    const handleSave = () => {
        setUserMood(mood);
        setUserStress(stress);
        setUserNote(note);
        navigate('/result');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                {/* Header Text */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 leading-snug">
                        오늘도 건강한 하루 되세요, {userName || "게스트"}님! <br />
                        <span className="text-gray-500">현재 상태와 마인드를 기록해보세요.</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">{dateString}</p>
                </div>

                {/* Input Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">현재 상태 및 마인드 입력</h2>

                    {/* Mood Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">기분 선택</label>
                        <div className="flex justify-between items-center text-sm">
                            {['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'].map((m) => (
                                <label key={m} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                    <input
                                        type="radio"
                                        name="mood"
                                        value={m}
                                        checked={mood === m}
                                        onChange={(e) => setMood(e.target.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className={`ml-2 ${mood === m ? 'font-bold text-blue-600' : 'text-gray-600'}`}>{m}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Stress Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">스트레스 수준 선택</label>
                        <div className="flex justify-between items-center text-sm">
                            {['매우 낮음', '낮음', '보통', '높음', '매우 높음'].map((s) => (
                                <label key={s} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                    <input
                                        type="radio"
                                        name="stress"
                                        value={s}
                                        checked={stress === s}
                                        onChange={(e) => setStress(e.target.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className={`ml-2 ${stress === s ? 'font-bold text-blue-600' : 'text-gray-600'}`}>{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2">오늘의 기분 (글)</label>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                            placeholder="오늘의 긍정적인 다짐을 글로 적어보세요..."
                            rows="4"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* Submit Button - type="button" to prevent accidental form submission */}
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all transform hover:scale-[1.01] active:scale-95"
                    >
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    );
}
