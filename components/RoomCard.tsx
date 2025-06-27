"use client"

import { useState } from "react"
import { Camera, Upload, Lightbulb, Users, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "./StatusBadge"
import UploadImageButton from "./UploadImageButton"
import LiveCamButton from "./LiveCamButton"
import type { Room } from "@/types/Room"
import { useOccupancyStatus } from "@/hooks/useOccupancyStatus"
import { useRooms } from "@/hooks/useRooms"

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const { updateOccupancyStatus } = useOccupancyStatus()
  const { updateRoom } = useRooms()
  const [manualOverride, setManualOverride] = useState(false)

  const handleDetectionResult = (isOccupied: boolean) => {
    updateOccupancyStatus(room.id, isOccupied ? "occupied" : "empty")
  }

  const handleLiveMonitoringToggle = (enabled: boolean) => {
    updateRoom(room.id, {
      ...room,
      liveMonitoringEnabled: enabled,
    })
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">{room.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <StatusBadge status={room.occupancyStatus} type="occupancy" />
            <StatusBadge status={room.lightStatus} type="light" />
            {room.liveMonitoringEnabled && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <Eye className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
        </div>
        {room.description && <p className="text-sm text-slate-600 mt-1">{room.description}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Room Image */}
        <div className="relative">
          <img
            src={room.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={room.name}
            className="w-full h-40 object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${room.occupancyStatus === "occupied" ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="text-xs text-white font-medium">
                {room.occupancyStatus === "occupied" ? "Occupied" : "Empty"}
              </span>
            </div>
          </div>
          {room.liveMonitoringEnabled && (
            <div className="absolute top-2 left-2">
              <div className="bg-green-500/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs text-white font-medium">LIVE</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Monitoring Toggle */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${room.liveMonitoringEnabled ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-slate-400 to-slate-500"}`}
            >
              {room.liveMonitoringEnabled ? (
                <Eye className="w-4 h-4 text-white" />
              ) : (
                <EyeOff className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Live Monitoring</p>
              <p className="text-xs text-slate-600">
                {room.liveMonitoringEnabled ? "AI actively monitoring" : "Manual control mode"}
              </p>
            </div>
          </div>
          <Switch checked={room.liveMonitoringEnabled} onCheckedChange={handleLiveMonitoringToggle} size="sm" />
        </div>

        {/* AI Control Status */}
        {room.liveMonitoringEnabled ? (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">AI Real-time Control</p>
                <p className="text-xs text-slate-600">YOLOv8 Detection Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Manual Control Mode</p>
                <p className="text-xs text-slate-600">Upload images for analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs text-blue-600 font-medium">Ready</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <UploadImageButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            disabled={room.liveMonitoringEnabled}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
              room.liveMonitoringEnabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">{room.liveMonitoringEnabled ? "Disabled" : "Upload Image"}</span>
          </UploadImageButton>

          <LiveCamButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            liveMonitoringEnabled={room.liveMonitoringEnabled}
            className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">{room.liveMonitoringEnabled ? "Live Feed" : "Test Camera"}</span>
          </LiveCamButton>
        </div>

        {/* Manual Override */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Manual Override</span>
          </div>
          <Switch
            checked={manualOverride}
            onCheckedChange={setManualOverride}
            size="sm"
            disabled={room.liveMonitoringEnabled}
          />
        </div>

        {/* Light Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Light Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${room.lightStatus === "on" ? "bg-yellow-400" : "bg-slate-300"}`} />
            <span className={`font-medium ${room.lightStatus === "on" ? "text-yellow-600" : "text-slate-500"}`}>
              {room.liveMonitoringEnabled
                ? room.lightStatus === "on"
                  ? "AI ON"
                  : "AI OFF"
                : room.lightStatus === "on"
                  ? "Manual ON"
                  : "Manual OFF"}
            </span>
          </div>
        </div>

        {/* Live Monitoring Warning */}
        {room.liveMonitoringEnabled && (
          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border-l-2 border-green-400">
            <strong>Live Mode:</strong> AI is continuously monitoring this room. Manual controls are limited while live
            monitoring is active.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
