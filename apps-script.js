function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found'}))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({'Access-Control-Allow-Origin': '*'});
    }
    var data = sheet.getDataRange().getValues();

    // Assuming first row is headers: nom, stock, image
    var headers = data[0];
    var jsonData = data.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(header, index) {
        obj[header.toLowerCase()] = row[index];
      });
      return obj;
    });

    return ContentService
      .createTextOutput(JSON.stringify(jsonData))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({'Access-Control-Allow-Origin': '*'});
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({error: e.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({'Access-Control-Allow-Origin': '*'});
  }
}