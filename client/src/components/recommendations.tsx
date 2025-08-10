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
          <p className="text-sm text-gray-500">Personalized insights</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No recommendations available</p>
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
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
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
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-800',
          message: 'text-gray-700',
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
        <p className="text-sm text-gray-500">Personalized insights</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.recommendations.map((recommendation, index) => {
          const styles = getStyles(recommendation.type);
          const Icon = () => getIcon(recommendation.type);
          
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${styles.container}`}
              data-testid={`recommendation-${recommendation.type}-${index}`}
            >
              <div className="flex items-start">
                <div className={`mt-1 mr-3 ${styles.icon}`}>
                  <Icon />
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${styles.title}`}>
                    {recommendation.title}
                  </h4>
                  <p className={`text-sm mt-1 ${styles.message}`}>
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
