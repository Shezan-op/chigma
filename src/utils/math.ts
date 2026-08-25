export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function roundTo(val: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function normalizeAngle(angle: number): number {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

export function snapAngle(angle: number, step = 45, threshold = 6): number {
  const normalized = normalizeAngle(angle);
  const remainder = normalized % step;
  if (remainder < threshold) {
    return normalized - remainder;
  }
  if (remainder > step - threshold) {
    return (normalized - remainder + step) % 360;
  }
  return normalized;
}
