# 🎮 Pixel Art 闖關問答遊戲 (Pixel Quiz)

這是一個結合 **復古像素風格 (Pixel Art)** 與 **Google Sheets** 當作後台資料庫的網頁問答遊戲。
適合用於活動闖關、課堂測驗或趣味互動。

![Screenshot](https://api.dicebear.com/9.x/pixel-art/svg?seed=welcome&backgroundColor=b6e3f4)

## ✨ 特色

- **完全免費後台**：使用 Google Sheets 管理題目與成績，無需架設伺服器。
- **復古像素風**：內建精心設計的 8-bit UI、字體、**合成音效**與**震動特效**。
- **隨機關主**：串接 DiceBear API，每一關都有不同的像素怪獸/關主。
- **即時更新**：修改 Google Sheets 題目後，玩家刷新頁面即可看到新題目。
- **響應式設計**：支援電腦與手機遊玩。

---

## 🚀 快速開始 (Quick Start)

### 1. 安裝與執行
請確保電腦已安裝 [Node.js](https://nodejs.org/)。

```bash
# 下載專案後，進入目錄
cd pixel-game

# 安裝依賴套件
npm install

# 啟動本地開發伺服器
npm run dev
```
啟動後，瀏覽器打開 `http://localhost:5173` 即可遊玩。

### 2. 環境設定 (.env)
在專案根目錄建立 `.env` 檔案（如果沒有的話），並設定以下變數：

```env
VITE_GOOGLE_APP_SCRIPT_URL=你的_Google_Apps_Script_網址
VITE_PASS_THRESHOLD=3       # 通過門檻（答對幾題算過關）
VITE_QUESTION_COUNT=5       # 每次遊戲出的題目數量
```

---

## 🛠️ 後台架設指南 (Google Sheets Setup)

本遊戲的核心是 Google Sheets，請按照以下步驟完成設定：

### 步驟 1：建立試算表
1. 建立一個新的 Google Sheet。
2. 重新命名下方的兩個工作表 (Tabs)：
   - **`題目`** (原本的 Sheet1 改名)
   - **`回答`** (新增一個工作表)

### 步驟 2：設定欄位
- **`題目` 工作表**：
  - 第一列輸入標題：`ID`, `題目`, `A`, `B`, `C`, `D`, `解答`
  - 從第二列開始輸入您的題目資料。
- **`回答` 工作表**：
  - 第一列輸入標題：`ID`, `闖關次數`, `總分`, `最高分`, `第一次通關分數`, `花了幾次通關`, `最近遊玩時間`
  - 這一頁會由程式自動寫入，您只需準備好標題列。

### 步驟 3：部署程式碼 (Google Apps Script)
1. 在試算表中，點選選單 **擴充功能 (Extensions)** > **Apps Script**。
2. 將本專案 `src/google-apps-script/Code.js` 的內容完整複製貼上。
3. 點擊右上角 **部署 (Deploy)** > **新增部署 (New deployment)**。
4. 點擊齒輪圖示 ⚙️ > **網頁應用程式 (Web app)**。
5. 設定如下：
   - **說明**：Pixel Quiz API
   - **執行身分**：**我 (Me)**
   - **誰可以存取**：**任何人 (Anyone)** (⚠️ 重要！選錯會無法連線)
6. 點擊 **部署**，授權存取，並複製產生的 **網址 (Web app URL)**。
7. 將網址貼回 `.env` 檔案中的 `VITE_GOOGLE_APP_SCRIPT_URL`。

---

## 📦 部署上線 (Deployment)

當您開發完成後，可以將前端網頁部署到網路空間。

```bash
# 建置生產版本
npm run build
```
執行後會產生 `dist` 資料夾。您可以將此資料夾的內容上傳到：
- **GitHub Pages**
- **Vercel** (推薦，支援一鍵部署)
- **Netlify**

---

## 🎨 客製化指南

- **修改題目**：直接編輯 Google Sheet 的「題目」頁面。
- **修改過關標準**：修改 `.env` 中的 `VITE_PASS_THRESHOLD`。
- **修改樣式**：編輯 `src/styles/App.css`，這是主要的像素風格定義檔。

---
*Built with React, Vite & Google Apps Script*
