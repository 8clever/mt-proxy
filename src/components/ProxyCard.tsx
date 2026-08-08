import React, { useState } from 'react';
import {
  Send,
  EyeOff,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Layers,
  ExternalLink,
  Globe,
  Key
} from 'lucide-react';
import { ProxyItem } from '../types';

interface ProxyCardProps {
  proxy: ProxyItem;
  onHide: (id: string) => void;
  onCopy: (text: string, label: string) => void;
  onTestPing: (proxy: ProxyItem) => void;
}

export const ProxyCard: React.FC<ProxyCardProps> = ({
  proxy,
  onHide,
  onCopy,
  onTestPing,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Latency Ping Badge
  const renderPingBadge = () => {
    if (proxy.pingStatus === 'testing') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 animate-pulse">
          <Zap className="w-2.5 h-2.5 animate-spin" /> Ping...
        </span>
      );
    }

    if (proxy.ping !== undefined && proxy.ping !== null) {
      let colorClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/50';
      if (proxy.ping > 300) {
        colorClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/50';
      } else if (proxy.ping > 150) {
        colorClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/50';
      }

      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}>
          <Zap className="w-2.5 h-2.5 fill-current" /> {proxy.ping} ms
        </span>
      );
    }

    return (
      <button
        onClick={() => onTestPing(proxy)}
        title="Check latency"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <Zap className="w-2.5 h-2.5" /> Ping
      </button>
    );
  };

  const handleCopyLink = () => {
    onCopy(proxy.tgUrl, 'Telegram proxy link');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-150">
      {/* Header Row: IP:Port, Badges & Dismiss */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* IP:PORT Prominent Monospace Display */}
            <h2 className="text-base sm:text-lg font-mono font-bold tracking-tight text-slate-900 dark:text-slate-100 select-all">
              {proxy.ip}:{proxy.port}
            </h2>

            {/* Protocol Badge */}
            {proxy.protocol === 'MTProto' ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300">
                <ShieldCheck className="w-3 h-3" /> MTProto
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300">
                <Layers className="w-3 h-3" /> SOCKS5
              </span>
            )}

            {/* Ping Latency Badge */}
            {renderPingBadge()}
          </div>
        </div>

        {/* Hide / Dismiss Button */}
        <button
          onClick={() => onHide(proxy.id)}
          title="Hide proxy from view"
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* Secret Preview if available */}
      {proxy.secret && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-800 select-all overflow-hidden">
          <Key className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">Secret: {proxy.secret}</span>
          <button
            onClick={() => onCopy(proxy.secret!, 'Secret')}
            title="Copy Secret"
            className="ml-auto p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Action Controls Row */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Copy Utility Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopy(`${proxy.ip}:${proxy.port}`, 'IP:Port')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <Copy className="w-3 h-3" />
            <span>IP:Port</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <ExternalLink className="w-3 h-3" />}
            <span>Link</span>
          </button>
        </div>

        {/* Primary Connect Actions */}
        <div className="flex items-center gap-1">
          {/* Direct Telegram Deep Link Connect Button */}
          <a
            href={proxy.webUrl}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>Connect</span>
          </a>
        </div>
      </div>
    </div>
  );
};

