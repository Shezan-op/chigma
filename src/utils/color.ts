export const FIGMA_PASTEL_COLORS = [
  { name: 'Lime', value: '#DCEEB1' },
  { name: 'Lilac', value: '#C5B0F4' },
  { name: 'Cream', value: '#F4ECD6' },
  { name: 'Pink', value: '#EFD4D4' },
  { name: 'Mint', value: '#C8E6CD' },
  { name: 'Coral', value: '#F3C9B6' },
  { name: 'Navy', value: '#1F1D3D' },
  { name: 'Magenta', value: '#FF3D8B' }
];

export const PRESET_COLORS = [
  '#000000',
  '#FFFFFF',
  '#DCEEB1', // Figma Lime
  '#C5B0F4', // Figma Lilac
  '#F4ECD6', // Figma Cream
  '#EFD4D4', // Figma Pink
  '#C8E6CD', // Figma Mint
  '#F3C9B6', // Figma Coral
  '#1F1D3D', // Figma Navy
  '#FF3D8B', // Figma Magenta
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#64748B'
];

export function hexToRgba(hex: string, alpha = 1): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
