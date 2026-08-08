export type ProtocolType = 'MTProto' | 'SOCKS5' | 'Unknown';

export interface ProxyItem {
  id: string;
  ip: string;
  port: number;
  secret?: string;
  username?: string;
  password?: string;
  protocol: ProtocolType;
  tgUrl: string;       // tg://proxy?server=...&port=...&secret=...
  webUrl: string;      // https://t.me/proxy?server=...&port=...&secret=...
  originalLine: string;
  ping?: number | null; // latency in ms
  pingStatus?: 'idle' | 'testing' | 'success' | 'failed';
  addedAt?: number;
}

export type SortOption = 'default' | 'ping-asc' | 'port-asc' | 'ip-asc';
export type FilterProtocol = 'all' | 'MTProto' | 'SOCKS5';

export interface FilterState {
  searchQuery: string;
  protocol: FilterProtocol;
  sortBy: SortOption;
  onlyFast: boolean;
}

export interface FetchResult {
  proxies: ProxyItem[];
  rawText: string;
  fetchedAt: Date;
  sourceUrl: string;
}
