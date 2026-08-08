import { ProtocolType, ProxyItem } from '../types';

/**
 * Validates basic IPv4 or IPv6 string
 */
function isValidIp(ip: string): boolean {
  if (!ip) return false;
  // IPv4 simple check
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number);
    return parts.every(p => p >= 0 && p <= 255);
  }
  // IPv6 check
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip) || ip === 'localhost';
}

/**
 * Generates unique ID for a proxy
 */
function generateProxyId(ip: string, port: number, secret?: string): string {
  return `${ip}:${port}:${secret || ''}`;
}

/**
 * Parses raw text content into structured ProxyItem array
 */
export function parseProxyList(text: string): ProxyItem[] {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const proxies: ProxyItem[] = [];
  const seenIds = new Set<string>();

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;

    let parsedItem: Partial<ProxyItem> | null = null;

    // Case 1: Standard URL (tg:// or https://t.me/)
    if (line.toLowerCase().startsWith('tg://') || line.toLowerCase().startsWith('https://t.me/')) {
      parsedItem = parseTelegramUrl(line);
    }
    // Case 2: Colon-separated format IP:PORT:SECRET or IP:PORT:USER:PASS or IP:PORT
    else if (line.includes(':')) {
      parsedItem = parseColonFormat(line);
    }

    if (parsedItem && parsedItem.ip && parsedItem.port && isValidIp(parsedItem.ip)) {
      const id = generateProxyId(parsedItem.ip, parsedItem.port, parsedItem.secret);
      
      if (!seenIds.has(id)) {
        seenIds.add(id);

        const ip = parsedItem.ip;
        const port = parsedItem.port;
        const secret = parsedItem.secret;
        const username = parsedItem.username;
        const password = parsedItem.password;
        const protocol: ProtocolType = parsedItem.protocol || (secret ? 'MTProto' : 'SOCKS5');

        // Build canonical URLs
        let tgUrl = '';
        let webUrl = '';

        if (protocol === 'MTProto' || secret) {
          const secretParam = secret ? `&secret=${encodeURIComponent(secret)}` : '';
          tgUrl = `tg://proxy?server=${encodeURIComponent(ip)}&port=${port}${secretParam}`;
          webUrl = `https://t.me/proxy?server=${encodeURIComponent(ip)}&port=${port}${secretParam}`;
        } else {
          // SOCKS5
          let userPassParam = '';
          if (username) userPassParam += `&user=${encodeURIComponent(username)}`;
          if (password) userPassParam += `&pass=${encodeURIComponent(password)}`;

          tgUrl = `tg://socks?server=${encodeURIComponent(ip)}&port=${port}${userPassParam}`;
          webUrl = `https://t.me/socks?server=${encodeURIComponent(ip)}&port=${port}${userPassParam}`;
        }

        proxies.push({
          id,
          ip,
          port,
          secret,
          username,
          password,
          protocol,
          tgUrl,
          webUrl,
          originalLine: line,
          pingStatus: 'idle',
        });
      }
    }
  }

  return proxies;
}

/**
 * Parses URL formats: tg://proxy?server=... or https://t.me/proxy?server=...
 */
function parseTelegramUrl(urlStr: string): Partial<ProxyItem> | null {
  try {
    // Normalise tg:// to https:// scheme for standard URL parsing if needed
    let safeUrl = urlStr;
    if (safeUrl.startsWith('tg://')) {
      safeUrl = safeUrl.replace('tg://', 'https://telegram.org/');
    }

    const url = new URL(safeUrl);
    const searchParams = url.searchParams;

    const server = searchParams.get('server') || searchParams.get('ip') || url.hostname;
    const portStr = searchParams.get('port') || url.port;
    const secret = searchParams.get('secret') || undefined;
    const username = searchParams.get('user') || searchParams.get('username') || undefined;
    const password = searchParams.get('pass') || searchParams.get('password') || undefined;

    const path = url.pathname.toLowerCase();
    let protocol: ProtocolType = 'MTProto';
    if (path.includes('socks') || urlStr.toLowerCase().includes('socks')) {
      protocol = 'SOCKS5';
    } else if (path.includes('proxy') || secret) {
      protocol = 'MTProto';
    }

    if (!server || !portStr) return null;
    const port = parseInt(portStr, 10);
    if (isNaN(port) || port <= 0 || port > 65535) return null;

    return {
      ip: server.trim(),
      port,
      secret: secret ? secret.trim() : undefined,
      username: username ? username.trim() : undefined,
      password: password ? password.trim() : undefined,
      protocol,
    };
  } catch {
    return null;
  }
}

/**
 * Parses IP:PORT or IP:PORT:SECRET or IP:PORT:USER:PASS
 */
function parseColonFormat(line: string): Partial<ProxyItem> | null {
  const parts = line.split(':').map(p => p.trim());
  if (parts.length < 2) return null;

  const ip = parts[0];
  const port = parseInt(parts[1], 10);

  if (!ip || isNaN(port) || port <= 0 || port > 65535) return null;

  let secret: string | undefined = undefined;
  let username: string | undefined = undefined;
  let password: string | undefined = undefined;
  let protocol: ProtocolType = 'SOCKS5';

  if (parts.length === 3) {
    // Check if 3rd part looks like hex secret (MTProto secret is usually hex, e.g. 32 chars or starting with ee/dd)
    const thirdPart = parts[2];
    if (/^[0-9a-fA-F]{30,}$/.test(thirdPart) || thirdPart.length >= 16) {
      secret = thirdPart;
      protocol = 'MTProto';
    } else {
      username = thirdPart;
    }
  } else if (parts.length >= 4) {
    username = parts[2];
    password = parts[3];
    protocol = 'SOCKS5';
  }

  return {
    ip,
    port,
    secret,
    username,
    password,
    protocol,
  };
}
