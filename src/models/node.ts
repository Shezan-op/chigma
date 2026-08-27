import type {
  StrokeStyle,
  StrokeAlign,
  TextAlign,
  FontWeight,
  ArrowMarker,
  CornerRadii,
  FillPaint,
  StrokePaint,
  Effect,
  BlendMode
} from './styles';
import type { ChartDataItem } from './charts';
import type {
  ButtonVariant,
  ComponentSize,
  AvatarShape,
  BadgeVariant,
  ToastVariant,
  SidebarItem
} from './wireframes';

export interface OverlayConfig {
  position: 'center' | 'top' | 'bottom' | 'drawer-left' | 'drawer-right' | 'dropdown';
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  animation?: 'fade' | 'slide' | 'none';
}

export interface InteractionLink {
  trigger: 'click' | 'doubleClick' | 'hover' | 'mouseDown' | 'mouseUp' | 'afterDelay' | 'pageLoad' | 'variableChange';
  action: 'navigate' | 'openModal' | 'openOverlay' | 'closeOverlay' | 'swapComponentState' | 'setVariable' | 'toggleVariable' | 'incrementVariable' | 'decrementVariable' | 'scrollTo' | 'back' | 'url';
  targetPageId?: string;
  targetNodeId?: string;
  targetUrl?: string;
  targetState?: string;
  overlayConfig?: OverlayConfig;
  variableConfig?: {
    variableId: string;
    value?: any;
    delta?: number;
  };
  condition?: {
    variableId: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    value: any;
  };
  delay?: number;
}

export interface AutoLayoutConfig {
  enabled: boolean;
  direction: 'horizontal' | 'vertical';
  gap: number;
  paddingX: number;
  paddingY: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  alignItems: 'start' | 'center' | 'end' | 'stretch';
  justifyContent: 'start' | 'center' | 'end' | 'space-between';
  wrap?: boolean;
}

export interface ResponsiveConstraints {
  horizontal: 'left' | 'center' | 'right' | 'scale' | 'left_right';
  vertical: 'top' | 'center' | 'bottom' | 'scale' | 'top_bottom';
}

export interface SizingConstraints {
  horizontal: 'fixed' | 'hug' | 'fill';
  vertical: 'fixed' | 'hug' | 'fill';
}

export interface NodeAnnotations {
  intent?: string;
  notes?: string;
  developerNotes?: string;
  accessibilityRole?: string;
  ariaLabel?: string;
}

export interface NodeCodeMapping {
  componentName?: string;
  importPath?: string;
  framework?: 'react' | 'html' | 'nextjs' | 'vue';
}

export interface BaseNode {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees: 0 - 360
  opacity: number;  // 0 - 1
  visible: boolean;
  locked: boolean;
  parentId?: string; // If inside a frame, group, or boolean
  interaction?: InteractionLink; // Prototyping navigation link
  interactions?: InteractionLink[]; // Multiple prototype links

  // Visual Styles
  fill?: string;
  fills?: FillPaint[];
  stroke?: string;
  strokes?: StrokePaint[];
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  strokeAlign?: StrokeAlign;
  cornerRadius?: number | CornerRadii;
  effects?: Effect[];
  blendMode?: BlendMode;

  // Responsive & Constraints
  constraints?: ResponsiveConstraints;
  sizing?: SizingConstraints;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  // Component & Instance Architecture
  isComponent?: boolean;
  componentId?: string; // Component definition ID
  instanceOf?: string; // Source component ID for instances
  overrides?: Record<string, any>; // Instance property overrides
  variantProperties?: Record<string, string>; // e.g. { size: 'lg', state: 'hover' }

  // Vector Masks & Boolean Operations
  isMask?: boolean;
  maskMode?: 'alpha' | 'vector';
  booleanOp?: 'union' | 'subtract' | 'intersect' | 'exclude';

  // Annotations & Code Mapping
  annotations?: NodeAnnotations;
  codeMapping?: NodeCodeMapping;

  // Export metadata
  exportSettings?: {
    format: 'png' | 'svg' | 'html' | 'react';
    scale?: number;
  };
}

// 1. Shapes
export interface RectangleNode extends BaseNode {
  type: 'rectangle';
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  cornerRadius: number | CornerRadii;
}

