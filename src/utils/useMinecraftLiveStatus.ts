import { useState, useEffect, useCallback } from 'react';

export interface MinecraftServerStatus {
  online: boolean;
  ip: string;
  port: number;
  players: {
    online: number;
    max: number;
    list?: string[];
  };
  version: string;
  motd: string[];
  software: string;
  icon?: string | null;
  lastScanned?: number;
  isScanning: boolean;
}

const DEFAULT_STATUS: MinecraftServerStatus = {
  online: true,
  ip: 'nexusmc.ultramc.co',
  port: 22924,
  players: {
    online: 0,
    max: 20,
  },
  version: 'Paper 1.21+',
  motd: ['NEXUSMC [1.21+] | RPG ISLAND + CUSTOM DUNGEONS'],
  software: 'Paper',
  isScanning: false,
};

export function useMinecraftLiveStatus(serverIp = 'nexusmc.ultramc.co') {
  const [status, setStatus] = useState<MinecraftServerStatus>(DEFAULT_STATUS);

  const scanServer = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isScanning: true }));
    try {
      // 1. Try internal backend scanner endpoint first
      let data: any = null;
      try {
        const res = await fetch(`/api/minecraft/status?ip=${encodeURIComponent(serverIp)}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Fallback to direct mcsrvstat API if backend is busy
        const directRes = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(serverIp)}`, {
          signal: AbortSignal.timeout(5000),
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          data = {
            online: Boolean(directData.online),
            ip: serverIp,
            port: directData.port || 22924,
            players: {
              online: directData.players?.online ?? 0,
              max: directData.players?.max ?? 20,
              list: directData.players?.list || [],
            },
            version: directData.version || 'Paper 1.21+',
            motd: directData.motd?.clean || ['NEXUSMC [1.21+] | RPG ISLAND + CUSTOM DUNGEONS'],
            software: directData.software || 'Paper',
            icon: directData.icon || null,
          };
        }
      }

      if (data) {
        setStatus({
          online: Boolean(data.online),
          ip: serverIp,
          port: data.port || 22924,
          players: {
            online: Number(data.players?.online ?? 0),
            max: Number(data.players?.max ?? 20),
            list: data.players?.list || [],
          },
          version: data.version || 'Paper 1.21+',
          motd: Array.isArray(data.motd) && data.motd.length > 0 ? data.motd : DEFAULT_STATUS.motd,
          software: data.software || 'Paper',
          icon: data.icon || null,
          lastScanned: Date.now(),
          isScanning: false,
        });
      } else {
        setStatus((prev) => ({ ...prev, isScanning: false, lastScanned: Date.now() }));
      }
    } catch (err) {
      console.warn('Live Minecraft status scan failed, using fallback:', err);
      setStatus((prev) => ({ ...prev, isScanning: false, lastScanned: Date.now() }));
    }
  }, [serverIp]);

  useEffect(() => {
    scanServer();
    // Scan every 20 seconds
    const interval = setInterval(scanServer, 20000);
    return () => clearInterval(interval);
  }, [scanServer]);

  return { ...status, refresh: scanServer };
}
