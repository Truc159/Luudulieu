
import React, { useState } from 'react';

interface SetupGuideProps {
  currentUrl: string;
  onSave: (url: string) => void;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ currentUrl, onSave }) => {
  const [url, setUrl] = useState(currentUrl);

  const scriptCode = `function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var action = e.parameter.action;
  
  if (action == "read") {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    var result = rows.map(function(row) {
      var obj = {};
      headers.forEach(function(header, i) {
        obj[header] = row[i];
      });
      return obj;
    });
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var postData = JSON.parse(e.postData.contents);
  
  if (postData.action == "create") {
    var student = postData.data;
    var headers = sheet.getDataRange().getValues()[0];
    
    // Ensure headers exist
    if (sheet.getLastRow() == 0) {
      headers = ["id", "fullName", "className", "dob", "createdAt"];
      sheet.appendRow(headers);
    }
    
    var row = headers.map(function(h) { return student[h] || ""; });
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-slate-100 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cấu Hình Google Sheets</h2>
        <p className="text-slate-600">Để ứng dụng hoạt động, bạn cần thiết lập Google Apps Script làm cầu nối.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">Web App URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="https://script.google.com/macros/s/.../exec"
          />
          <button
            onClick={() => onSave(url)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            Lưu URL
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <i className="fas fa-terminal mr-2 text-slate-600"></i>
          Hướng dẫn 3 bước:
        </h3>
        <ol className="list-decimal list-inside space-y-4 text-slate-700 text-sm">
          <li>
            Tạo một <strong>Google Sheet</strong> mới.
          </li>
          <li>
            Vào menu <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.
          </li>
          <li>
            Dán đoạn code dưới đây vào và <strong>Triển khai (Deploy)</strong> dưới dạng <strong>Ứng dụng web (Web App)</strong>. 
            <br/><span className="text-indigo-600 ml-5 font-medium">Lưu ý: Chọn "Who has access" là "Anyone".</span>
          </li>
        </ol>
        <div className="mt-4">
          <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed max-h-60">
            <code>{scriptCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SetupGuide;
