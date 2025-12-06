import React from 'react';
import { useNavigate } from 'react-router-dom';
import landingHero from '../assets/landing_hero.png';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Hero Background Image */}
            <div
                className="hero-background"
                style={{
                    backgroundImage: `url(${landingHero})`,
                }}
            />

            {/* Gradient Overlay */}
            <div className="gradient-overlay" />

            {/* Animated Background Elements */}
            <div className="floating-orb orb-1" />
            <div className="floating-orb orb-2" />
            <div className="floating-orb orb-3" />

            {/* Content Container */}
            <div className="content-container">
                {/* Logo/Brand Section */}
                <div className="brand-section">
                    <div className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </div>
                    <h1 className="brand-title">
                        Mind<span className="brand-separator">·</span>Fit
                    </h1>
                </div>

                {/* Main Tagline */}
                <div className="tagline-section">
                    <h2 className="main-tagline">
                        마음과 몸의 조화,
                        <br />
                        <span className="highlight-text">당신만을 위한 맞춤 솔루션</span>
                    </h2>
                    <p className="sub-tagline">
                        AI 기반 마음 상태 분석으로 최적의 운동과 공공시설을 추천받으세요.
                        <br />
                        더 건강하고 행복한 내일을 위한 첫 걸음을 시작하세요.
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="cta-button"
                >
                    <span className="button-content">
                        <span className="button-text">시작하기</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="button-arrow"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <div className="button-glow" />
                </button>

                {/* Feature Pills */}
                <div className="feature-pills">
                    <div className="pill">
                        <svg xmlns="http://www.w3.org/2000/svg" className="pill-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                        </svg>
                        <span>AI 마음 분석</span>
                    </div>
                    <div className="pill">
                        <svg xmlns="http://www.w3.org/2000/svg" className="pill-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                        </svg>
                        <span>맞춤 운동 추천</span>
                    </div>
                    <div className="pill">
                        <svg xmlns="http://www.w3.org/2000/svg" className="pill-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>공공시설 찾기</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} KSPO Mind-Fit Project. All rights reserved.</p>
            </footer>
        </div>
    );
}
