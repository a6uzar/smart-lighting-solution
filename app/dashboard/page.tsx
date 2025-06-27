"use client"
import { Home, Lightbulb, Users, Activity, Zap, Camera, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import RoomCard from "@/components/RoomCard"
import { useRooms } from "@/hooks/useRooms"
import { useLiveMonitoring } from "@/hooks/useLiveMonitoring"

export default function DashboardPage() {
  const { rooms, isLoading } = useRooms()
  const { isMonitoring, monitoringStats } = useLiveMonitoring()

  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((room) => room.occupancyStatus === "occupied").length
  const lightsOn = rooms.filter((room) => room.lightStatus === "on").length
  const aiControlledRooms = rooms.filter((room) => room.aiControlEnabled).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Smart Lighting Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">AI-powered occupancy detection and automated lighting control</p>
        </div>

        {/* System Status */}
        <Card className="mb-8 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isMonitoring ? "bg-green-400 animate-pulse" : "bg-slate-300"}`}
                  />
                  <span className="font-medium text-slate-900">
                    Live Monitoring: {isMonitoring ? "Active" : "Inactive"}
                  </span>
                </div>

                <Badge variant={isMonitoring ? "default" : "secondary"} className={isMonitoring ? "bg-green-600" : ""}>
                  {aiControlledRooms} AI Rooms Active
                </Badge>
              </div>

              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span>{monitoringStats.totalDetections} detections</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{monitoringStats.lightSwitches} auto switches</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark-text-secondary">Total Rooms</CardTitle>
              <Home className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark-text-primary">{totalRooms}</div>
              <p className="text-xs dark-text-secondary">{aiControlledRooms} with AI control</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark-text-secondary">Occupied Rooms</CardTitle>
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{occupiedRooms}</div>
              <p className="text-xs dark-text-secondary">
                {totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}% occupancy rate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark-text-secondary">Lights Active</CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lightsOn}</div>
              <p className="text-xs dark-text-secondary">Auto-controlled lighting</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark-text-secondary">AI Detections</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{monitoringStats.totalDetections}</div>
              <p className="text-xs dark-text-secondary">Total AI detections today</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 glass-card">
          <CardHeader>
            <CardTitle className="dark-text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <a href="/live-monitor">
                  <Camera className="w-4 h-4 mr-2" />
                  Live Monitor
                </a>
              </Button>

              <Button asChild variant="outline">
                <a href="/rooms">
                  <Home className="w-4 h-4 mr-2" />
                  Manage Rooms
                </a>
              </Button>

              <Button asChild variant="outline">
                <a href="/automation">
                  <Zap className="w-4 h-4 mr-2" />
                  Automation Rules
                </a>
              </Button>

              <Button asChild variant="outline">
                <a href="/analytics">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Rooms */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold dark-text-primary">Recent Activity</h2>
            <Button asChild variant="outline" size="sm">
              <a href="/rooms">View All Rooms</a>
            </Button>
          </div>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(0, 6).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="text-center py-12">
                <Home className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium dark-text-primary mb-2">No Rooms Yet</h3>
                <p className="dark-text-secondary mb-4">Create your first room to start using AI-powered lighting control</p>
                <Button asChild>
                  <a href="/rooms">Add Your First Room</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