export interface EllipseNode extends BaseNode {
  type: 'ellipse';
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
}

export interface LineNode extends BaseNode {
  type: 'line';
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  x2?: number;
  y2?: number;
}

export interface ArrowNode extends BaseNode {
  type: 'arrow';
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  arrowStart: ArrowMarker;
  arrowEnd: ArrowMarker;
}

export interface PolygonNode extends BaseNode {
  type: 'polygon';
  sides: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
}

export interface PencilPoint {
  x: number;
  y: number;
}

export interface PencilNode extends BaseNode {
  type: 'pencil';
  points: PencilPoint[];
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fill?: string;
  isClosed?: boolean;
}

// 2. Vector Icons
export interface IconNode extends BaseNode {
  type: 'icon';
  iconName: string;
  color: string;
  strokeWidth?: number;
}

// 3. Text
export interface TextNode extends BaseNode {
  type: 'text';
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontStyle: 'normal' | 'italic';
  fill: string; // text color
  textAlign: TextAlign;
  lineHeight: number;
  letterSpacing: number;
  autoWidth?: boolean;
  textStyleId?: string;
}

// 4. Containers
export interface FrameNode extends BaseNode {
  type: 'frame';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number | CornerRadii;
  clipContent: boolean;
  children?: ChigmaNode[];
  autoLayout?: AutoLayoutConfig;
  layoutGrid?: {
    columns: number;
    gutter: number;
    margin: number;
    visible: boolean;
  };
}

export interface GroupNode extends BaseNode {
  type: 'group';
  children: ChigmaNode[];
  autoLayout?: AutoLayoutConfig;
}

// 5. Media & Assets
export interface ImageNode extends BaseNode {
  type: 'image';
  src: string; // Base64 data URL or local asset reference
  objectFit: 'contain' | 'cover' | 'fill' | 'crop';
  cornerRadius: number | CornerRadii;
  stroke?: string;
  strokeWidth?: number;
  cropRect?: { x: number; y: number; width: number; height: number };
}

export interface SvgNode extends BaseNode {
  type: 'svg';
  svgContent: string; // Sanitized raw SVG vector markup
  preserveAspectRatio?: string;
}

// 6. Charts
export interface BarChartNode extends BaseNode {
  type: 'bar-chart';
  data: ChartDataItem[];
  showGrid: boolean;
  showLabels: boolean;
  showAxis: boolean;
  colors: string[];
  title?: string;
}

export interface LineChartNode extends BaseNode {
  type: 'line-chart';
  data: ChartDataItem[];
  showGrid: boolean;
  showLabels: boolean;
  showAxis: boolean;
  colors: string[];
  title?: string;
  curved?: boolean;
}

export interface PieChartNode extends BaseNode {
  type: 'pie-chart';
  data: ChartDataItem[];
  showLabels: boolean;
  colors: string[];
  title?: string;
}

export interface DonutChartNode extends BaseNode {
  type: 'donut-chart';
  data: ChartDataItem[];
  showLabels: boolean;
  colors: string[];
  title?: string;
  innerRadiusRatio?: number;
}

// 7. Wireframe Components
export interface ButtonNode extends BaseNode {
  type: 'button';
  label: string;
  variant: ButtonVariant;
  size: ComponentSize;
  cornerRadius: number | CornerRadii;
  fill?: string;
  textColor?: string;
  icon?: string;
}

export interface InputNode extends BaseNode {
  type: 'input';
  label?: string;
  placeholder: string;
  value?: string;
  inputType?: 'text' | 'password' | 'email' | 'number' | 'search';
  cornerRadius: number | CornerRadii;
  disabled?: boolean;
}

export interface TextareaNode extends BaseNode {
  type: 'textarea';
  label?: string;
  placeholder: string;
  value?: string;
  rows?: number;
  cornerRadius: number | CornerRadii;
}

export interface CheckboxNode extends BaseNode {
  type: 'checkbox';
  label: string;
  checked: boolean;
}

export interface RadioNode extends BaseNode {
  type: 'radio';
  label: string;
  checked: boolean;
}

export interface ToggleNode extends BaseNode {
  type: 'toggle';
  label?: string;
  checked: boolean;
}

