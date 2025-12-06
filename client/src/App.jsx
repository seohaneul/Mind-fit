import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Papa from 'papaparse';

import LandingPage from "./pages/LandingPage";
import ResultPage from "./pages/ResultPage";
import RecordPage from "./pages/RecordPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
  const [fullStatsData, setFullStatsData] = useState([]); // Raw CSV data
  const [avgData, setAvgData] = useState([]); // Calculated averages
  const [programsData, setProgramsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);

  const [userRecord, setUserRecord] = useState(null);
  const [userMood, setUserMood] = useState(null);
  const [userStress, setUserStress] = useState(null);
  const [userNote, setUserNote] = useState(null);
  const [error, setError] = useState(null);

  // Auth State
  const [userId, setUserId] = useState(localStorage.getItem("mindfit_userid") || null);
  const [userName, setUserName] = useState(localStorage.getItem("mindfit_username") || null);
  const [userAge, setUserAge] = useState(localStorage.getItem("mindfit_userage") || null);
  const [userGender, setUserGender] = useState(localStorage.getItem("mindfit_usergender") || null);

  // --- Auth Handlers ---
  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data && res.data._id) {
        setUserId(res.data._id);
        setUserName(res.data.name);
        setUserAge(res.data.age);
        setUserGender(res.data.gender);

        localStorage.setItem("mindfit_userid", res.data._id);
        localStorage.setItem("mindfit_username", res.data.name);
        localStorage.setItem("mindfit_userage", res.data.age);
        localStorage.setItem("mindfit_usergender", res.data.gender);
        return true;
      }
    } catch (e) {
      console.error("Login failed", e);
      const msg = e.response?.data?.error || "로그인 실패";
      alert(msg);
      return false;
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName(null);
    setUserAge(null);
    setUserGender(null);

    localStorage.removeItem("mindfit_userid");
    localStorage.removeItem("mindfit_username");
    localStorage.removeItem("mindfit_userage");
    localStorage.removeItem("mindfit_usergender");

    // Clear data that shouldn't persist across users
    setUserRecord(null);
    setUserMood(null);
    setUserStress(null);
    setUserNote(null);
  };

  // --- Initial Data Fetching ---
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

        setFullStatsData(fullStats);
        setProgramsData(programs);
        setLocationsData(locations);

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

  // --- Personalized Statistics Calculation ---
  useEffect(() => {
    if (fullStatsData.length === 0) return;

    // Determine Target Demographic
    // If user logged in: use their age/gender.
    // If guest: default to 20-29 Male (or general total average)

    let targetMinAge = 20;
    let targetMaxAge = 29;
    let targetGenderKeys = ['M', 'm', '남', '남자']; // Male default

    if (userId && userAge && userGender) {
      // Age Decade Logic
      const ageNum = Number(userAge);
      targetMinAge = Math.floor(ageNum / 10) * 10;
      targetMaxAge = targetMinAge + 9;

      // Gender Logic
      if (userGender === 'F') {
        targetGenderKeys = ['F', 'f', '여', '여자'];
      } else {
        targetGenderKeys = ['M', 'm', '남', '남자'];
      }
    }

    const targetUsers = fullStatsData.filter(d => {
      const dAge = Number(d.MESURE_AGE_CO);
      const dGender = d.SEXDSTN_FLAG_CD;
      return (
        dAge >= targetMinAge && dAge <= targetMaxAge &&
        targetGenderKeys.includes(dGender)
      );
    });

    console.log(`Calculating stats for Age: ${targetMinAge}-${targetMaxAge}, Gender: ${userGender || 'Default(M)'}. Found ${targetUsers.length} records.`);

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

  }, [fullStatsData, userId, userAge, userGender]);

  return (
    <Router>
      <NavBar userId={userId} userName={userName} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              userName={userName}
              setUserMood={setUserMood}
              setUserStress={setUserStress}
              setUserNote={setUserNote}
            />
          }
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/result"
          element={
            <ResultPage
              userName={userName}
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
              userName={userName}
              userAge={userAge}
              userGender={userGender}
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
