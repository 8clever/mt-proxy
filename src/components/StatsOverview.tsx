import React from 'react';
import { Eye, EyeOff, ShieldCheck, Layers, RotateCcw } from 'lucide-react';

interface StatsOverviewProps {
  totalCount: number;
  visibleCount: number;
  hiddenCount: number;
  mtprotoCount: number;
  socks5Count: number;
  fastCount: number;
  onResetHidden: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalCount,
  visibleCount,
  hiddenCount,
  mtprotoCount,
  socks5Count,
  onResetHidden,
}) => {
  return (
    <div className="my-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 gap-2 overflow-x-auto no-scrollbar">
        {/* Active Visible Count */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-900 dark:text-slate-100 font-extrabold">{visibleCount}</span>
          <span className="text-[10px] text-slate-400 font-medium">/ {totalCount} Proxies</span>
        </div>

        {/* Protocol Counts */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-3 h-3" /> {mtprotoCount} MTProto
          </span>
          {socks5Count > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-3 h-3" /> {socks5Count} SOCKS5
            </span>
          )}
        </div>

        {/* Hidden reset option if any */}
        {hiddenCount > 0 && (
          <button
            onClick={onResetHidden}
            title="Restore hidden proxies"
            className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-xl shrink-0 hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Restore ({hiddenCount})
          </button>
        )}
      </div>
    </div>
  );
};

