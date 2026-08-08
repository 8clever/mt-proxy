import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { SearchBar } from './components/SearchBar';
import { ProxyList } from './components/ProxyList';
import { ToastContainer, ToastMessage } from './components/Toast';
import { QuickConnectModal } from './components/QuickConnectModal';
import { SourceConfigModal } from './components/SourceConfigModal';
import { ProxyItem, FilterProtocol, SortOption } from './types';
import { parseProxyList } from './utils/proxyParser';
import { testProxyLatency, testBatchLatencies } from './utils/pingTester';
import { Send, Sparkles, RefreshCw, Layers, ShieldCheck, Github } from 'lucide-react';

const DEFAULT_SOURCE_URL = 'https://raw.githubusercontent.com/kort0881/telegram-proxy-collector/refs/heads/main/proxy_ru.txt';

export default function App() {
  // Application Data State
  const [sourceUrl, setSourceUrl] = useState<string>(DEFAULT_SOURCE_URL);
  const [rawText, setRawText] = useState<string>('');
  const [proxies, setProxies] = useState<ProxyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // In-Memory Dismissal / Hiding State (Resets on Refresh / Reload as requested)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [protocolFilter, setProtocolFilter] = useState<FilterProtocol>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isTestingPing, setIsTestingPing] = useState<boolean>(false);

  // UI Modals & Theme (Default to light mode for Clean Minimalism theme)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check local storage or match Media if present, default false for light theme
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('proxy_app_theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [isQuickConnectOpen, setIsQuickConnectOpen] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html element & save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('proxy_app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('proxy_app_theme', 'light');
    }
  }, [darkMode]);


  // Toast notifier helper
  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch Proxy Data from GitHub Raw or Fallback Mirror
  const fetchProxies = useCallback(async (isManualRefresh = false) => {
    setIsLoading(true);
    try {
      let text = '';
      let fetchSuccess = false;

      // Try direct fetch
      try {
        const res = await fetch(sourceUrl, { cache: 'no-store' });
        if (res.ok) {
          text = await res.text();
          fetchSuccess = true;
        }
      } catch (e) {
        console.warn('Direct fetch failed, trying CORS mirror fallback...', e);
      }

      // If direct fetch fails (e.g. CORS or network restriction), use CORS proxy fallback
      if (!fetchSuccess) {
        const mirrorUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`;
        const resMirror = await fetch(mirrorUrl, { cache: 'no-store' });
        if (resMirror.ok) {
          text = await resMirror.text();
          fetchSuccess = true;
        }
      }

      if (fetchSuccess && text) {
        const parsed = parseProxyList(text);
        setRawText(text);
        setProxies(parsed);
        setLastUpdated(new Date());

        // Reset in-memory hidden items on refresh (as required)
        setHiddenIds(new Set());

        if (isManualRefresh) {
          addToast(`Refreshed ${parsed.length} proxies successfully`, 'success');
        }
      } else {
        throw new Error('Could not retrieve proxy list content');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      addToast('Failed to fetch proxy list. Please check connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sourceUrl, addToast]);

  // Initial Fetch on Load
  useEffect(() => {
    fetchProxies();
  }, [fetchProxies]);

  // Auto-refresh interval (every 5 minutes if enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchProxies(false);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchProxies]);

  // Hide proxy in-memory
  const handleHideProxy = useCallback((id: string) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    addToast('Proxy hidden (in-memory)', 'info');
  }, [addToast]);

  // Reset in-memory hidden state
  const handleResetHidden = useCallback(() => {
    setHiddenIds(new Set());
    addToast('Restored all hidden proxies', 'success');
  }, [addToast]);

  // Copy helper
  const handleCopy = useCallback((text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      addToast(`Copied ${label} to clipboard`, 'success');
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      addToast(`Copied ${label} to clipboard`, 'success');
    }
  }, [addToast]);

  // Apply manual raw text
  const handleApplyCustomText = useCallback((customText: string) => {
    const parsed = parseProxyList(customText);
    setRawText(customText);
    setProxies(parsed);
    setHiddenIds(new Set());
    setLastUpdated(new Date());
    addToast(`Loaded ${parsed.length} proxies from custom text`, 'success');
  }, [addToast]);

  // Test single proxy ping
  const handleTestSinglePing = useCallback(async (proxy: ProxyItem) => {
    setProxies(prev =>
      prev.map(p => (p.id === proxy.id ? { ...p, pingStatus: 'testing' } : p))
    );

    const ping = await testProxyLatency(proxy);

    setProxies(prev =>
      prev.map(p =>
        p.id === proxy.id
          ? {
              ...p,
              ping,
              pingStatus: ping !== null ? 'success' : 'failed',
            }
          : p
      )
    );
  }, []);

  // Filter & Process visible proxies
  const visibleProxies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let re: RegExp | null = null;
    if (q.startsWith("/") && q.endsWith("/")) {
      try {
        re =  new RegExp(searchQuery.trim().slice(1, -1))
      } catch {/** empty */}
    }
    return proxies.filter(p => {
      // 1. In-memory hidden check
      if (hiddenIds.has(p.id)) 
        return false;

      // 2. Protocol filter
      if (protocolFilter !== 'all' && p.protocol !== protocolFilter) 
        return false;

      // search by regex
      if (re) {
        return re.test(p.ip)
      }

      // 3. Search query filter
      if (q.length) {
        const matchesIp = p.ip.toLowerCase().includes(q);
        const matchesPort = p.port.toString().includes(q);
        return matchesIp || matchesPort
      }

      return true;
    });
  }, [proxies, hiddenIds, protocolFilter, searchQuery]);

  // Sort visible proxies
  const sortedVisibleProxies = useMemo(() => {
    const list = [...visibleProxies];
    if (sortBy === 'ping-asc') {
      list.sort((a, b) => {
        if (a.ping === null || a.ping === undefined) return 1;
        if (b.ping === null || b.ping === undefined) return -1;
        return a.ping - b.ping;
      });
    } else if (sortBy === 'port-asc') {
      list.sort((a, b) => a.port - b.port);
    } else if (sortBy === 'ip-asc') {
      list.sort((a, b) => a.ip.localeCompare(b.ip));
    }
    return list;
  }, [visibleProxies, sortBy]);

  // Test Ping for All Visible
  const handlePingAllVisible = useCallback(async () => {
    if (visibleProxies.length === 0) return;
    setIsTestingPing(true);

    // Set status testing
    setProxies(prev =>
      prev.map(p =>
        visibleProxies.some(vp => vp.id === p.id)
          ? { ...p, pingStatus: 'testing' }
          : p
      )
    );

    await testBatchLatencies(visibleProxies, (id, ping) => {
      setProxies(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, ping, pingStatus: ping !== null ? 'success' : 'failed' }
            : p
        )
      );
    });

    setIsTestingPing(false);
    addToast('Speed test complete', 'info');
  }, [visibleProxies, addToast]);

  // Copy All Visible Links
  const handleCopyAllVisibleLinks = useCallback(() => {
    if (visibleProxies.length === 0) return;
    const links = visibleProxies.map(p => p.tgUrl).join('\n');
    handleCopy(links, `${visibleProxies.length} Telegram links`);
  }, [visibleProxies, handleCopy]);

  // Statistics
  const mtprotoCount = useMemo(() => proxies.filter(p => !hiddenIds.has(p.id) && p.protocol === 'MTProto').length, [proxies, hiddenIds]);
  const socks5Count = useMemo(() => proxies.filter(p => !hiddenIds.has(p.id) && p.protocol === 'SOCKS5').length, [proxies, hiddenIds]);
  const fastCount = useMemo(() => proxies.filter(p => !hiddenIds.has(p.id) && p.ping && p.ping < 200).length, [proxies, hiddenIds]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white transition-colors duration-200">
      {/* App Header */}
      <Header
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefresh={() => fetchProxies(true)}
        darkMode={darkMode}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        onOpenQuickConnect={() => setIsQuickConnectOpen(true)}
        autoRefreshEnabled={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(prev => !prev)}
      />

      {/* Main Responsive Viewport for Telegram Mobile */}
      <main className="max-w-md mx-auto px-3 py-2 pb-16">
        {/* Metric Cards Overview */}
        <StatsOverview
          totalCount={proxies.length}
          visibleCount={visibleProxies.length}
          hiddenCount={hiddenIds.size}
          mtprotoCount={mtprotoCount}
          socks5Count={socks5Count}
          fastCount={fastCount}
          onResetHidden={handleResetHidden}
        />

        {/* Search, Filter Tabs & Sort Controls */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          protocolFilter={protocolFilter}
          onProtocolChange={setProtocolFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onPingAll={handlePingAllVisible}
          isTestingPing={isTestingPing}
          onCopyAllLinks={handleCopyAllVisibleLinks}
          hiddenCount={hiddenIds.size}
          onResetHidden={handleResetHidden}
        />

        {/* Proxy List */}
        <ProxyList
          proxies={sortedVisibleProxies}
          isLoading={isLoading}
          onHide={handleHideProxy}
          onCopy={handleCopy}
          onTestPing={handleTestSinglePing}
          onResetHidden={handleResetHidden}
          hiddenCount={hiddenIds.size}
          totalCount={proxies.length}
          onRefresh={() => fetchProxies(true)}
        />
      </main>

      {/* Quick Connect Random Proxy Modal */}
      <QuickConnectModal
        isOpen={isQuickConnectOpen}
        onClose={() => setIsQuickConnectOpen(false)}
        proxies={visibleProxies}
        onCopy={handleCopy}
      />

      {/* Source URL & Raw Text Config Modal */}
      <SourceConfigModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        sourceUrl={sourceUrl}
        onUpdateSourceUrl={url => setSourceUrl(url)}
        rawText={rawText}
        onApplyRawText={handleApplyCustomText}
        onCopy={handleCopy}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
