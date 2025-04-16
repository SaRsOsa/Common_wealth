import React from "react";
import { useQuery } from "react-query";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";
import { api } from "../api";

interface AnalysisResult {
  url: any;
  publishedAt: string | number | Date;
  title: string;
  summary: string;
  content: string;
  status: 'success' | 'error';
}

interface NewsArticle {
  title: string;
  description: string;
  content: string; // Full article text
  url: string;
  publishedAt: string;
}

export function PredictiveAnalysis() {
  const { data: news } = useQuery<NewsArticle[]>("news");

  const {
    data: insights,
    isLoading,
    error,
    refetch
  } = useQuery<AnalysisResult[], Error>(
    "analysis",
    async () => {
      const response = await api.post("/analyze-news", {
        articles: news?.slice(0, 3) // Send actual news data
      });
      return response.data;
    },
    {
      enabled: !!news?.length, // Only run when news exists
      staleTime: 30000
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Predictive Analysis
        </h1>
        <button
          onClick={() => refetch()}
          className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Insights
        </button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>
            Error loading insights: {error.message}
          </span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {insights?.map((insight) => (
            <div key={insight.title} className="p-6 bg-white rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">{insight.title}</h2>

              <div className="mb-4 text-sm text-gray-500">
                Published: {new Date(insight.publishedAt).toLocaleDateString()}
                {insight.url && (
                  <a href={insight.url} target="_blank" rel="noopener noreferrer"
                    className="ml-4 text-blue-600 hover:underline">
                    Read full article
                  </a>
                )}
              </div>

              {insight.status === 'success' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded">
                    <h3 className="font-medium mb-2">Key Analysis:</h3>
                    <div className="whitespace-pre-line text-gray-700">
                      {insight.summary}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <h4 className="font-medium mb-2">Excerpt from article:</h4>
                    <p className="italic">{insight.content}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded">
                  <AlertCircle className="inline-block w-5 h-5 mr-2" />
                  {insight.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}