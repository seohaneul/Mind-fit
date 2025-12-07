import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyPage({ userId, userName, userAge, userGender, userEmail, onLogout, onUpdateUser }) {
    const navigate = useNavigate();

    // Edit Form State
    const [name, setName] = useState(userName || '');
    const [age, setAge] = useState(userAge || '');
    const [gender, setGender] = useState(userGender || 'M');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(userName || '');
        setAge(userAge || '');
        setGender(userGender || 'M');
    }, [userName, userAge, userGender]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!confirm("정보를 수정하시겠습니까?")) return;

        setLoading(true);
        try {
            const res = await axios.put('/api/auth/update', {
                userId,
                name,
                age,
                gender
            });
            // Update App State
            onUpdateUser(res.data.user);
            alert("정보가 성공적으로 수정되었습니다.");
        } catch (err) {
            console.error(err);
            alert("정보 수정 실패: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleResetLogs = async () => {
        if (!confirm("정말 모든 기록(신체, 마인드 로그)을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;

        try {
            await axios.delete('/api/logs/reset', {
                headers: { "x-user-id": userId }
            });
            alert("모든 기록이 초기화되었습니다.");
            // Optionally refresh page or parent state if needed, but logs are cleared so no immediate visual change unless on RecordPage.
        } catch (err) {
            console.error(err);
            alert("기록 초기화 실패: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDeleteAccount = async () => {
        const confirm1 = confirm("정말로 탈퇴하시겠습니까?");
        if (!confirm1) return;

        const confirm2 = confirm("탈퇴 시 모든 정보와 기록이 영구적으로 삭제됩니다. 계속하시겠습니까?");
        if (!confirm2) return;

        try {
            await axios.delete('/api/auth/delete', {
                data: { userId } // Sending body for DELETE
            });
            alert("탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
            onLogout(); // Log out and redirect
        } catch (err) {
            console.error(err);
            alert("탈퇴 처리 실패: " + (err.response?.data?.error || err.message));
        }
    };

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>로그인이 필요한 페이지입니다.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                    <p className="text-gray-500 mt-2">내 정보를 관리하고 설정을 변경합니다.</p>
                </div>

                {/* Profile Edit Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">회원 정보 수정</h2>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이메일 (아이디)</label>
                            <input
                                type="text"
                                value={userEmail || ''}
                                disabled
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">아이디는 변경할 수 없습니다.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="120"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="M">남성</option>
                                    <option value="F">여성</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
                            >
                                {loading ? '저장 중...' : '정보 수정 저장'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-red-600 mb-6 border-b border-red-100 pb-4">위험 구역 (Danger Zone)</h2>

                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-gray-800">모든 기록 초기화</h3>
                                <p className="text-sm text-gray-500">신체 측정 기록과 마인드 로그를 모두 삭제합니다. 계정은 유지됩니다.</p>
                            </div>
                            <button
                                onClick={handleResetLogs}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap"
                            >
                                기록 초기화
                            </button>
                        </div>

                        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-gray-800">회원 탈퇴</h3>
                                <p className="text-sm text-gray-500">계정과 모든 데이터를 영구적으로 삭제합니다. 되돌릴 수 없습니다.</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors whitespace-nowrap"
                            >
                                회원 탈퇴
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
