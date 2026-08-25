export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface WireframeButtonProps {
  label: string;
  variant: ButtonVariant;
  size?: ComponentSize;
  cornerRadius?: number;
  icon?: string;
}

export interface WireframeInputProps {
  label?: string;
  placeholder: string;
  value?: string;
  inputType?: 'text' | 'password' | 'email' | 'number' | 'search';
  cornerRadius?: number;
  disabled?: boolean;
}

export interface WireframeTextareaProps {
  label?: string;
  placeholder: string;
  value?: string;
  rows?: number;
  cornerRadius?: number;
}

export interface WireframeCheckboxProps {
  label: string;
  checked: boolean;
}

export interface WireframeRadioProps {
  label: string;
  checked: boolean;
}

export interface WireframeToggleProps {
  label?: string;
  checked: boolean;
}

export interface WireframeDropdownProps {
  label?: string;
  placeholder: string;
  options: string[];
  selectedIndex?: number;
  isOpen?: boolean;
  cornerRadius?: number;
}

export interface WireframeNavbarProps {
  brandName: string;
  links: string[];
  showAvatar?: boolean;
  showSearch?: boolean;
}

export interface SidebarItem {
  icon?: string;
  label: string;
  active?: boolean;
  badge?: string;
}

export interface WireframeSidebarProps {
  title: string;
  items: SidebarItem[];
  collapsed?: boolean;
}

export interface WireframeCardProps {
  title: string;
  subtitle?: string;
  content: string;
  hasImage?: boolean;
  showFooter?: boolean;
  footerText?: string;
  cornerRadius?: number;
  fill?: string;
}

export interface WireframeAvatarProps {
  name: string;
  imageUrl?: string;
  shape: AvatarShape;
  statusIndicator?: 'none' | 'online' | 'offline' | 'busy';
}

export interface WireframeBadgeProps {
  label: string;
  variant: BadgeVariant;
}

export interface WireframeTableProps {
  headers: string[];
  rows: string[][];
  striped?: boolean;
  bordered?: boolean;
}

export interface WireframeTabsProps {
  tabs: string[];
  activeIndex: number;
}

export interface WireframeBreadcrumbProps {
  items: string[];
  separator?: '/' | '>' | '•';
}

export interface WireframeProgressProps {
  value: number; // 0-100
  showLabel?: boolean;
  barColor?: string;
}

export interface WireframeSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
}

export interface WireframePaginationProps {
  currentPage: number;
  totalPages: number;
}

export interface WireframeModalProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

export interface WireframeToastProps {
  title: string;
  message: string;
  variant: ToastVariant;
}