export interface DropdownNode extends BaseNode {
  type: 'dropdown';
  label?: string;
  placeholder: string;
  options: string[];
  selectedIndex?: number;
  isOpen?: boolean;
  cornerRadius: number | CornerRadii;
}

export interface NavbarNode extends BaseNode {
  type: 'navbar';
  brandName: string;
  links: string[];
  showAvatar?: boolean;
  showSearch?: boolean;
  fill?: string;
  textColor?: string;
}

export interface SidebarNode extends BaseNode {
  type: 'sidebar';
  title: string;
  items: SidebarItem[];
  collapsed?: boolean;
  fill?: string;
}

export interface CardNode extends BaseNode {
  type: 'card';
  title: string;
  subtitle?: string;
  content: string;
  hasImage?: boolean;
  showFooter?: boolean;
  footerText?: string;
  cornerRadius: number | CornerRadii;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface AvatarNode extends BaseNode {
  type: 'avatar';
  name: string;
  imageUrl?: string;
  shape: AvatarShape;
  statusIndicator?: 'none' | 'online' | 'offline' | 'busy';
  fill?: string;
}

export interface BadgeNode extends BaseNode {
  type: 'badge';
  label: string;
  variant: BadgeVariant;
  fill?: string;
  textColor?: string;
}

export interface TableNode extends BaseNode {
  type: 'table';
  headers: string[];
  rows: string[][];
  striped?: boolean;
  bordered?: boolean;
}

export interface TabsNode extends BaseNode {
  type: 'tabs';
  tabs: string[];
  activeIndex: number;
}

export interface BreadcrumbNode extends BaseNode {
  type: 'breadcrumb';
  items: string[];
  separator?: '/' | '>' | '•';
}

export interface ProgressNode extends BaseNode {
  type: 'progress';
  value: number;
  showLabel?: boolean;
  barColor?: string;
}

export interface SliderNode extends BaseNode {
  type: 'slider';
  value: number;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
}

export interface PaginationNode extends BaseNode {
  type: 'pagination';
  currentPage: number;
  totalPages: number;
}

export interface ModalNode extends BaseNode {
  type: 'modal';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  cornerRadius: number | CornerRadii;
}

export interface ToastNode extends BaseNode {
  type: 'toast';
  title: string;
  message: string;
  variant: ToastVariant;
  cornerRadius: number | CornerRadii;
}

// Master discriminated union of all node types
export type ChigmaNode =
  | RectangleNode
  | EllipseNode
  | LineNode
  | ArrowNode
  | PolygonNode
  | PencilNode
  | IconNode
  | TextNode
  | FrameNode
  | GroupNode
  | ImageNode
  | SvgNode
  | BarChartNode
  | LineChartNode
  | PieChartNode
  | DonutChartNode
  | ButtonNode
  | InputNode
  | TextareaNode
  | CheckboxNode
  | RadioNode
  | ToggleNode
  | DropdownNode
  | NavbarNode
  | SidebarNode
  | CardNode
  | AvatarNode
  | BadgeNode
  | TableNode
  | TabsNode
  | BreadcrumbNode
  | ProgressNode
  | SliderNode
  | PaginationNode
  | ModalNode
  | ToastNode;

export type NodeType = ChigmaNode['type'];

export function isContainerNode(node: ChigmaNode): node is FrameNode | GroupNode {
  return node.type === 'frame' || node.type === 'group';
}

export function isShapeNode(node: ChigmaNode): node is RectangleNode | EllipseNode | LineNode | ArrowNode | PolygonNode | PencilNode {
  return ['rectangle', 'ellipse', 'line', 'arrow', 'polygon', 'pencil'].includes(node.type);
}

export function isChartNode(node: ChigmaNode): node is BarChartNode | LineChartNode | PieChartNode | DonutChartNode {
  return ['bar-chart', 'line-chart', 'pie-chart', 'donut-chart'].includes(node.type);
}

export function isWireframeNode(node: ChigmaNode): boolean {
  return [
    'button', 'input', 'textarea', 'checkbox', 'radio', 'toggle', 'dropdown',
    'navbar', 'sidebar', 'card', 'avatar', 'badge', 'table', 'tabs',
    'breadcrumb', 'progress', 'slider', 'pagination', 'modal', 'toast'
  ].includes(node.type);
}
