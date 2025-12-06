import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar({ userId, userName, onLogout }) {
    return (
        <nav className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all">
            <div className="flex items-center gap-1 md:gap-2">
                <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900">[Mind-Fit]</span>
            </div>

            <div className="flex items-center gap-3 md:gap-8">
                <NavLink
                    to="/result"
                    className={({ isActive }) =>
                        isActive ? "text-xs md:text-sm font-bold text-gray-900 border-b-2 border-black pb-1" : "text-xs md:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    }
                >
                    대시보드
                </NavLink>
                <NavLink
                    to="/record"
                    className={({ isActive }) =>
                        isActive ? "text-xs md:text-sm font-bold text-gray-900 border-b-2 border-black pb-1" : "text-xs md:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    }
                >
                    내 기록
                </NavLink>
                {/* Hide MyPage on very small screens if needed, or keep small */}
                <NavLink
                    to="/mypage"
                    className={({ isActive }) =>
                        isActive ? "hidden md:block text-xs md:text-sm font-bold text-gray-900 border-b-2 border-black pb-1" : "hidden md:block text-xs md:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    }
                >
                    마이페이지
                </NavLink>
            </div>

            <div className="flex items-center gap-2">
                {userId ? (
                    <>
                        <span className="hidden md:inline text-sm font-bold text-gray-900">{userName || "사용자"} 님</span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-gray-200">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="avatar" className="w-full h-full" />
                        </div>
                        <button
                            onClick={onLogout}
                            className="text-xs text-red-500 hover:text-red-600 font-medium ml-1 md:ml-2 whitespace-nowrap"
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 md:px-4 rounded-lg transition-colors whitespace-nowrap"
                    >
                        로그인
                    </NavLink>
                )}
            </div>
        </nav>
    );
}
