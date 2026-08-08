import React, { useState } from 'react';
import { X, Zap, Send, RefreshCw, ShieldCheck, Layers, Check } from 'lucide-react';
import { ProxyItem } from '../types';

interface QuickConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  proxies: ProxyItem[];
  onCopy: (text: string, label: string) => void;
}

export const QuickConnectModal: React.FC<QuickConnectModalProps> = ({
  isOpen,
  onClose,
  proxies,
  onCopy,
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<'all' | 'MTProto' | 'SOCKS5'>('all');
  const [currentProxy, setCurrentProxy] = useState<ProxyItem | null>(null);

  if (!isOpen) return null;

  const getFiltered = () => {
    if (selectedProtocol === 'all') return proxies;
    return proxies.filter(p => p.protocol === selectedProtocol);
  };

  const handlePickRandom = () => {
    const list = getFiltered();
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentProxy(list[randomIndex]);
  };

  if (!currentProxy && proxies.length > 0) {
    handlePickRandom();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Quick Connect
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Connect to a proxy with 1 click
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protocol filter selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => {
              setSelectedProtocol('all');
              handlePickRandom();
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedProtocol === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Any Type
          </button>
          <button
            onClick={() => {
              setSelectedProtocol('MTProto');
              handlePickRandom();
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedProtocol === 'MTProto'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            MTProto
          </button>
          <button
            onClick={() => {
              setSelectedProtocol('SOCKS5');
              handlePickRandom();
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedProtocol === 'SOCKS5'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            SOCKS5
          </button>
        </div>

        {/* Selected Proxy Box */}
        {currentProxy ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400">
              {currentProxy.protocol === 'MTProto' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              {currentProxy.protocol}
            </div>

            <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-slate-100 select-all">
              {currentProxy.ip}:{currentProxy.port}
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={handlePickRandom}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Pick Another</span>
              </button>

              <a
                href={currentProxy.tgUrl}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Connect Now</span>
              </a>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No proxies available</p>
        )}
      </div>
    </div>
  );
};
