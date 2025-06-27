"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Clock, Zap, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/Navigation"
import ChartPanel from "@/components/ChartPanel"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data
  const analyticsData = {
    totalDetections: 1247,
    accuracyRate: 87.3,
    energySaved: 23.5,
    avgResponseTime: 1.2,
    peakHours: "6:00 PM - 9:00 PM",
    mostActiveRoom: "Living Room",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Analytics Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Performance insights and usage statistics</p>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{analyticsData.totalDetections.toLocaleString()}</div>
              <p className="text-xs text-slate-600">+12% from last period</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analyticsData.accuracyRate}%</div>
              <p className="text-xs text-slate-600">+2.1% improvement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analyticsData.energySaved}%</div>
              <p className="text-xs text-slate-600">Compared to manual control</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{analyticsData.avgResponseTime}s</div>
              <p className="text-xs text-slate-600">Average detection to action</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel
                title="Daily Activity"
                description="Occupancy detections over time"
                type="line"
                timeRange={timeRange}
              />

              <ChartPanel title="Room Usage" description="Most active rooms" type="bar" timeRange={timeRange} />
            </div>

            <ChartPanel
              title="Hourly Patterns"
              description="Peak usage hours throughout the day"
              type="area"
              timeRange={timeRange}
            />
          </TabsContent>

          <TabsContent value="occupancy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel
                title="Occupancy Rate"
                description="Percentage of time rooms are occupied"
                type="donut"
                timeRange={timeRange}
              />

              <ChartPanel
                title="Detection Confidence"
                description="AI confidence levels over time"
                type="line"
                timeRange={timeRange}
              />
            </div>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel
                title="Energy Consumption"
                description="Lighting energy usage patterns"
                type="area"
                timeRange={timeRange}
              />

              <ChartPanel
                title="Savings Breakdown"
                description="Energy saved by room"
                type="bar"
                timeRange={timeRange}
              />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel
                title="System Performance"
                description="Response times and accuracy"
                type="line"
                timeRange={timeRange}
              />

              <ChartPanel
                title="Error Rates"
                description="False positives and negatives"
                type="bar"
                timeRange={timeRange}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card className="mt-8 bg-white/60 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Usage Patterns</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Peak Hours</span>
                    <span className="font-medium text-slate-900">{analyticsData.peakHours}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Most Active Room</span>
                    <span className="font-medium text-slate-900">{analyticsData.mostActiveRoom}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Average Daily Detections</span>
                    <span className="font-medium text-slate-900">178</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900 text-sm">Optimize Detection Interval</div>
                    <div className="text-blue-700 text-xs mt-1">
                      Consider reducing interval to 2s during peak hours for better responsiveness
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900 text-sm">Energy Efficiency</div>
                    <div className="text-green-700 text-xs mt-1">
                      Current settings are saving 23.5% energy compared to manual control
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="font-medium text-purple-900 text-sm">System Performance</div>
                    <div className="text-purple-700 text-xs mt-1">
                      AI accuracy has improved by 2.1% this week - system is learning well
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
