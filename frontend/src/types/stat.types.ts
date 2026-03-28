export interface StatData {
  id: string;
  title: string;
  category: string;
  date: string;
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  chartData: any;
  link: string;
}