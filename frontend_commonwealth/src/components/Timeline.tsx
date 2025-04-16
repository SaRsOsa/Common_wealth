import React from "react";
import { Calendar, Filter, Circle } from "lucide-react";
export function Timeline() {
  const events = [{
    id: 1,
    title: "Severe Weather Alert",
    date: "2024-01-15",
    type: "Weather",
    severity: "High",
    description: "Tropical storm warning issued for coastal regions"
  }, {
    id: 2,
    title: "Social Unrest Report",
    date: "2024-01-14",
    type: "Social",
    severity: "Medium",
    description: "Protests reported in urban centers"
  }, {
    id: 3,
    title: "Economic Indicator Alert",
    date: "2024-01-13",
    type: "Economic",
    severity: "Low",
    description: "Market volatility detected in key sectors"
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Event Timeline</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </button>
          <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="space-y-8">
            {events.map(event => <div key={event.id} className="relative">
                <div className="flex items-start">
                  <div className="flex items-center h-16">
                    <Circle className="w-4 h-4 text-blue-500" fill="currentColor" />
                    {event.id !== events.length && <div className="h-full w-0.5 bg-gray-200 ml-2"></div>}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${event.severity === "High" ? "bg-red-100 text-red-800" : event.severity === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {event.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}