import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, AlertCircle, BarChart, Brain } from "lucide-react";
export function Feedback() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const events = [{
    id: 1,
    title: "Severe Weather Alert",
    type: "Weather",
    confidence: 85,
    status: "Pending Validation",
    timestamp: "2 hours ago"
  }, {
    id: 2,
    title: "Economic Disruption Warning",
    type: "Economic",
    confidence: 72,
    status: "Validated",
    timestamp: "4 hours ago"
  }, {
    id: 3,
    title: "Social Unrest Prediction",
    type: "Social",
    confidence: 68,
    status: "Needs Review",
    timestamp: "6 hours ago"
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Feedback & System Optimization
        </h1>
      </div>
      {/* Event Validation Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            Event Validation
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {events.map(event => <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ThumbsUp className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ThumbsDown className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Status: {event.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Confidence: {event.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">
                      Credibility Rating:
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(rating => <button key={rating} onClick={() => setSelectedRating(rating)} className={`p-1 rounded-full ${selectedRating === rating ? "text-yellow-500" : "text-gray-300"}`}>
                          <Star className="w-5 h-5" fill={selectedRating && rating <= selectedRating ? "currentColor" : "none"} />
                        </button>)}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* AI Model Feedback Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            AI Model Performance
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Model Accuracy</h3>
                  <p className="text-sm text-gray-500">
                    Based on user validations
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Last 7 days</span>
                  <span className="text-sm font-medium text-gray-900">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{
                  width: "87%"
                }}></div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    Feedback Implementation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Model improvements based on feedback
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{
                  width: "92%"
                }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}