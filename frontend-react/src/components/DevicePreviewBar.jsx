import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export default function DevicePreviewBar({
  currentDevice,
  setDevice,
}) {
  const devices = [
    { id: 'desktop', label: 'Desktop View', icon: Monitor, size: '100%' },
    { id: 'tablet', label: 'Tablet (iPad/Tab)', icon: Tablet, size: '768px' },
    { id: 'mobile', label: 'Mobile (Phone)', icon: Smartphone, size: '412px' },
  ];

  return (
    <div className="bg-[#111216] border-b border-[#1f2128] py-2 px-3 sm:px-4 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white tracking-tight">Responsive Preview:</span>
          <span className="text-neutral-400 hidden sm:inline">
            Test Desktop, Tablet, and Mobile layouts
          </span>
        </div>

        {/* Viewport Switcher: Desktop vs Tablet vs Mobile */}
        <div className="flex items-center gap-1.5 bg-[#0a0a0c] p-0.5 sm:p-1 rounded-xl border border-[#252731]">
          {devices.map((d) => {
            const Icon = d.icon;
            const isSelected = currentDevice === d.id;

            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#f6d23e] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#181920]'
                }`}
                title={`Switch to ${d.label} (${d.size})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
