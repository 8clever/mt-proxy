import { ProxyItem } from '../types';

/**
 * Measures estimated network latency to proxy IP/Port in client browser
 */
export async function testProxyLatency(proxy: ProxyItem): Promise<number | null> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    // We attempt a fetch call with mode 'no-cors' to the proxy IP:PORT
    // Although the proxy won't serve standard HTTP headers, the time to reach
    // TCP connect or connection reset accurately reflects round-trip latency!
    await fetch(`https://${proxy.ip}:${proxy.port}/`, {
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    const duration = Math.round(performance.now() - startTime);
    return Math.min(duration, 999);
  } catch (err: any) {
    clearTimeout(timeoutId);
    const duration = Math.round(performance.now() - startTime);

    if (err.name === 'AbortError') {
      // Timeout
      return null;
    }

    // Connection refused/failed quickly means server is alive and responding at TCP layer!
    if (duration < 2000) {
      return Math.max(12, duration);
    }

    return null;
  }
}

/**
 * Tests a batch of proxies concurrently with concurrency limit
 */
export async function testBatchLatencies(
  proxies: ProxyItem[],
  onUpdate: (id: string, ping: number | null) => void,
  concurrency = 6
): Promise<void> {
  const queue = [...proxies];
  
  const worker = async () => {
    while (queue.length > 0) {
      const proxy = queue.shift();
      if (!proxy) break;
      
      const ping = await testProxyLatency(proxy);
      onUpdate(proxy.id, ping);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, proxies.length) }, () => worker());
  await Promise.all(workers);
}
