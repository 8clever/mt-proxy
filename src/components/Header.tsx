import React from 'react';
import { RefreshCw, Send, Moon, Sun, Settings, Zap } from 'lucide-react';

interface HeaderProps {
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  darkMode: boolean;
  onOpenSourceModal: () => void;
  onOpenQuickConnect: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoading,
  lastUpdated,
  onRefresh,
  darkMode,
  onOpenSourceModal,
  onOpenQuickConnect,
}) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: App Brand & Icon */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
            <Send className="w-4 h-4 -translate-x-0.5 translate-y-0.5 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Proxy List
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5 truncate">
              {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : 'Telegram Collector'}
            </p>
          </div>
        </div>

        {/* Right: Primary Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Connect Random Proxy */}
          <button
            onClick={onOpenQuickConnect}
            title="Quick connect random proxy"
            className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            <Zap className="w-4 h-4 fill-current" />
          </button>

          {/* Primary Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Proxy List"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-60 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSourceModal}
            title="Source Settings"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

