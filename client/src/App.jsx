import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Papa from 'papaparse';

import LandingPage from "./pages/LandingPage";
import ResultPage from "./pages/ResultPage";
import RecordPage from "./pages/RecordPage";
import NavBar from "./components/NavBar";

// Data Source Constants
const METRICS = ["악력", "윗몸일으키기", "유연성", "BMI", "체지방률"];
const STATS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_measurements.csv';
const PROGRAMS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_programs.csv';
const LOCATIONS_RAW_URL = 'https://media.githubusercontent.com/media/seohaneul/Mind-fit/refs/heads/main/server/data/kspo_facilities.csv';

const parseCsv = (csvText) => {
  const { data } = Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return Array.isArray(data) ? data : [];
};

function App() {
  // Application State
  const [loading, setLoading] = useState(true);
  const [avgData, setAvgData] = useState([]);
  const [programsData, setProgramsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [userRecord, setUserRecord] = useState(null);
  const [userMood, setUserMood] = useState(null); // String: "보통", "좋음" etc
  const [userStress, setUserStress] = useState(null);
  const [userNote, setUserNote] = useState(null);
  const [error, setError] = useState(null);

  // Auth State
  const [userId, setUserId] = useState(localStorage.getItem("mindfit_userid") || null);
  const [userName, setUserName] = useState(localStorage.getItem("mindfit_username") || null);

  const handleLogin = async (usernameInput) => {
    try {
      // Simple login via new auth endpoint
      const res = await axios.post("/api/auth/login", { username: usernameInput });
      if (res.data && res.data._id) {
        setUserId(res.data._id);
        setUserName(res.data.name);
        localStorage.setItem("mindfit_userid", res.data._id);
        localStorage.setItem("mindfit_username", res.data.name);
        return true;
      } else {
        alert("로그인 응답 형식이 올바르지 않습니다.");
        return false;
      }
    } catch (e) {
      console.error("Login failed", e);
      const msg = e.response?.data?.error || e.message || "알 수 없는 오류";
      alert(`로그인에 실패했습니다: ${msg}`);
      return false;
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName(null);
    localStorage.removeItem("mindfit_userid");
    localStorage.removeItem("mindfit_username");
  };

  // Initial Data Fetching
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [statsRes, programsRes, locationsRes] = await Promise.all([
          axios.get(STATS_RAW_URL),
          axios.get(PROGRAMS_RAW_URL),
          axios.get(LOCATIONS_RAW_URL),
        ]);

        if (!mounted) return;

        const fullStats = parseCsv(statsRes.data);
        const programs = parseCsv(programsRes.data);
        const locations = parseCsv(locationsRes.data);

        setProgramsData(programs);
        setLocationsData(locations);

        // Calculate Averages for target demographic (20-29 Male as per original logic)
        const targetUsers = fullStats.filter(d => {
          const age = d.MESURE_AGE_CO;
          const gender = d.SEXDSTN_FLAG_CD;
          return (
            Number(age) >= 19 && Number(age) <= 29 &&
            ['M', 'm', '남', '남자'].includes(gender)
          );
        });

        const getAvg = (list) => {
          const valid = list.filter(v => v != null && !isNaN(v));
          if (valid.length === 0) return 0;
          return Number((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1));
        };

        const bmiList = targetUsers.map(d => {
          const h = d.MESURE_IEM_001_VALUE;
          const w = d.MESURE_IEM_002_VALUE;
          if (h && w) return w / Math.pow(h / 100, 2);
          return null;
        });

        const fatList = targetUsers.map(d => d.MESURE_IEM_003_VALUE);
        const gripList = targetUsers.map(d => Math.max(d.MESURE_IEM_007_VALUE || 0, d.MESURE_IEM_008_VALUE || 0));
        const situpList = targetUsers.map(d => d.MESURE_IEM_019_VALUE);
        const flexList = targetUsers.map(d => d.MESURE_IEM_012_VALUE);

        const meanMap = {
          "악력": getAvg(gripList),
          "윗몸일으키기": getAvg(situpList),
          "유연성": getAvg(flexList),
          "BMI": getAvg(bmiList),
          "체지방률": getAvg(fatList)
        };

        const avgArr = METRICS.map((m) => ({ metric: m, average: meanMap[m] != null ? meanMap[m] : null }));
        setAvgData(avgArr);

      } catch (e) {
        console.error("Data load error", e);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);


  return (
    <Router>
      <NavBar userId={userId} userName={userName} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              setUserMood={setUserMood}
              setUserStress={setUserStress}
              setUserNote={setUserNote}
            />
          }
        />
        <Route
          path="/result"
          element={
            <ResultPage
              userRecord={userRecord}
              userMood={userMood}
              userStress={userStress}
              userNote={userNote}
              avgData={avgData}
              programsData={programsData}
              locationsData={locationsData}
            />
          }
        />
        <Route
          path="/record"
          element={
            <RecordPage
              userId={userId}
              onLogin={handleLogin}
              avgData={avgData}
              userRecord={userRecord}
              setUserRecord={setUserRecord}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
