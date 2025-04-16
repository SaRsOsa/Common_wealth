import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardHome } from "../components/DashboardHome";
import { MapView } from "../components/MapView";
import { Timeline } from "../components/Timeline";
import { PredictiveAnalysis } from "../components/PredictiveAnalysis";
import { ReportsAlerts } from "../components/ReportsAlerts";
import { UserManagement } from "../components/UserManagement";
import { Feedback } from "../components/Feedback";
export function Dashboard() {
  return <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/analysis" element={<PredictiveAnalysis />} />
        <Route path="/reports" element={<ReportsAlerts />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </DashboardLayout>;
}