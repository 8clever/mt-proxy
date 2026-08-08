import React, { useState } from 'react';
import { X, Globe, Copy, Check, Download, ExternalLink, RefreshCw } from 'lucide-react';

interface SourceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceUrl: string;
  onUpdateSourceUrl: (newUrl: string) => void;
  rawText: string;
  onApplyRawText: (text: string) => void;
  onCopy: (text: string, label: string) => void;
}

export const SourceConfigModal: React.FC<SourceConfigModalProps> = ({
  isOpen,
  onClose,
  sourceUrl,
  onUpdateSourceUrl,
  rawText,
  onApplyRawText,
  onCopy,
}) => {
  const [urlInput, setUrlInput] = useState(sourceUrl);
  const [customTextInput, setCustomTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'view'>('url');

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      onUpdateSourceUrl(urlInput.trim());
      onClose();
    }
  };

  const handleApplyCustomText = () => {
    if (customTextInput.trim()) {
      onApplyRawText(customTextInput.trim());
      onClose();
    }
  };

  const handleResetDefaultUrl = () => {
    const defaultUrl = 'https://raw.githubusercontent.com/kort0881/telegram-proxy-collector/refs/heads/main/proxy_ru.txt';
    setUrlInput(defaultUrl);
    onUpdateSourceUrl(defaultUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Proxy Data Source
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Manage proxy collector text file source
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

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            URL Source
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'paste'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'view'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Raw List
          </button>
        </div>

        {/* Content Tabs */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Collector Raw Text URL
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-sky-500"
              />
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={handleResetDefaultUrl}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                >
                  Reset Default URL
                </button>
                <button
                  onClick={handleSaveUrl}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm"
                >
                  Fetch From URL
                </button>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Paste Custom Proxy Text / Links
              </label>
              <textarea
                rows={6}
                value={customTextInput}
                onChange={e => setCustomTextInput(e.target.value)}
                placeholder="Paste tg://proxy?... or IP:PORT lines here..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-sky-500 resize-none"
              />
              <button
                onClick={handleApplyCustomText}
                disabled={!customTextInput.trim()}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm disabled:opacity-50"
              >
                Parse & Load Text
              </button>
            </div>
          )}

          {activeTab === 'view' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Fetched Content ({rawText.length} bytes)
                </span>
                <button
                  onClick={() => onCopy(rawText, 'Raw list')}
                  className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy All
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 font-mono text-[11px] p-3 rounded-xl overflow-x-auto max-h-56 select-all whitespace-pre-wrap break-all border border-slate-800">
                {rawText || 'No raw content fetched yet.'}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
