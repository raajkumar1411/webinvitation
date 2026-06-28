/**
 * Google Apps Script - Wedding RSVP Sheets Integration
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new sheet named "RSVP Responses" or use the active spreadsheet.
 * 3. Go to "Extensions" > "Apps Script".
 * 4. Clear any existing code in the editor and paste this code.
 * 5. Click the "Save" icon (disk) or press Ctrl+S.
 * 6. Click "Deploy" > "New deployment".
 * 7. Choose type "Web app".
 * 8. Set Configuration:
 *    - Description: Wedding RSVP backend
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (crucial so the website can submit data)
 * 9. Click "Deploy". Grant permissions if requested.
 * 10. Copy the "Web app URL" and paste it in `app.js` under the `GOOGLE_SCRIPT_URL` variable.
 */

// Handle incoming POST requests from the RSVP form
function doPost(e) {
  try {
    // Open the active spreadsheet or spreadsheet by ID
    var doc = SpreadsheetApp.openById("1tZL04xUW7t3x6kb7-PvdE-VRhZCZ8ElT_-2vKObK-cM");
    var sheetName = "RSVP Responses";
    var sheet = doc.getSheetByName(sheetName);
    
    // Create the sheet with header columns if it doesn't exist yet
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      sheet.appendRow([
        "Timestamp", 
        "Name", 
        "Phone Number", 
        "Email", 
        "Guest Count", 
        "City", 
        "Attendance Status", 
        "Blessing Message"
      ]);
      // Format header row (Bold and Gold/Maroon themed coloring)
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#800020").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Parse form parameters from the incoming post data
    var parameter = e.parameter;
    
    var timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    var name = parameter.name ? parameter.name.trim() : "";
    var phone = parameter.phone ? parameter.phone.trim() : "";
    var email = parameter.email ? parameter.email.trim() : "";
    var guestCount = parameter.guestCount ? parameter.guestCount : "1";
    var city = parameter.city ? parameter.city.trim() : "";
    var attendanceStatus = parameter.attendanceStatus ? parameter.attendanceStatus : "Yes";
    var blessingMessage = parameter.blessingMessage ? parameter.blessingMessage.trim() : "";
    
    // Basic server-side verification
    if (name === "" || phone === "" || city === "") {
      return ContentService
        .createTextOutput(JSON.stringify({ "result": "error", "error": "Missing required fields" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Server-side Anti-Duplication Check: Check if phone number already exists in Column C
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var phoneValues = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var i = 0; i < phoneValues.length; i++) {
        if (phoneValues[i][0].toString().trim() === phone) {
          return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": "Duplicate entry blocked" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // Append the row containing response data
    sheet.appendRow([
      timestamp,
      name,
      "'" + phone, // Prefix with single quote to prevent Google Sheets from truncating leading zeros or converting numbers to scientific notation
      email,
      guestCount,
      city,
      attendanceStatus,
      blessingMessage
    ]);
    
    // Return success response to the client
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (fallback/test hook)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "result": "success", "message": "RSVP Sheets Web Service is active!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
