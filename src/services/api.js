import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock Data
const MOCK_QUESTIONS = [
  { id: 1, question: "Pixel Art 最早起源於哪個年代？", options: ["1970s", "1980s", "1990s", "2000s"], answer: "1970s" },
  { id: 2, question: "任天堂紅白機 (NES) 的解析度是多少？", options: ["256x240", "320x240", "1920x1080", "640x480"], answer: "256x240" },
  { id: 3, question: "以下哪個不是 Pixel Art 常用的繪圖軟體？", options: ["Aseprite", "Photoshop", "Maya", "MS Paint"], answer: "Maya" },
  { id: 4, question: "在 Pixel Art 中，避免「孤立像素」(Jaggies) 是為了？", options: ["增加雜訊", "讓線條更平滑", "增加檔案大小", "讓顏色更鮮豔"], answer: "讓線條更平滑" },
  { id: 5, question: "Mega Man (洛克人) 是哪一家公司的遊戲？", options: ["SEGA", "Nintendo", "Capcom", "Konami"], answer: "Capcom" },
  { id: 6, question: "經典遊戲《小精靈》的主角是什麼顏色？", options: ["紅色", "藍色", "黃色", "綠色"], answer: "黃色" },
  { id: 7, question: "Game Boy 的螢幕能顯示幾種灰階顏色？", options: ["2種", "4種", "16種", "256種"], answer: "4種" },
  { id: 8, question: "Pixel Art 的靈魂在於？", options: ["高解析度", "每個像素的精確控制", "3D 渲染", "向量圖形"], answer: "每個像素的精確控制" }
];

export const getQuestions = async (count = 5) => {
  if (!API_URL) {
    console.warn("No API URL provided, using mock data.");
    const shuffled = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(q => {
        // Remove answer from frontend object if possible, but for mock it's fine.
        // In real app, backend shouldn't send answer if we want security, 
        // but often for simple games it sends it and we check on client or verify on server.
        // For GAS, usually we check on client for simplicity or create a verify endpoint.
        // Let's assume we get the answer for immediate feedback.
        return q;
    });
  }
  try {
    // App Script GET usually returns JSON
    const response = await axios.get(`${API_URL}?action=getQuestions&count=${count}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    // Fallback to mock on error? Or just throw.
    throw error;
  }
};

export const submitResult = async (data) => {
   // data: { id, score, total, pass, etc. }
  if (!API_URL) {
     console.warn("No API URL provided, mocking submission:", data);
     return { success: true };
  }
  try {
    // Use URLSearchParams for simple POST to Google Apps Script
    // This avoids CORS preflight issues often seen with JSON
    const params = new URLSearchParams();
    params.append('action', 'submitResult');
    params.append('data', JSON.stringify(data));

    const response = await axios.post(API_URL, params);
    return response.data;
  } catch (error) {
    console.error("Failed to submit result:", error);
    throw error;
  }
}
