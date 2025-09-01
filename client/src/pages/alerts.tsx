import React from "react";
export default function Alerts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-orange-200 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 border border-yellow-200">
        <div className="flex items-center mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full shadow-lg mr-4">
            <i className="fas fa-bell text-white text-2xl"></i>
          </span>
          <h1 className="text-3xl font-extrabold text-yellow-900 tracking-tight">Alerts & Notifications</h1>
        </div>
        <p className="text-lg text-yellow-700 mb-6">Stay updated with price alerts, portfolio changes, and important notifications.</p>
        <div className="bg-yellow-50 rounded-xl p-6 shadow-md border border-yellow-100">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">No new alerts</h2>
          <p className="text-yellow-700">You will see your alerts here as they arrive.</p>
        </div>
      </div>
    </div>
  );
}
