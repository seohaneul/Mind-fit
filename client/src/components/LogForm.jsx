import React, { useState } from "react";
// import axios from "axios";

export default function LogForm() {
    const [values, setValues] = useState({
        악력: "",
        윗몸일으키기: "",
        유연성: "",
        BMI: "",
        체지방률: "",
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    // const toNumberOrNull = (v) => {
    //     if (v == null || v === "") return null;
    //     const n = Number(String(v).replace(/,/g, ""));
    //     return Number.isFinite(n) ? n : null;
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        // const metrics = {
        //     악력: toNumberOrNull(values["악력"]),
        //     윗몸일으키기: toNumberOrNull(values["윗몸일으키기"]),
        //     유연성: toNumberOrNull(values["유연성"]),
        //     BMI: toNumberOrNull(values["BMI"]),
        //     체지방률: toNumberOrNull(values["체지방률"]),
        // };
        setSaving(true);
        try {
            // await axios.post("/api/logs/physical", { metrics, date: new Date().toISOString() });
            alert("저장되었습니다!");
            // optionally clear or keep values
        } catch (err) {
            console.error(err);
            alert("저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm"
        >
            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">악력 (kg)</span>
                <input
                    name="악력"
                    value={values["악력"]}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
            </label>

            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">윗몸일으키기 (회)</span>
                <input
                    name="윗몸일으키기"
                    value={values["윗몸일으키기"]}
                    onChange={handleChange}
                    type="number"
                    step="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
            </label>

            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">유연성 (cm)</span>
                <input
                    name="유연성"
                    value={values["유연성"]}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
            </label>

            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">BMI</span>
                <input
                    name="BMI"
                    value={values["BMI"]}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
            </label>

            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">체지방률 (%)</span>
                <input
                    name="체지방률"
                    value={values["체지방률"]}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
            </label>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-center">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
                >
                    {saving ? "저장 중..." : "저장하기"}
                </button>
            </div>
        </form>
    );
}