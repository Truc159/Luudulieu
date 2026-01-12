
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Uses Gemini to properly capitalize and format a student's name
   */
  async formatName(name: string): Promise<string> {
    if (!name || name.length < 2) return name;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Hành động: Chuẩn hóa tên tiếng Việt.
Dữ liệu đầu vào: "${name}"
Yêu cầu: 
1. Viết hoa chữ cái đầu mỗi từ.
2. Loại bỏ khoảng trắng thừa ở đầu, cuối và giữa các từ.
3. Giữ đúng các dấu tiếng Việt.
Trả về kết quả dưới dạng JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              formattedName: { type: Type.STRING }
            },
            required: ["formattedName"]
          }
        }
      });
      
      const result = JSON.parse(response.text);
      return result.formattedName || name;
    } catch (error) {
      console.error("Gemini Name Formatting Error:", error);
      return name;
    }
  },

  /**
   * Generates insights based on student data
   */
  async getInsights(studentsCount: number, classCount: number): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Bạn là một trợ lý quản lý giáo dục. Hãy viết 1 câu nhận xét ngắn gọn, tích cực (dưới 20 từ) về tình hình dữ liệu: có ${studentsCount} học sinh tại ${classCount} lớp.`,
      });
      return response.text || "Dữ liệu đã sẵn sàng!";
    } catch (error) {
      return "Hệ thống đang hoạt động ổn định.";
    }
  }
};
