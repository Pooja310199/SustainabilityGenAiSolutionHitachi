// "use client";

// import React from "react";

// function PdfAnalysisSection({ documentData }) {
//   if (!documentData?.report) return null;

//   const { report, message } = documentData;

//   return (
//     <div className="border rounded-xl bg-white shadow-sm p-5">
//       <h2 className="text-lg font-semibold mb-4">Partner Document Analysis</h2>

//       <div className="grid grid-cols-2 gap-4 mb-5">
//         <div>
//           <strong>Document:</strong> {report.document_name}
//         </div>

//         <div>
//           <strong>Severity:</strong> {report.severity}
//         </div>

//         <div>
//           <strong>Total Score:</strong> {report.total_score}
//         </div>

//         <div>
//           <strong>Max Score:</strong> {report.max_score}
//         </div>

//         <div>
//           <strong>Percentage:</strong> {report.percentage}%
//         </div>

//         <div>
//           <strong>Maturity:</strong> {report.maturity_level}
//         </div>
//       </div>

//       <div className="mb-5">
//         <strong>Message:</strong> {message}
//       </div>

//       <h3 className="font-semibold mb-3">Sections</h3>

//       {report.sections?.map((section, index) => (
//         <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
//           <div>
//             <strong>Category:</strong> {section.category}
//           </div>

//           <div>
//             <strong>Score:</strong> {section.total_score}/{section.max_score}
//           </div>

//           <div>
//             <strong>Percentage:</strong> {section.percentage}%
//           </div>

//           {section.evaluations?.map((evaluation, idx) => (
//             <div key={idx} className="mt-3 border-l-4 border-blue-500 pl-3">
//               <div>
//                 <strong>Category:</strong> {evaluation.category}
//               </div>

//               <div>
//                 <strong>Question:</strong> {evaluation.query}
//               </div>

//               <div>
//                 <strong>Answer:</strong> {evaluation.answer}
//               </div>

//               <div>
//                 <strong>Result:</strong> {evaluation.result}
//               </div>

//               <div>
//                 <strong>Score:</strong> {evaluation.score}
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}

//       <h3 className="font-semibold mb-3 mt-5">Overall Evaluations</h3>

//       {report.evaluations?.map((evaluation, index) => (
//         <div key={index} className="border rounded-lg p-4 mb-3">
//           <div>
//             <strong>Category:</strong> {evaluation.category}
//           </div>

//           <div>
//             <strong>Question:</strong> {evaluation.query}
//           </div>

//           <div>
//             <strong>Answer:</strong> {evaluation.answer}
//           </div>

//           <div>
//             <strong>Result:</strong> {evaluation.result}
//           </div>

//           <div>
//             <strong>Score:</strong> {evaluation.score}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default React.memo(PdfAnalysisSection);

"use client";

import React from "react";

function PdfAnalysisSection({ documentData }) {
  if (!documentData?.report) return null;

  const { report, message } = documentData;

  const getResultClass = (result) => {
    const value = result?.toLowerCase() || "";

    if (
      value.includes("pass") ||
      value.includes("yes") ||
      value.includes("compliant")
    ) {
      return "bg-gray-100 text-gray-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Partner Document Analysis
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Document</p>
          <p className="font-semibold text-gray-800 break-words">
            {report.document_name}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Severity</p>
          <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            {report.severity}
          </span>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Maturity Level</p>
          <p className="font-semibold text-gray-800">{report.maturity_level}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Score</p>
          <p className="text-2xl font-bold text-gray-600">
            {report.total_score}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Max Score</p>
          <p className="text-2xl font-bold text-gray-600">{report.max_score}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Percentage</p>
          <p className="text-2xl font-bold text-gray-600">
            {report.percentage}%
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-gray-900 mb-1">Analysis Summary</h3>
          <p className="text-gray-700">{message}</p>
        </div>
      )}

      {/* Sections */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Section Analysis
      </h3>

      <div className="space-y-6">
        {report.sections?.map((section, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl shadow-sm overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gray-100 border-b p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold text-gray-800">
                    {section.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="font-semibold text-gray-600">
                    {section.total_score}/{section.max_score}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Percentage</p>
                  <p className="font-semibold text-gray-600">
                    {section.percentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* Evaluations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b font-semibold">
                      Category
                    </th>
                    <th className="text-left p-3 border-b font-semibold">
                      Question
                    </th>
                    <th className="text-left p-3 border-b font-semibold">
                      Answer
                    </th>
                    <th className="text-left p-3 border-b font-semibold">
                      Result
                    </th>
                    <th className="text-left p-3 border-b font-semibold">
                      Score
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {section.evaluations?.map((evaluation, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 border-b">{evaluation.category}</td>

                      <td className="p-3 border-b max-w-xs">
                        {evaluation.query}
                      </td>

                      <td className="p-3 border-b max-w-xs">
                        {evaluation.answer}
                      </td>

                      <td className="p-3 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getResultClass(
                            evaluation.result,
                          )}`}
                        >
                          {evaluation.result}
                        </span>
                      </td>

                      <td className="p-3 border-b font-semibold">
                        {evaluation.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Evaluations */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Overall Evaluations
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {report.evaluations?.map((evaluation, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-gray-800">
                  {evaluation.category}
                </h4>

                <span className="bg-indigo-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  Score: {evaluation.score}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">Question</p>
                  <p className="text-gray-600">{evaluation.query}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Answer</p>
                  <p className="text-gray-600">{evaluation.answer}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1">Result</p>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getResultClass(
                      evaluation.result,
                    )}`}
                  >
                    {evaluation.result}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PdfAnalysisSection);
