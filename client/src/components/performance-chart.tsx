import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { PortfolioAnalysis } from "@shared/schema";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceChartProps {
  analysis?: PortfolioAnalysis;
}

export default function PerformanceChart({ analysis }: PerformanceChartProps) {
  // Generate mock historical data for demonstration
  const generateHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentValue = analysis?.totalValue || 127456;
    const baseValue = analysis?.totalCost || 113000;
    
    // Generate realistic progression from cost basis to current value
    const values = [];
    for (let i = 0; i < months.length; i++) {
      const progress = i / (months.length - 1);
      const randomVariation = (Math.random() - 0.5) * 0.1; // ±5% random variation
      const value = baseValue + (currentValue - baseValue) * progress * (1 + randomVariation);
      values.push(Math.max(baseValue * 0.9, value)); // Don't go below 90% of cost basis
    }
    
    return { months, values };
  };

  const { months, values } = generateHistoricalData();

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Portfolio Value',
        data: values,
        borderColor: 'rgba(30,41,59,1)', // slate-800
        backgroundColor: 'rgba(30,41,59,0.15)',
        tension: 0.5,
        fill: true,
        pointBackgroundColor: 'rgba(30,41,59,1)',
        pointBorderColor: 'rgba(255,255,255,0.85)',
        pointBorderWidth: 3,
        pointRadius: 6,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(30,41,59,0.3)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30,41,59,0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#475569',
        borderWidth: 2,
        callbacks: {
          label: function(context: any) {
            return `Portfolio Value: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: '#475569',
          font: { weight: 'bold' },
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            }).format(value);
          },
        },
        grid: {
          color: 'rgba(30,41,59,0.1)',
        },
      },
      x: {
        ticks: {
          color: '#475569',
          font: { weight: 'bold' },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const timeframes = [
    { label: '1M', active: true },
    { label: '3M', active: false },
    { label: '6M', active: false },
    { label: '1Y', active: false },
  ];

  return (
    <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-slate-300">Portfolio Performance</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Historical value over time</p>
          </div>
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.label}
                variant={timeframe.active ? "default" : "outline"}
                size="sm"
                className={timeframe.active ? "bg-slate-800 text-white" : ""}
                data-testid={`button-timeframe-${timeframe.label}`}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 rounded-xl bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4 shadow-lg border border-slate-200 dark:border-slate-700" data-testid="chart-performance">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
