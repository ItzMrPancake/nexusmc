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
  const [status, setStatus] = useState<MinecraftServerStatus>({
    ...DEFAULT_STATUS,
    ip: serverIp,
  });

  const scanServer = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isScanning: true }));
    try {
      // Query direct CORS-enabled Minecraft status API
      const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(serverIp)}`, {
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const directData = await res.json();
        const online = Boolean(directData.online);

        setStatus({
          online,
          ip: serverIp,
          port: directData.port || 22924,
          players: {
            online: Number(directData.players?.online ?? 0),
            max: Number(directData.players?.max ?? 20),
            list: directData.players?.list || [],
          },
          version: directData.version || 'Paper 1.21+',
          motd:
            Array.isArray(directData.motd?.clean) && directData.motd.clean.length > 0
              ? directData.motd.clean
              : ['NEXUSMC [1.21+] | RPG ISLAND + CUSTOM DUNGEONS'],
          software: directData.software || 'Paper',
          icon: directData.icon || null,
          lastScanned: Date.now(),
          isScanning: false,
        });
        return;
      }

      setStatus((prev) => ({ ...prev, isScanning: false, lastScanned: Date.now() }));
    } catch {
      // Offline or network timeout fallback
      setStatus((prev) => ({ ...prev, isScanning: false, lastScanned: Date.now() }));
    }
  }, [serverIp]);

  useEffect(() => {
    scanServer();
    // Scan every 30 seconds
    const interval = setInterval(scanServer, 30000);
    return () => clearInterval(interval);
  }, [scanServer]);

  return { ...status, refresh: scanServer };
}
