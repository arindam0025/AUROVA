import React from "react";
export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-200 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 border border-purple-200">
        <div className="flex items-center mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full shadow-lg mr-4">
            <i className="fas fa-chart-line text-white text-2xl"></i>
          </span>
          <h1 className="text-3xl font-extrabold text-purple-900 tracking-tight">Analytics & Insights</h1>
        </div>
        <p className="text-lg text-purple-700 mb-6">Visualize your portfolio performance, sector allocation, and risk analysis with interactive charts.</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-xl p-6 shadow-md border border-purple-100">
            <h2 className="text-xl font-bold text-purple-800 mb-2">Performance</h2>
            <p className="text-2xl font-extrabold text-purple-900">+8.2% YTD</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 shadow-md border border-purple-100">
            <h2 className="text-xl font-bold text-purple-800 mb-2">Risk Level</h2>
            <p className="text-2xl font-extrabold text-purple-900">Medium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
