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
          <p className="text-sm text-slate-500">Portfolio diversification</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-500">No sector data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = [
    '#1e293b', // Slate-800
    '#475569', // Slate-600
    '#64748b', // Slate-500
    '#f59e0b', // Amber-500
    '#d97706', // Amber-600
    '#22c55e', // Green-500
    '#eab308', // Yellow-500
    '#3b82f6', // Blue-500
    '#8b5cf6', // Violet-500
    '#ef4444', // Red-500
  ];

  const data = {
    labels: analysis.sectorAllocation.map(sector => sector.sector),
    datasets: [
      {
        data: analysis.sectorAllocation.map(sector => sector.percentage),
        backgroundColor: colors.slice(0, analysis.sectorAllocation.length),
        borderWidth: 4,
        borderColor: '#fff',
        hoverBackgroundColor: colors.slice(0, analysis.sectorAllocation.length),
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#1e293b',
          font: { size: 14, weight: 'bold' },
          boxWidth: 18,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#475569',
        borderWidth: 2,
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
    cutout: '55%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 backdrop-blur rounded-2xl shadow-2xl border border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-100">Sector Allocation</CardTitle>
        <p className="text-sm text-slate-200">Portfolio diversification</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4 rounded-xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 p-4 shadow-lg border border-slate-600" data-testid="chart-sector">
          <Doughnut data={data} options={options} />
        </div>
        <div className="space-y-2">
          {analysis.sectorAllocation.map((sector, index) => (
            <div key={sector.sector} className="flex items-center justify-between" data-testid={`sector-${sector.sector.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2 border-2 border-white shadow-md transition-all duration-200" 
                  style={{ backgroundColor: colors[index], boxShadow: `0 0 8px ${colors[index]}` }}
                ></div>
                <span className="text-sm font-semibold text-slate-100">{sector.sector}</span>
              </div>
              <span className="text-sm font-bold text-slate-200">
                {sector.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
