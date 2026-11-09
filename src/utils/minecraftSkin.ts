/**
 * Minecraft Skin & Head Extraction Utilities
 * Standard Minecraft skin format:
 * - 64x64 (modern) or 64x32 (classic)
 * - Head base: x=8, y=8, w=8, h=8
 * - Hat/Helmet overlay: x=40, y=8, w=8, h=8
 */

export interface HeadRenderOptions {
  size?: number; // Target square resolution, e.g. 128
  includeHat?: boolean;
}

/**
 * Extract 2D front head with optional helmet overlay from an image element or URL
 */
export async function extractHeadFromSkin(
  skinSource: string | HTMLImageElement,
  options: HeadRenderOptions = {}
): Promise<string> {
  const { size = 128, includeHat = true } = options;

  let img: HTMLImageElement;
  if (typeof skinSource === 'string') {
    img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(new Error('Failed to load skin image'));
      img.src = skinSource;
    });
  } else {
    img = skinSource;
  }

  // Create temporary off-screen canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Ensure crisp pixelated rendering without blurring
  ctx.imageSmoothingEnabled = false;

  // 1. Draw base head (face at x: 8, y: 8, 8x8 pixels)
  // sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  ctx.drawImage(img, 8, 8, 8, 8, 0, 0, size, size);

  // 2. Draw outer hat layer if requested (overlay at x: 40, y: 8, 8x8 pixels)
  if (includeHat) {
    ctx.drawImage(img, 40, 8, 8, 8, 0, 0, size, size);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Extract isometric 3D-styled head preview
 */
export async function extractIsometricHeadFromSkin(
  skinSource: string | HTMLImageElement,
  targetSize: number = 140
): Promise<string> {
  let img: HTMLImageElement;
  if (typeof skinSource === 'string') {
    img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load skin'));
      img.src = skinSource;
    });
  } else {
    img = skinSource;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.imageSmoothingEnabled = false;

  // For high quality display, draw the front face with hat, with subtle drop shadow
  ctx.shadowColor = 'rgba(6, 182, 212, 0.25)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  const pad = targetSize * 0.1;
  const renderSize = targetSize - pad * 2;

  // Draw face
  ctx.drawImage(img, 8, 8, 8, 8, pad, pad, renderSize, renderSize);
  // Draw helmet
  ctx.drawImage(img, 40, 8, 8, 8, pad, pad, renderSize, renderSize);

  return canvas.toDataURL('image/png');
}

/**
 * Get Minecraft avatar URL from username
 */
export function getMinecraftAvatarUrl(username: string, size: number = 128): string {
  const clean = username.trim() || 'Steve';
  return `https://mc-heads.net/avatar/${encodeURIComponent(clean)}/${size}`;
}
