import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-gray-900">[Mind-Fit]</span>
            </div>

            <div className="flex items-center gap-8">
                <NavLink
                    to="/result"
                    className={({ isActive }) =>
                        isActive ? "text-sm font-bold text-gray-900 border-b-2 border-black pb-1" : "text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    }
                >
                    대시보드
                </NavLink>
                <NavLink
                    to="/record"
                    className={({ isActive }) =>
                        isActive ? "text-sm font-bold text-gray-900 border-b-2 border-black pb-1" : "text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    }
                >
                    내 기록
                </NavLink>
                <NavLink
                    to="/mypage"
                    className={({ isActive }) =>
                        isActive ? "text-sm font-bold text-gray-900 border-b-2 border-black pb-1" : "text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    }
                >
                    마이페이지
                </NavLink>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">홍길동 님</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-gray-200">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full" />
                </div>
            </div>
        </nav>
    );
}
