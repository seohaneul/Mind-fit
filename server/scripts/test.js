const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Facility = require("../model/Facility"); // 모델 경로 확인 필요

// DB 연결 (로컬 테스트용 주소)
mongoose
  .connect("mongodb://127.0.0.1:27017/mindfit")
  .then(() => console.log("DB 연결됨"))
  .catch((err) => console.log("DB 연결 실패:", err));

const results = [];
const csvPath = path.join(__dirname, "../data/kspo_facilities.csv"); // 파일 경로

fs.createReadStream(csvPath)
  .pipe(csv({ bom: true })) // (혹시 몰라 안전장치 하나만 남겨둠)
  .on("data", (data) => {
    // 1. [핵심] 키 이름에 '유령 글자'가 있든 없든, 'FCLTY_NM'이 포함된 진짜 키를 찾는다!
    const realNameKey = Object.keys(data).find((key) =>
      key.includes("FCLTY_NM")
    );

    // 2. 찾은 키로 값을 꺼낸다. (키를 못 찾았으면 건너뜀)
    if (!realNameKey || !data[realNameKey]) {
      return;
    }
    console.log(data);

    // 3. 데이터 저장
    // results.push({
    //   facilityName: data[realNameKey], // 진짜 키 사용!
    //   address: data["FCLTY_ADDR_ONE_NM"] || data["RDNMADR_NM"] || "",
    //   latitude: Number(data["FCLTY_LA"]) || 0,
    //   longitude: Number(data["FCLTY_LO"]) || 0,
    //   location: {
    //     type: "Point",
    //     coordinates: [
    //       Number(data["FCLTY_LO"]) || 0,
    //       Number(data["FCLTY_LA"]) || 0,
    //     ],
    //   },
    // });
  });
