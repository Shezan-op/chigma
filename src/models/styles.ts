export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export type TextAlign = 'left' | 'center' | 'right';

export type FontWeight = 400 | 500 | 600 | 700;

export type ArrowMarker = 'none' | 'arrow' | 'triangle' | 'circle' | 'diamond';

export interface BaseStyleProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  opacity?: number;
}
