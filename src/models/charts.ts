export interface ChartDataItem {
  id?: string;
  label: string;
  value: number;
  color?: string;
}

export type ChartType = 'bar-chart' | 'line-chart' | 'pie-chart' | 'donut-chart';

export interface ChartBaseProps {
  data: ChartDataItem[];
  showGrid?: boolean;
  showLabels?: boolean;
  showAxis?: boolean;
  showLegend?: boolean;
  title?: string;
  colorScheme?: string[];
}
