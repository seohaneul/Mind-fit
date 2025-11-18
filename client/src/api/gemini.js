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
      1. 사용자의 기분에 공감하는 위로 또는 격려의 한 마디를 해주세요.
      2. 부족한 능력과 기분을 고려해 공공체육시설에서 할 수 있는 운동 1가지를 추천해주세요.
      3. 답변은 줄바꿈을 적절히 사용하여 3줄 이내로, 다정하고 전문적인 말투로 해주세요.
    `;

    // 4. AI에게 질문 던지기
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API 오류:", error);
    return "AI 트레이너가 잠시 운동하러 갔나 봐요 🏃. \n가벼운 스트레칭으로 시작해보는 건 어때요?";
  }
};
