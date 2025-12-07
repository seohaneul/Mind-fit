import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 키 가져오기
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Gemini 클라이언트 생성
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiPrescription = async (weakness, mood) => {
  try {
    // 빠르고 똑똑한 'gemini-1.5-flash' 모델 사용 (가장 추천!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. 프롬프트(질문) 만들기
    const prompt = `
      역할: 당신은 국민체육진흥공단 데이터를 기반으로 운동을 처방해주는 친절한 트레이너 '마인드-핏'입니다.
      상황: 사용자는 신체 능력 중 [${weakness}]이(가) 부족하고, 현재 기분은 [${mood}] 상태입니다.
      요청:
      1. 사용자의 기분에 공감하고 사용자의 상황에 맞는 운동을 추천하는 메시지를 작성하세요. (3줄 이내, 다정하고 전문적임)
      2. 추천한 운동과 관련된 핵심 키워드(운동 종목)를 1~2개 추출하세요. (예: ["요가", "필라테스"], ["수영"], ["헬스"])
      3. 반드시 아래 JSON 형식으로만 답변하세요. 다른 말은 포함하지 마세요.
      {
        "prescription": "여기에 처방 메시지 내용을 입력하세요",
        "keywords": ["키워드1", "키워드2"]
      }
    `;

    // 4. AI에게 질문 던지기
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱 시도
    try {
      const cleanText = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanText);
      return data;
    } catch (e) {
      console.error("Gemini JSON Parsing Error:", e);
      return {
        prescription: text,
        keywords: []
      };
    }
  } catch (error) {
    console.error("Gemini API 오류:", error);
    return {
      prescription: "AI 트레이너가 잠시 운동하러 갔나 봐요 🏃. \n가벼운 스트레칭으로 시작해보는 건 어때요?",
      keywords: ["스트레칭", "산책"]
    };
  }
};
