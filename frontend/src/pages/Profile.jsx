// src/pages/Profile.jsx
import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { admin } = useAuth();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {admin?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{admin?.fullName}</p>
            <p className="text-slate-400">{admin?.email}</p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Full Name', value: admin?.fullName },
            { label: 'Email', value: admin?.email },
            { label: 'Role', value: 'Administrator' },
            { label: 'Account ID', value: `#${admin?.id}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className="text-white text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
