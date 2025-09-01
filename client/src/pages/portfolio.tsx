import React from "react";
export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 border border-blue-200">
        <div className="flex items-center mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg mr-4">
            <i className="fas fa-briefcase text-white text-2xl"></i>
          </span>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Your Portfolio</h1>
        </div>
        <p className="text-lg text-blue-700 mb-6">Track your investments, view holdings, and analyze your portfolio performance in real time.</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 shadow-md border border-blue-100">
            <h2 className="text-xl font-bold text-blue-800 mb-2">Total Value</h2>
            <p className="text-2xl font-extrabold text-blue-900">$25,000</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow-md border border-blue-100">
            <h2 className="text-xl font-bold text-blue-800 mb-2">Total Return</h2>
            <p className="text-2xl font-extrabold text-blue-900">+12.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
