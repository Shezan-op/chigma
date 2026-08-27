export type IconCategory =
  | 'navigation'
  | 'actions'
  | 'communication'
  | 'media'
  | 'commerce'
  | 'files'
  | 'users'
  | 'settings'
  | 'status'
  | 'arrows'
  | 'editor'
  | 'social';

export interface IconDefinition {
  name: string;
  category: IconCategory;
  svgPath: string; // SVG inner path data or elements
  viewBox?: string;
  tags?: string[];
}
