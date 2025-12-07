const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

// ---------------------------------------------------------
// 1. 모델 가져오기 (경로가 model인지 models인지 꼭 확인!)
// ---------------------------------------------------------
const Stat = require("../model/stat.js");

// ---------------------------------------------------------
// 2. DB 연결
// ---------------------------------------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/mindfit")
  .then(() => console.log("✅ MongoDB 연결 성공! 작업 시작...\n"))
  .catch((err) => {
    console.log("❌ DB 연결 실패:", err);
    process.exit(1);
  });

// ---------------------------------------------------------
// 3. 헬퍼 함수 (유령 글자 / 다양한 헤더 이름 찾기)
// ---------------------------------------------------------
function findKey(row, candidates) {
  const keys = Object.keys(row);
  for (const candidate of candidates) {
    // "FCLTY_NM"이 포함된 키를 찾음 (따옴표, 유령문자 무시)
    const found = keys.find((k) => k.includes(candidate));
    if (found) return found;
  }
  return null;
}

function getVal(row, candidates) {
  const key = findKey(row, candidates);
  return key ? row[key] : null;
}

function getNum(row, candidates) {
  const val = getVal(row, candidates);
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

// ---------------------------------------------------------
// 4. 각 데이터별 임포트 함수
// ---------------------------------------------------------
//
// (3) 통계 데이터 (Stats) - Raw 데이터 분석 및 평균 산출
async function importStats() {
  const filePath = path.join(__dirname, "../data/kspo_measurements.csv");
  if (!fs.existsSync(filePath))
    return {
      name: "통계",
      count: 0,
      status: "파일 없음 (kspo_measurements.csv 확인) ❌",
    };

  const groups = {}; // 그룹별 합계 저장 { "20대_M": { ... } }
  const stream = fs.createReadStream(filePath).pipe(csv());

  for await (const row of stream) {
    // 연령대 & 성별 추출
    const ageRaw = getVal(row, ["MESURE_AGE_CO", "AG", "연령"]);
    const sexRaw = getVal(row, ["SEXDSTN_FLAG_CD", "SEX", "성별"]);

    // console.log(ageRaw, sexRaw);

    if (!ageRaw || !sexRaw) continue;

    // 연령대 정규화 (숫자만 있는 경우: 17 -> "10대", 25 -> "20대")
    const ageNum = parseInt(ageRaw, 10); // 문자를 숫자로 변환 ("17" -> 17)

    // 숫자가 아니거나 엉뚱한 값이면 건너뜀
    if (isNaN(ageNum)) continue;

    let ageGroup = "기타";

    if (ageNum >= 10 && ageNum < 20) ageGroup = "10대";
    else if (ageNum >= 20 && ageNum < 30) ageGroup = "20대";
    else if (ageNum >= 30 && ageNum < 40) ageGroup = "30대";
    else if (ageNum >= 40 && ageNum < 50) ageGroup = "40대";
    else if (ageNum >= 50 && ageNum < 60) ageGroup = "50대";
    else if (ageNum >= 60 && ageNum < 70) ageGroup = "60대";
    else continue; // 10세 미만이나 70세 이상은 통계에서 제외

    const groupKey = `${ageGroup}_${sexRaw}`;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        bmi: { s: 0, c: 0 },
        fat: { s: 0, c: 0 },
        grip: { s: 0, c: 0 },
        situp: { s: 0, c: 0 },
        flex: { s: 0, c: 0 },
      };
    }

    // 데이터 누적 (하늘이 명세서 코드 기준)
    const bmi = getNum(row, ["MESURE_IEM_018", "BMI"]);
    if (bmi > 10 && bmi < 50) {
      groups[groupKey].bmi.s += bmi;
      groups[groupKey].bmi.c++;
    }

    const fat = getNum(row, ["MESURE_IEM_003", "체지방"]);
    if (fat > 3 && fat < 60) {
      groups[groupKey].fat.s += fat;
      groups[groupKey].fat.c++;
    }

    const grip = Math.max(
      getNum(row, ["MESURE_IEM_007", "악력_좌"]),
      getNum(row, ["MESURE_IEM_008", "악력_우"])
    );
    if (grip > 5) {
      groups[groupKey].grip.s += grip;
      groups[groupKey].grip.c++;
    }

    const situp = Math.max(
      getNum(row, ["MESURE_IEM_019", "교차윗몸"]),
      getNum(row, ["MESURE_IEM_009", "윗몸말아"])
    );
    if (situp > 0) {
      groups[groupKey].situp.s += situp;
      groups[groupKey].situp.c++;
    }

    const flex = getNum(row, ["MESURE_IEM_012", "앉아윗몸"]);
    if (flex > -50 && flex < 50) {
      groups[groupKey].flex.s += flex;
      groups[groupKey].flex.c++;
    }
  }

  // 평균 계산 후 DB 저장용 배열 생성
  const results = [];
  for (const [key, val] of Object.entries(groups)) {
    const [age, gender] = key.split("_");
    if (val.bmi.c > 5)
      results.push({
        metric: "BMI",
        ageGroup: age,
        gender,
        mean: (val.bmi.s / val.bmi.c).toFixed(1),
      });
    if (val.fat.c > 5)
      results.push({
        metric: "체지방률",
        ageGroup: age,
        gender,
        mean: (val.fat.s / val.fat.c).toFixed(1),
      });
    if (val.grip.c > 5)
      results.push({
        metric: "악력",
        ageGroup: age,
        gender,
        mean: (val.grip.s / val.grip.c).toFixed(1),
      });
    if (val.situp.c > 5)
      results.push({
        metric: "윗몸일으키기",
        ageGroup: age,
        gender,
        mean: Math.round(val.situp.s / val.situp.c),
      });
    if (val.flex.c > 5)
      results.push({
        metric: "유연성",
        ageGroup: age,
        gender,
        mean: (val.flex.s / val.flex.c).toFixed(1),
      });
  }

  if (results.length > 0) {
    await Stat.deleteMany({});
    await Stat.insertMany(results);
  }
  return {
    name: "통계 (Stats - Calculated)",
    count: results.length,
    status: "완료 ✅",
  };
}

// ---------------------------------------------------------
// 5. 메인 실행
// ---------------------------------------------------------
async function main() {
  console.log("🚀 데이터 임포트 작업을 시작합니다...\n");

  const report = [];

  try {
    report.push(await importStats());
  } catch (e) {
    console.error("🚨 작업 중 치명적 에러:", e);
  }

  // --- 📊 최종 리포트 출력 ---
  console.log("\n==========================================");
  console.log("       [Mind-Fit] 데이터 임포트 결과       ");
  console.log("==========================================");
  console.table(report); // <-- ⭐️ 여기가 하늘이가 원한 표!
  console.log("==========================================");

  if (report.some((r) => r.count > 0)) {
    console.log("\n✨ DB 업데이트가 성공적으로 끝났습니다!");
  } else {
    console.log(
      "\n⚠️ 저장된 데이터가 없습니다. 파일 경로와 내용을 확인하세요."
    );
  }

  await mongoose.connection.close();
}

main();
