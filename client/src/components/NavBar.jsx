import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar({ userId, userName, onLogout, userProfileImage }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    // Profile Image Source
    const profileSrc = userProfileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || "User"}`;

    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                        <NavLink to="/" className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-1">
                            <span className="text-blue-600">Mind</span> Fit
                        </NavLink>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
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

                    {/* User Profile / Login (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {userId ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{userName} 님</p>
                                    <button onClick={onLogout} className="text-xs text-gray-500 hover:text-red-500 underline decoration-gray-300 hover:decoration-red-500">로그아웃</button>
                                </div>
                                <NavLink to="/mypage" className="w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 hover:border-blue-200 transition-colors">
                                    <img src={profileSrc} alt="profile" className="w-full h-full object-cover" />
                                </NavLink>
                            </div>
                        ) : (
                            <NavLink to="/login" className="text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                                로그인
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">메뉴 열기</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full z-50 bg-white border-b border-gray-200 shadow-xl md:hidden animate-slide-down">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/result"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-600 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            }
                        >
                            대시보드
                        </NavLink>
                        <NavLink
                            to="/record"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-600 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            }
                        >
                            내 기록
                        </NavLink>
                        <NavLink
                            to="/mypage"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-600 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            }
                        >
                            마이페이지
                        </NavLink>
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {userId ? (
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={profileSrc} alt="" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-bold text-gray-800">{userName}</div>
                                    <div className="text-sm font-medium text-gray-500">환영합니다!</div>
                                </div>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        closeMenu();
                                    }}
                                    className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none"
                                >
                                    <span className="text-xs font-bold border border-gray-200 px-3 py-1 rounded-full">로그아웃</span>
                                </button>
                            </div>
                        ) : (
                            <div className="px-5">
                                <NavLink
                                    to="/login"
                                    onClick={closeMenu}
                                    className="block text-center w-full px-5 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                                >
                                    로그인
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
