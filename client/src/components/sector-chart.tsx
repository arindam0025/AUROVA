import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { PortfolioAnalysis } from "@shared/schema";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SectorChartProps {
  analysis?: PortfolioAnalysis;
}

export default function SectorChart({ analysis }: SectorChartProps) {
  if (!analysis || !analysis.sectorAllocation || analysis.sectorAllocation.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sector Allocation</CardTitle>
          <p className="text-sm text-gray-500">Portfolio diversification</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No sector data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = [
    'hsl(203.8863, 88.2845%, 53.1373%)', // Primary blue
    'hsl(159.7826, 100%, 36.0784%)',     // Green
    'hsl(42.0290, 92.8251%, 56.2745%)',  // Yellow
    'hsl(147.1429, 78.5047%, 41.9608%)', // Dark green
    'hsl(341.4894, 75.2000%, 50.9804%)', // Pink
  ];

  const data = {
    labels: analysis.sectorAllocation.map(sector => sector.sector),
    datasets: [
      {
        data: analysis.sectorAllocation.map(sector => sector.percentage),
        backgroundColor: colors.slice(0, analysis.sectorAllocation.length),
        borderWidth: 0,
        hoverBackgroundColor: colors.slice(0, analysis.sectorAllocation.length),
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
            const sector = analysis.sectorAllocation[context.dataIndex];
            return `${context.label}: ${context.parsed.toFixed(1)}% (${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(sector.value)})`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Allocation</CardTitle>
        <p className="text-sm text-gray-500">Portfolio diversification</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4" data-testid="chart-sector">
          <Doughnut data={data} options={options} />
        </div>
        <div className="space-y-2">
          {analysis.sectorAllocation.map((sector, index) => (
            <div key={sector.sector} className="flex items-center justify-between" data-testid={`sector-${sector.sector.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: colors[index] }}
                ></div>
                <span className="text-sm text-gray-600">{sector.sector}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {sector.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
