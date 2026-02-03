/**
 * Google Apps Script for Pixel Quiz Game
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Copy this code into Code.gs.
 * 4. Save and Deploy > New Deployment > Type: Web App.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone.
 * 7. Copy the Web App URL and set it as VITE_GOOGLE_APP_SCRIPT_URL in your .env file.
 */

function doGet(e) {
    const action = e.parameter.action;

    if (action === 'getQuestions') {
        return getQuestions(e.parameter.count);
    }

    return ContentService.createTextOutput("Invalid Action");
}

function doPost(e) {
    // Handle POST requests (Submit Result)
    try {
        const params = e.parameter; // For x-www-form-urlencoded
        const action = params.action;

        if (action === 'submitResult') {
            const data = JSON.parse(params.data);
            return submitResult(data);
        }

        return ContentService.createTextOutput(JSON.stringify({ error: "Invalid Action" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function getQuestions(count) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
    const data = sheet.getDataRange().getValues();
    const headers = data[0]; // Assuming row 1 is headers
    const rows = data.slice(1);

    // Basic shuffle
    const shuffled = rows.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count || 5);

    const questions = selected.map(row => {
        // Dictionary mapping assuming columns: ID, Question, A, B, C, D, Answer
        // Ideally use headers to map, but hardcoding for simplicity based on request
        return {
            id: row[0],
            question: row[1],
            options: [row[2], row[3], row[4], row[5]],
            answer: row[6]
        };
    });

    return ContentService.createTextOutput(JSON.stringify(questions))
        .setMimeType(ContentService.MimeType.JSON);
}

function submitResult(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
    const id = data.user;
    const score = data.score; // Current score
    const isPass = data.passed;

    // Columns: ID, 闖關次數, 總分(Cumulative?), 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間
    // Let's assume:
    // Col A: ID
    // Col B: Play Count
    // Col C: Total Accumulated Score (or just Last Score? Request says "總分" which usually means sum or last. Let's assume Sum for now or just Last. Context implies "成績計算...並記錄". Let's update stats.)
    // Col D: High Score
    // Col E: First Pass Score (Only set if first time pass)
    // Col F: Attempts until Pass (Set when passed)
    // Col G: Last Play Time

    const allData = sheet.getDataRange().getValues();
    let rowIndex = -1;

    // Find user row (skip header)
    for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] == id) {
            rowIndex = i + 1; // 1-based index for getRange
            break;
        }
    }

    const timestamp = new Date();

    if (rowIndex === -1) {
        // New User
        const newRow = [
            id,
            1, // Play Count
            score, // Total Score (Initial)
            score, // High Score
            isPass ? score : "", // First Pass Score
            isPass ? 1 : "", // Attempts to Pass
            timestamp
        ];
        sheet.appendRow(newRow);
    } else {
        // Existing User
        const rowRange = sheet.getRange(rowIndex, 1, 1, 7);
        const rowValues = rowRange.getValues()[0];

        let playCount = rowValues[1] + 1;
        let totalScore = rowValues[2] + score; // Accumulate? Or Replace? Let's Accumulate.
        let highScore = Math.max(rowValues[3], score);
        let firstPassScore = rowValues[4];
        let attemptsToPass = rowValues[5];

        if (isPass && firstPassScore === "") {
            firstPassScore = score;
            attemptsToPass = playCount;
        }

        // Update Row
        // ID, Count, Total, High, FirstPass, Attempts, Time
        rowRange.setValues([[id, playCount, totalScore, highScore, firstPassScore, attemptsToPass, timestamp]]);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
}
