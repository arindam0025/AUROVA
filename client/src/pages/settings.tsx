import React from "react";
export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-300 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 border border-gray-200">
        <div className="flex items-center mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full shadow-lg mr-4">
            <i className="fas fa-cog text-white text-2xl"></i>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        </div>
        <p className="text-lg text-gray-700 mb-6">Manage your account, preferences, and notification settings here.</p>
        <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Account</h2>
          <p className="text-gray-700">Update your profile, change password, and configure preferences.</p>
        </div>
      </div>
    </div>
  );
}
