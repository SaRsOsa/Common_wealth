import React from "react";
import { Bell, Download, Filter, AlertCircle } from "lucide-react";
export function ReportsAlerts() {
  const alerts = [{
    id: 1,
    title: "Critical Infrastructure Alert",
    severity: "High",
    time: "2 hours ago",
    description: "Potential disruption detected in power grid systems."
  }, {
    id: 2,
    title: "Weather Warning",
    severity: "Medium",
    time: "4 hours ago",
    description: "Severe weather conditions expected in coastal regions."
  }, {
    id: 3,
    title: "Economic Indicator",
    severity: "Low",
    time: "6 hours ago",
    description: "Minor fluctuations detected in market indicators."
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Reports & Alerts
        </h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Active Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map(alert => <div key={alert.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className={`w-6 h-6 ${alert.severity === "High" ? "text-red-500" : alert.severity === "Medium" ? "text-yellow-500" : "text-green-500"}`} />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${alert.severity === "High" ? "bg-red-100 text-red-800" : alert.severity === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{alert.time}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {alert.description}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Reports
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Report #{i}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Generated on Jan {i + 10}, 2024
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
}