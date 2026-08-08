import React from 'react';
import { EyeOff, AlertCircle, RefreshCw, Zap, ShieldAlert } from 'lucide-react';
import { ProxyItem } from '../types';
import { ProxyCard } from './ProxyCard';

interface ProxyListProps {
  proxies: ProxyItem[];
  isLoading: boolean;
  onHide: (id: string) => void;
  onCopy: (text: string, label: string) => void;
  onTestPing: (proxy: ProxyItem) => void;
  onResetHidden: () => void;
  hiddenCount: number;
  totalCount: number;
  onRefresh: () => void;
  onConnect: (proxy: ProxyItem) => void;
}

export const ProxyList: React.FC<ProxyListProps> = ({
  proxies,
  isLoading,
  onHide,
  onCopy,
  onTestPing,
  onResetHidden,
  hiddenCount,
  totalCount,
  onRefresh,
  onConnect
}) => {
  // Skeleton Loader State
  if (isLoading && proxies.length === 0) {
    return (
      <div className="space-y-2 my-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 animate-pulse space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
              <div className="h-8 bg-sky-200 dark:bg-sky-950 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // All Proxies Hidden In-Memory
  if (proxies.length === 0 && hiddenCount > 0 && hiddenCount === totalCount) {
    return (
      <div className="my-8 text-center p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
          <EyeOff className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          All {totalCount} Proxies Hidden
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          You have hidden all proxies from view in memory. Click below to restore them or refresh the list.
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onResetHidden}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-all active:scale-95 shadow-sm"
          >
            Restore Hidden Proxies
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all active:scale-95"
          >
            Refresh List
          </button>
        </div>
      </div>
    );
  }

  // Empty Search / Filter State
  if (proxies.length === 0) {
    return (
      <div className="my-8 text-center p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          No Proxies Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          No proxies match your current search query or filter.
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all active:scale-95"
        >
          Re-fetch Latest List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 my-2">
      {proxies.map(proxy => (
        <ProxyCard
          key={proxy.id}
          proxy={proxy}
          onHide={onHide}
          onCopy={onCopy}
          onTestPing={onTestPing}
          onConnect={onConnect}
        />
      ))}
    </div>
  );
};
