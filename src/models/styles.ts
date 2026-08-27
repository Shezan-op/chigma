export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type StrokeAlign = 'inside' | 'center' | 'outside';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 400 | 500 | 600 | 700;
export type ArrowMarker = 'none' | 'arrow' | 'triangle' | 'circle' | 'diamond';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

export interface CornerRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  linked?: boolean;
}

export interface GradientStop {
  id: string;
  color: string;
  offset: number; // 0 to 1
  opacity?: number; // 0 to 1
}

export interface LinearGradient {
  type: 'linear-gradient';
  angle: number; // 0 to 360
  stops: GradientStop[];
}

export interface RadialGradient {
  type: 'radial-gradient';
  stops: GradientStop[];
}

export type Gradient = LinearGradient | RadialGradient;

export type FillType = 'solid' | 'gradient' | 'image';

export interface FillPaint {
  id: string;
  type: FillType;
  visible: boolean;
  opacity: number; // 0 to 1
  color?: string; // For solid
  gradient?: Gradient; // For gradient
  imageSrc?: string; // For image fill
  imageFit?: 'fill' | 'fit' | 'crop' | 'tile';
  blendMode?: BlendMode;
  variableId?: string; // Design token variable reference
}

export interface StrokePaint {
  id: string;
  visible: boolean;
  color: string;
  width: number;
  style: StrokeStyle;
  align: StrokeAlign;
  opacity: number;
  blendMode?: BlendMode;
  variableId?: string;
}

export type EffectType = 'drop-shadow' | 'inner-shadow' | 'layer-blur' | 'background-blur';

export interface Effect {
  id: string;
  type: EffectType;
  visible: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

export interface BaseStyleProps {
  fill?: string;
  fills?: FillPaint[];
  stroke?: string;
  strokes?: StrokePaint[];
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  strokeAlign?: StrokeAlign;
  opacity?: number;
  cornerRadius?: number | CornerRadii;
  effects?: Effect[];
  blendMode?: BlendMode;
}
