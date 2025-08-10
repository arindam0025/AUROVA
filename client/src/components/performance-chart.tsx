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
        borderColor: 'hsl(203.8863, 88.2845%, 53.1373%)',
        backgroundColor: 'hsla(203.8863, 88.2845%, 53.1373%, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'hsl(203.8863, 88.2845%, 53.1373%)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
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
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            }).format(value);
          },
        },
        grid: {
          color: 'hsl(205.0000, 25.0000%, 90.5882%)',
        },
      },
      x: {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <p className="text-sm text-gray-500">Historical value over time</p>
          </div>
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.label}
                variant={timeframe.active ? "default" : "outline"}
                size="sm"
                className={timeframe.active ? "bg-primary text-white" : ""}
                data-testid={`button-timeframe-${timeframe.label}`}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64" data-testid="chart-performance">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
