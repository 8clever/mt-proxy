import React from 'react';
import { Search, ArrowUpDown, Zap, Copy, X } from 'lucide-react';
import { FilterProtocol, SortOption } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  protocolFilter: FilterProtocol;
  onProtocolChange: (protocol: FilterProtocol) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hiddenCount: number;
  onResetHidden: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  protocolFilter,
  onProtocolChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-2">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search IP, port, or secret..."
          className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm font-medium pl-10 pr-8 py-2 rounded-full border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Chips & Utility Actions Bar */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {/* Protocol Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => onProtocolChange('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              protocolFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onProtocolChange('MTProto')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              protocolFilter === 'MTProto'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            MTProto
          </button>
          <button
            onClick={() => onProtocolChange('SOCKS5')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              protocolFilter === 'SOCKS5'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            SOCKS5
          </button>
        </div>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {/* Sort Menu */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] py-1 pl-2 pr-6 rounded-full border border-slate-200/50 dark:border-slate-700/50 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="port-asc">Port</option>
              <option value="ip-asc">IP</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

