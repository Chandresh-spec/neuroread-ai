import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Flame,
  LogOut,
  ChevronRight,
  Highlighter,
  Accessibility,
  Settings,
  ArrowLeft,
  Check,
} from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  onOpenPreferences,
  onOpenHighlights,
}) {
  const [viewMode, setViewMode] = useState('main');
  const [displayName, setDisplayName] = useState('Alex Morgan');
  const [dailyGoalDays, setDailyGoalDays] = useState(5);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setViewMode('main');
    onClose();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setViewMode('main');
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all"
      onClick={handleClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#FAF8F5] border-t sm:border border-[#E5DFD3] rounded-t-[28px] sm:rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 bg-[#D6CFC2] rounded-full mx-auto mb-4 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close profile"
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#6B665F] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {viewMode === 'settings' ? (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <button
              type="button"
              onClick={() => setViewMode('main')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3A2AD9] hover:underline transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </button>

            <div>
              <h3 className="font-editorial text-xl font-bold text-[#141416] tracking-tight">Settings</h3>
              <p className="text-xs text-[#6B665F] mt-0.5">
                Manage your profile details and reading goals.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141416] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white border border-[#DED8CB] rounded-xl px-3.5 py-2 text-xs text-[#141416] focus:outline-none focus:border-[#3A2AD9]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-bold text-[#141416]">Weekly Reading Goal</label>
                <span className="font-mono font-bold text-[#3A2AD9]">{dailyGoalDays} days / wk</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={dailyGoalDays}
                onChange={(e) => setDailyGoalDays(Number(e.target.value))}
                className="w-full accent-[#3A2AD9]"
              />
            </div>

            <div className="flex items-center justify-between bg-white border border-[#E5DFD3] rounded-xl p-3">
              <div>
                <p className="text-xs font-bold text-[#141416]">Reading Reminders</p>
                <p className="text-[11px] text-[#6B665F]">Gentle daily streak notifications</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  emailNotifications ? 'bg-[#3A2AD9]' : 'bg-[#D6CFC2]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    emailNotifications ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </form>
        ) : (
          <>
            {/* User Card */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80"
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#3A2AD9]"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#FAF8F5] rounded-full" />
              </div>
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#141416] tracking-tight leading-tight">
                  {displayName}
                </h3>
                <p className="text-xs text-[#6B665F] font-medium mt-0.5">
                  alex.morgan@neuroread.app
                </p>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3DFFA] text-[#3A2AD9]">
                  Inclusive Library Member
                </span>
              </div>
            </div>

            {/* Quick Reading Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
              <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3">
                <BookOpen className="w-4 h-4 text-[#3A2AD9] mx-auto mb-1" />
                <p className="text-base font-black text-[#141416]">12</p>
                <p className="text-[10px] text-[#6B665F] font-medium">Books Read</p>
              </div>
              <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3">
                <Clock className="w-4 h-4 text-[#193B32] mx-auto mb-1" />
                <p className="text-base font-black text-[#141416]">48h</p>
                <p className="text-[10px] text-[#6B665F] font-medium">Listening</p>
              </div>
              <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3">
                <Flame className="w-4 h-4 text-[#B8542C] mx-auto mb-1" />
                <p className="text-base font-black text-[#141416]">{dailyGoalDays} Days</p>
                <p className="text-[10px] text-[#6B665F] font-medium">Goal</p>
              </div>
            </div>

            {/* Menu Shortcuts: Highlights, Accessibility, Settings */}
            <div className="space-y-2 mb-6">
              <button
                onClick={() => {
                  handleClose();
                  onOpenHighlights?.();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#E5DFD3] text-[#141416] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Highlighter className="w-4 h-4 text-[#3A2AD9]" />
                  <span className="text-xs font-bold">Highlights</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#E3DFFA] text-[#3A2AD9] text-[10px] font-bold">
                    6 saved
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C867E]" />
                </div>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onOpenPreferences?.();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#E5DFD3] text-[#141416] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Accessibility className="w-4 h-4 text-[#3A2AD9]" />
                  <span className="text-xs font-bold">Accessibility</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C867E]" />
              </button>

              <button
                onClick={() => setViewMode('settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#E5DFD3] text-[#141416] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-[#5E5A54]" />
                  <span className="text-xs font-bold">Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C867E]" />
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                handleClose();
                alert('Logging out...');
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
