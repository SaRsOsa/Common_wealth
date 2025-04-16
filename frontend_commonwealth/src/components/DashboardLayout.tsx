import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Map, LineChart, Bell, Users, Search, User, Settings, LogOut, BoxIcon, MessageSquare } from "lucide-react";
export function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const menuItems = [{
    icon: Home,
    label: "Home",
    path: "/dashboard"
  }, {
    icon: Map,
    label: "Real-time Map",
    path: "/dashboard/map"
  }, {
    icon: BoxIcon,
    label: "Event Timeline",
    path: "/dashboard/timeline"
  }, {
    icon: LineChart,
    label: "Predictive Analysis",
    path: "/dashboard/analysis"
  }, {
    icon: Bell,
    label: "Reports & Alerts",
    path: "/dashboard/reports"
  }, {
    icon: Users,
    label: "User Management",
    path: "/dashboard/users"
  }, {
    icon: MessageSquare,
    label: "Feedback & Optimization",
    path: "/dashboard/feedback"
  }];
  return <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Early Warning</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 ${location.pathname === item.path ? "bg-blue-50 text-blue-600" : ""}`}>
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>)}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Profile
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>;
}