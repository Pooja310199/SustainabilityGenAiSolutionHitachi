"use client";
import React, { useState } from "react";

export default function PDFUploader({ category }) {
  const [uploading, setUploading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    // ✅ MOCK RESPONSE (for now)
    setTimeout(() => {
      const mockData = {
        status: "success",
        category: category,
        document_name: file.name,
        summary: "Customer verification completed",
        risk_score: "Low",
        findings: [
          {
            title: "PAN Verification",
            summary: "PAN matched successfully",
          },
          {
            title: "Address Check",
            summary: "Address verified",
          },
        ],
      };

      setResponseData(mockData);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="mb-4">
      {/* Upload Button */}
      <div className="flex justify-end">
        <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition">
          {uploading ? "Uploading..." : "Upload PDF"}
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Response UI */}
      {responseData && (
        <div className="mt-4 border rounded-xl p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">PDF Analysis Result</h3>

          <div>
            <b>File:</b> {responseData.document_name}
          </div>
          <div>
            <b>Summary:</b> {responseData.summary}
          </div>
          <div>
            <b>Risk:</b> {responseData.risk_score}
          </div>

          <div className="mt-2">
            <b>Findings:</b>
            {responseData.findings.map((f, i) => (
              <div key={i} className="ml-2 mt-1">
                • {f.title}: {f.summary}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
