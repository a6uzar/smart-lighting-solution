"use client"

import { ArrowLeft, TrendingUp, Clock, Zap, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChartPanel from "@/components/ChartPanel"

export default function AnalyticsPage() {
  const stats = {
    totalDetections: 1247,
    avgOccupancyTime: "2.3h",
    energySaved: "45.2kWh",
    peakHours: "9-11 AM",
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Detections</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalDetections}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Avg Occupancy</CardTitle>
                <Clock className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.avgOccupancyTime}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Energy Saved</CardTitle>
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.energySaved}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Peak Hours</CardTitle>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.peakHours}</div>
              <p className="text-xs text-slate-600 mt-1">Most active period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPanel
            title="Occupancy Frequency"
            type="line"
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Detections",
                  data: [65, 78, 90, 81, 56, 45, 38],
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  tension: 0.4,
                },
              ],
            }}
          />

          <ChartPanel
            title="Light Usage by Room"
            type="doughnut"
            data={{
              labels: ["Living Room", "Kitchen", "Bedroom", "Office", "Bathroom"],
              datasets: [
                {
                  data: [30, 25, 20, 15, 10],
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(16, 185, 129, 0.8)",
                    "rgba(245, 158, 11, 0.8)",
                    "rgba(139, 92, 246, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                  ],
                },
              ],
            }}
          />
        </div>

        {/* Activity Log */}
        <Card className="mt-6 bg-white/60 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 minutes ago", action: "Motion detected in Living Room", status: "occupied" },
                { time: "5 minutes ago", action: "Lights turned off in Kitchen", status: "empty" },
                { time: "12 minutes ago", action: "Person detected in Office", status: "occupied" },
                { time: "18 minutes ago", action: "Auto-dimming activated in Bedroom", status: "dimmed" },
                { time: "25 minutes ago", action: "Motion detected in Bathroom", status: "occupied" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-600">{activity.time}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === "occupied"
                        ? "bg-green-100 text-green-800"
                        : activity.status === "empty"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
