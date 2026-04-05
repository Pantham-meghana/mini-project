// src/pages/Settings.jsx
export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-white mb-1">API Base URL</h2>
          <p className="text-slate-400 text-sm mb-3">Configure the backend URL in your <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 text-xs">.env</code> file.</p>
          <div className="bg-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-slate-300">
            VITE_API_URL=http://localhost:8080/api
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6">
          <h2 className="font-semibold text-white mb-1">Survey Public URL Format</h2>
          <p className="text-slate-400 text-sm mb-3">Share this URL pattern with respondents:</p>
          <div className="bg-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-slate-300">
            {window.location.origin}/survey/&#123;publicId&#125;
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6">
          <h2 className="font-semibold text-white mb-1">Version</h2>
          <p className="text-slate-400 text-sm">SurveyFlow v1.0.0 · React + Spring Boot</p>
        </div>
      </div>
    </div>
  );
}
