"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Camera, Users, Lightbulb, Activity, Clock, Zap } from "lucide-react"
import Navigation from "@/components/Navigation"
import { useRooms } from "@/hooks/useRooms"
import { Room } from "@/types/Room"
import LiveCamButton from "@/components/LiveCamButton"
import { useOccupancyStatus } from "@/hooks/useOccupancyStatus"

export default function LiveMonitorPage() {
  const { rooms, getLiveMonitoringRooms } = useRooms()
  const { updateOccupancyStatus } = useOccupancyStatus()
  const [masterMonitoring, setMasterMonitoring] = useState(true)
  const [stats, setStats] = useState({
    totalDetections: 0,
    lightSwitches: 0,
    uptime: "00:00:00",
  })

  const liveRooms = getLiveMonitoringRooms()

  useEffect(() => {
    // Update uptime every second
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const hours = Math.floor(elapsed / 3600000)
      const minutes = Math.floor((elapsed % 3600000) / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)

      setStats((prev) => ({
        ...prev,
        uptime: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleDetectionResult = (roomId: string, isOccupied: boolean) => {
    updateOccupancyStatus(roomId, isOccupied ? "occupied" : "empty")
    setStats((prev) => ({
      ...prev,
      totalDetections: prev.totalDetections + 1,
      lightSwitches: prev.lightSwitches + 1,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Live Monitoring Center</h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Real-time AI-powered occupancy detection and lighting control</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">Master Control</span>
              <Switch checked={masterMonitoring} onCheckedChange={setMasterMonitoring} />
            </div>
            <Badge 
              variant={masterMonitoring ? "default" : "secondary"} 
              className={`px-3 py-1 transition-all duration-300 ${masterMonitoring ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg shadow-blue-500/25" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
            >
              {masterMonitoring ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{liveRooms.length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Live Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDetections}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.lightSwitches}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Light Switches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.uptime}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Monitoring Rooms */}
        {liveRooms.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors duration-300">Active Monitoring</h2>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 transition-all duration-300">
                {liveRooms.length} room{liveRooms.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveRooms.map((room: Room) => (
                <Card key={room.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-900 dark:text-white">{room.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700">
                          <Eye className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                        <div
                          className={`w-3 h-3 rounded-full ${room.occupancyStatus === "occupied" ? "bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse shadow-lg shadow-blue-400/50" : "bg-slate-400 dark:bg-slate-600"}`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Room Status */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Occupancy</span>
                      </div>
                      <Badge variant={room.occupancyStatus === "occupied" ? "default" : "secondary"} 
                        className={room.occupancyStatus === "occupied" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg shadow-blue-500/25" : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300"}>
                        {room.occupancyStatus === "occupied" ? "Occupied" : "Empty"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Lights</span>
                      </div>
                      <Badge variant={room.lightStatus === "on" ? "default" : "secondary"}
                        className={room.lightStatus === "on" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg shadow-blue-500/25" : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300"}>
                        {room.lightStatus === "on" ? "ON" : "OFF"}
                      </Badge>
                    </div>

                    {/* Live Camera Feed */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Live Feed</span>
                      </div>

                      <LiveCamButton
                        roomId={room.id}
                        onDetectionResult={(isOccupied) => handleDetectionResult(room.id, isOccupied)}
                        liveMonitoringEnabled={true}
                        className="w-full"
                      />
                    </div>

                    {/* AI Status */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800 transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <Activity className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">AI Engine</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">YOLOv8 Active</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                        <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">Processing</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <CardContent className="p-12 text-center">
              <EyeOff className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors duration-300">No Live Monitoring Active</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-300">
                Enable live monitoring for rooms to see real-time AI analysis and automatic light control.
              </p>
              <Button
                onClick={() => (window.location.href = "/rooms")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
              >
                Configure Rooms
              </Button>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <Separator className="my-8" />

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white transition-colors duration-300">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">AI Engine</p>
                <p className="text-slate-600 dark:text-slate-400">YOLOv8 Person Detection</p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Detection Interval</p>
                <p className="text-slate-600 dark:text-slate-400">3 seconds (Live Mode)</p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Confidence Threshold</p>
                <p className="text-slate-600 dark:text-slate-400">70% minimum</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
