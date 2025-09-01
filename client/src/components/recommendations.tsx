import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import type { PortfolioAnalysis } from "@shared/schema";

interface RecommendationsProps {
  analysis?: PortfolioAnalysis;
}

export default function Recommendations({ analysis }: RecommendationsProps) {
  if (!analysis || !analysis.recommendations || analysis.recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <p className="text-sm text-slate-500">Personalized insights</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-500">No recommendations available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200',
          icon: 'text-amber-600',
          title: 'text-amber-800',
          message: 'text-amber-700',
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          title: 'text-green-800',
          message: 'text-green-700',
        };
      case 'info':
        return {
          container: 'bg-slate-50 border-slate-200',
          icon: 'text-slate-600',
          title: 'text-slate-800',
          message: 'text-slate-700',
        };
      default:
        return {
          container: 'bg-slate-50 border-slate-200',
          icon: 'text-slate-600',
          title: 'text-slate-800',
          message: 'text-slate-700',
        };
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200/50">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          AI Recommendations
        </CardTitle>
        <p className="text-sm text-slate-600">Personalized insights</p>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        {analysis.recommendations.map((recommendation, index) => {
          const styles = getStyles(recommendation.type);
          const Icon = () => getIcon(recommendation.type);
          
          return (
            <div
              key={index}
              className={`group/item border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${styles.container}`}
              data-testid={`recommendation-${recommendation.type}-${index}`}
            >
              <div className="flex items-start">
                <div className={`mt-1 mr-3 transition-all duration-300 transform group-hover/item:scale-110 group-hover/item:rotate-3 ${styles.icon}`}>
                  <Icon />
                </div>
                <div>
                  <h4 className={`text-sm font-semibold transition-colors duration-300 ${styles.title}`}>
                    {recommendation.title}
                  </h4>
                  <p className={`text-sm mt-1 transition-colors duration-300 ${styles.message}`}>
                    {recommendation.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
