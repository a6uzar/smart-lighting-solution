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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Monitoring Center</h1>
            <p className="text-slate-600">Real-time AI-powered occupancy detection and lighting control</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Master Control</span>
              <Switch checked={masterMonitoring} onCheckedChange={setMasterMonitoring} />
            </div>
            <Badge variant={masterMonitoring ? "default" : "secondary"} className="px-3 py-1">
              {masterMonitoring ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{liveRooms.length}</p>
                  <p className="text-sm text-slate-600">Live Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalDetections}</p>
                  <p className="text-sm text-slate-600">Detections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.lightSwitches}</p>
                  <p className="text-sm text-slate-600">Light Switches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.uptime}</p>
                  <p className="text-sm text-slate-600">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Monitoring Rooms */}
        {liveRooms.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-slate-900">Active Monitoring</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {liveRooms.length} room{liveRooms.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveRooms.map((room) => (
                <Card key={room.id} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Eye className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                        <div
                          className={`w-3 h-3 rounded-full ${room.occupancyStatus === "occupied" ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Room Status */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium">Occupancy</span>
                      </div>
                      <Badge variant={room.occupancyStatus === "occupied" ? "default" : "secondary"}>
                        {room.occupancyStatus === "occupied" ? "Occupied" : "Empty"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium">Lights</span>
                      </div>
                      <Badge variant={room.lightStatus === "on" ? "default" : "secondary"}>
                        {room.lightStatus === "on" ? "ON" : "OFF"}
                      </Badge>
                    </div>

                    {/* Live Camera Feed */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium">Live Feed</span>
                      </div>

                      <LiveCamButton
                        roomId={room.id}
                        onDetectionResult={(isOccupied) => handleDetectionResult(room.id, isOccupied)}
                        liveMonitoringEnabled={true}
                        className="w-full"
                      />
                    </div>

                    {/* AI Status */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Activity className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">AI Engine</p>
                          <p className="text-xs text-slate-600">YOLOv8 Active</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600 font-medium">Processing</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <EyeOff className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Live Monitoring Active</h3>
              <p className="text-slate-600 mb-6">
                Enable live monitoring for rooms to see real-time AI analysis and automatic light control.
              </p>
              <Button
                onClick={() => (window.location.href = "/rooms")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Configure Rooms
              </Button>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <Separator className="my-8" />

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-900">AI Engine</p>
                <p className="text-slate-600">YOLOv8 Person Detection</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Detection Interval</p>
                <p className="text-slate-600">3 seconds (Live Mode)</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Confidence Threshold</p>
                <p className="text-slate-600">70% minimum</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
