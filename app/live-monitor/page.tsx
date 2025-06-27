"use client"

import { useState, useEffect } from "react"
import { Activity, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import Navigation from "@/components/Navigation"
import LiveCameraFeed from "@/components/LiveCameraFeed"
import { useRooms } from "@/hooks/useRooms"
import { useLiveMonitoring } from "@/hooks/useLiveMonitoring"

export default function LiveMonitorPage() {
  const { rooms } = useRooms()
  const { isMonitoring, startMonitoring, stopMonitoring, detectionSettings, updateDetectionSettings, monitoringStats } =
    useLiveMonitoring()

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  useEffect(() => {
    // Auto-select first room if available
    if (rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(rooms[0].id)
    }
  }, [rooms, selectedRoom])

  const activeRooms = rooms.filter((room) => room.aiControlEnabled)
  const occupiedRooms = rooms.filter((room) => room.occupancyStatus === "occupied")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Monitoring</h1>
          <p className="text-slate-600">Real-time AI-powered occupancy detection and lighting control</p>
        </div>

        {/* Monitoring Controls */}
        <Card className="mb-8 bg-white/60 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Master Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">Live Monitoring</h3>
                    <p className="text-sm text-slate-600">Enable continuous AI detection</p>
                  </div>
                  <Switch
                    checked={isMonitoring}
                    onCheckedChange={isMonitoring ? stopMonitoring : startMonitoring}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-400 animate-pulse" : "bg-slate-300"}`}
                  />
                  <span className="text-sm text-slate-600">{isMonitoring ? "Active" : "Inactive"}</span>
                </div>
              </div>

              {/* Detection Settings */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Detection Settings</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">
                      Detection Interval: {detectionSettings.interval}s
                    </label>
                    <Slider
                      value={[detectionSettings.interval]}
                      onValueChange={([value]) => updateDetectionSettings({ interval: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">
                      Confidence Threshold: {detectionSettings.confidence}%
                    </label>
                    <Slider
                      value={[detectionSettings.confidence]}
                      onValueChange={([value]) => updateDetectionSettings({ confidence: value })}
                      min={50}
                      max={95}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Statistics</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{activeRooms.length}</div>
                    <div className="text-xs text-blue-600">Active Rooms</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{occupiedRooms.length}</div>
                    <div className="text-xs text-green-600">Occupied</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{monitoringStats.totalDetections}</div>
                    <div className="text-xs text-purple-600">Detections</div>
                  </div>

                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{monitoringStats.lightSwitches}</div>
                    <div className="text-xs text-orange-600">Auto Switches</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Camera Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeRooms.map((room) => (
            <Card key={room.id} className="bg-white/60 backdrop-blur-sm border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={room.occupancyStatus === "occupied" ? "default" : "secondary"}
                      className={room.occupancyStatus === "occupied" ? "bg-green-600" : ""}
                    >
                      {room.occupancyStatus === "occupied" ? "Occupied" : "Empty"}
                    </Badge>
                    <Badge
                      variant={room.lightStatus === "on" ? "default" : "secondary"}
                      className={room.lightStatus === "on" ? "bg-yellow-600" : ""}
                    >
                      {room.lightStatus === "on" ? "Lights ON" : "Lights OFF"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <LiveCameraFeed
                  roomId={room.id}
                  roomName={room.name}
                  isMonitoring={isMonitoring}
                  detectionSettings={detectionSettings}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Active Rooms */}
        {activeRooms.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Active Monitoring</h3>
              <p className="text-slate-600 mb-4">Enable AI control for rooms to start live monitoring</p>
              <Button asChild>
                <a href="/rooms">Configure Rooms</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
