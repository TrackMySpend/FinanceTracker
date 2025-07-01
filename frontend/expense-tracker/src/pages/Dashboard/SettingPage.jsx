import React from 'react';
import { useThemeStore } from '../store/useThemeStore'; // same theme store
import { LogOut, Palette } from 'lucide-react';
import DashboardLayout from '../../components/layouts/DashboardLayout'; 

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter",
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  const handleLogout = () => {
    localStorage.removeItem('token'); // JWT cleanup
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <DashboardLayout activeMenu="Settings"> {/* ✅ Wrap with layout */}
      <div className="container mx-auto px-4 pt-10 max-w-5xl">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <div className="grid gap-10">
          {/* Theme Selection */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Palette size={20} />
              <h2 className="text-lg font-semibold">Theme</h2>
            </div>
            <p className="text-sm text-base-content/70 mb-4">
              Choose a theme for your expense tracker interface
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                    theme === t ? "bg-base-200" : "hover:bg-base-200/50"
                  }`}
                  onClick={() => setTheme(t)}
                >
                  <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium truncate w-full text-center">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Preview Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="rounded-xl border border-base-300 bg-base-100 shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat">
                <div className="stat-title">Total Balance</div>
                <div className="stat-value text-primary">$12,500</div>
              </div>
              <div className="stat">
                <div className="stat-title">Income</div>
                <div className="stat-value text-success">$8,000</div>
              </div>
              <div className="stat">
                <div className="stat-title">Expenses</div>
                <div className="stat-value text-error">$3,500</div>
              </div>
            </div>
          </section>

          {/* Logout Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            <button
              onClick={handleLogout}
              className="btn btn-error text-white gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
