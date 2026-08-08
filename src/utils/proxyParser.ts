import { ProxyItem } from '../types';

/**
 * Parses raw text content into structured ProxyItem array
 */
export function parseProxyList(text: string): ProxyItem[] {
  if (!text) return [];

  const now = new Date().valueOf()
  const urls = text.split("\n");
  const proxies = urls.map((u) => {
    try {
      const url = new URL(u);
      const server = url.searchParams.get('server');
      const port = url.searchParams.get('port');
      const secret = url.searchParams.get('secret');
      return {
        id: u,
        originalLine: u,
        ip: server,
        port: Number(port),
        protocol: "MTProto",
        tgUrl: u,
        webUrl: u,
        addedAt: now,
        password: '',
        ping: null,
        pingStatus: 'idle',
        secret,
        username: ''
      }
    } catch {
      return null;
    }
  }).filter(Boolean)
  return proxies as ProxyItem[];
}
