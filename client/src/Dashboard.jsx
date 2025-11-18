import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from "recharts";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await axios.get("/api/stats");
                if (!mounted) return;
                const all = Array.isArray(res.data) ? res.data : [];
                // 하드코딩 필터: '20대' & 'M' (남자)
                const filtered = all
                    .filter(
                        (d) =>
                            String(d.ageGroup).trim() === "20대" &&
                            ["M", "m", "남", "남자", "Male"].includes(String(d.gender).trim())
                    )
                    .map((d) => ({
                        metric: d.metric || d.name || d.ITEM_NM || "unknown",
                        mean: Number(String(d.mean).replace(/,/g, "")) || 0,
                    }));
                setData(filtered);
            } catch (e) {
                setError(e.message || "데이터 로드 실패");
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) return <div>데이터 불러오는 중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (!data || data.length === 0) return <div>해당 조건의 데이터가 없습니다.</div>;

    return (
        <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mean" fill="#1976d2" barSize={40}>
                        <LabelList dataKey="mean" position="top" formatter={(val) => (Number.isFinite(val) ? val : "")} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
// // filepath: c:\Users\user\Desktop\PROJECT\체육진흥공단 공모전\test\Mind-Fit\client\src\Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   LabelList,
// } from "recharts";

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await axios.get("/api/stats");
//         if (!mounted) return;
//         const all = Array.isArray(res.data) ? res.data : [];
//         // 하드코딩 필터: '20대' & 'M' (남자)
//         const filtered = all
//           .filter(
//             (d) =>
//               String(d.ageGroup).trim() === "20대" &&
//               ["M", "m", "남", "남자", "Male"].includes(String(d.gender).trim())
//           )
//           .map((d) => ({
//             metric: d.metric || d.name || d.ITEM_NM || "unknown",
//             mean: Number(String(d.mean).replace(/,/g, "")) || 0,
//           }));
//         setData(filtered);
//       } catch (e) {
//         setError(e.message || "데이터 로드 실패");
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) return <div>데이터 불러오는 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!data || data.length === 0) return <div>해당 조건의 데이터가 없습니다.</div>;

//   return (
//     <div style={{ width: "100%", height: 360 }}>
//       <ResponsiveContainer>
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="metric" interval={0} angle={-20} textAnchor="end" height={60} />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="mean" fill="#1976d2" barSize={40}>
//             <LabelList dataKey="mean" position="top" formatter={(val) => (Number.isFinite(val) ? val : "")} />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }