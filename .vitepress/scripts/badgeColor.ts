// badgeColorColoredText.ts
type ColorSet = { background: string; text: string; border: string };

/* helpers */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}
function clamp(n: number, a = 0, b = 100) { return Math.min(b, Math.max(a, n)); }

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
function rgbToHex([r, g, b]: [number, number, number]) {
  const hx = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hx(r)}${hx(g)}${hx(b)}`;
}
function rgbToCss(r: number, g: number, b: number, a = 1) {
  return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(2)})`;
}
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
  }
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function compositeRgb(fg: [number, number, number], alpha: number, bg: [number, number, number]) {
  const r = Math.round(alpha * fg[0] + (1 - alpha) * bg[0]);
  const g = Math.round(alpha * fg[1] + (1 - alpha) * bg[1]);
  const b = Math.round(alpha * fg[2] + (1 - alpha) * bg[2]);
  return [r, g, b] as [number, number, number];
}
function srgbToLinearChannel(v: number) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(rgb: [number, number, number]) {
  const [r,g,b] = rgb.map(srgbToLinearChannel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a: [number, number, number], b: [number, number, number]) {
  const La = luminance(a), Lb = luminance(b);
  const L1 = Math.max(La, Lb), L2 = Math.min(La, Lb);
  return (L1 + 0.05) / (L2 + 0.05);
}

/* main */
export function stringToBadgeColors(
  input: string,
  surfaceHex = '#ffffff',
  minContrast = 4.5
): ColorSet {
  const h = hashString(input) % 360;
  const sBase = 56;
  const lBase = 48;

  const bgRgbOpaque = hslToRgb(h, sBase, lBase);
  const bgAlpha = 0.10;
  const background = rgbToCss(bgRgbOpaque[0], bgRgbOpaque[1], bgRgbOpaque[2], bgAlpha);

  const borderRgbOpaque = hslToRgb(h, sBase, clamp(lBase - 10, 0, 100));
  const border = rgbToCss(borderRgbOpaque[0], borderRgbOpaque[1], borderRgbOpaque[2], 0.28);

  const surfaceRgb = hexToRgb(surfaceHex);
  const compositeBg = compositeRgb(bgRgbOpaque, bgAlpha, surfaceRgb);

  // text candidate: same hue, increased saturation, search lightness variants by closeness to base
  const sText = clamp(Math.round(sBase * 1.25), 30, 100);
  const maxDelta = 50;
  let chosenTextHex: string | null = null;

  for (let delta = 0; delta <= maxDelta; delta++) {
    // try darker then lighter at same delta to prefer minimal perceptual change
    const candidates = [
      clamp(lBase - delta, 0, 100),
      clamp(lBase + delta, 0, 100)
    ];
    for (const lCand of candidates) {
      const rgb = hslToRgb(h, sText, lCand);
      const contrast = contrastRatio(rgb, compositeBg);
      if (contrast >= minContrast) {
        chosenTextHex = rgbToHex(rgb);
        break;
      }
    }
    if (chosenTextHex) break;
  }

  // fallback: pick best of black/white
  if (!chosenTextHex) {
    const white: [number, number, number] = [255,255,255];
    const black: [number, number, number] = [0,0,0];
    const cW = contrastRatio(white, compositeBg);
    const cB = contrastRatio(black, compositeBg);
    chosenTextHex = cW >= cB ? '#ffffff' : '#000000';
  }

  return { background, text: chosenTextHex!, border };
}
