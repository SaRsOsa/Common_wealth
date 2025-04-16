import React from "react";
import { AlertCircle, TrendingUp, AlertTriangle, Filter } from "lucide-react";
import { useQuery } from 'react-query';
import { api } from '../api';

interface NewsArticle {
  title: string;
  source: {
    name: string;
  };
  url: string;
  description?: string;
}

export function DashboardHome() {
  const {
    data: news,
    isLoading,
    error
  } = useQuery<NewsArticle[], Error>('news', async () => {
    const response = await api.get('/news');
    if (!response.data) throw new Error('Failed to load news alerts');
    return response.data;
  }, {
    staleTime: 20 * 1000,
    refetchInterval: 20 * 1000,
    refetchOnWindowFocus: true
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Active Alerts
              </h3>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Risk Trend</h3>
              <p className="text-2xl font-semibold text-gray-900">Stable</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Reviews
              </h3>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* News alerts section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            Latest News Alerts
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map((i: number) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                Error loading news: {error.message}
              </div>
            ) : news?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No current news alerts available
              </div>
            ) : (
              news?.map((article: NewsArticle, i: number) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Source: {article.source.name}
                      {article.description && ` • ${article.description}`}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      News
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}