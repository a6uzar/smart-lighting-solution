"use client"

import { useState, useEffect } from "react"
import { Camera, Upload, Users, Eye, EyeOff, Settings, Sliders } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import StatusBadge from "./StatusBadge"
import UploadImageButton from "./UploadImageButton"
import LiveCamButton from "./LiveCamButton"
import LiveCameraDisplay from "./LiveCameraDisplay"
import ManualLightControls from "./ManualLightControls"
import type { Room } from "@/types/Room"
import { useOccupancyStatus } from "@/hooks/useOccupancyStatus"
import { useRooms } from "@/hooks/useRooms"

interface RoomCardProps {
  room: Room
  onEdit?: () => void
}

export default function RoomCard({ room, onEdit }: RoomCardProps) {
  const { updateOccupancyStatus } = useOccupancyStatus()
  const { updateRoom } = useRooms()
  const [isLiveActive, setIsLiveActive] = useState(room.liveMonitoringEnabled)
  const [showLightControls, setShowLightControls] = useState(false)

  // Update live state when room prop changes
  useEffect(() => {
    setIsLiveActive(room.liveMonitoringEnabled)
  }, [room.liveMonitoringEnabled])

  const handleDetectionResult = (isOccupied: boolean, confidence?: number) => {
    updateOccupancyStatus(room.id, isOccupied ? "occupied" : "empty")
  }

  const handleLiveMonitoringToggle = async (enabled: boolean) => {
    // Update local state immediately for instant UI feedback
    setIsLiveActive(enabled)

    // Update persistent storage
    updateRoom(room.id, {
      name: room.name,
      description: room.description,
      imageUrl: room.imageUrl,
      occupancyStatus: room.occupancyStatus,
      lightStatus: room.lightStatus,
      liveMonitoringEnabled: enabled,
      aiControlEnabled: room.aiControlEnabled,
    })
  }

  const handleLightSettingsChange = (settings: any) => {
    // Handle light settings changes
    console.log(`Light settings updated for room ${room.id}:`, settings)

    // Update room light status based on manual override
    if (settings.manualOverride) {
      updateRoom(room.id, {
        ...room,
        lightStatus: settings.isOn ? "on" : "off",
      })
    }
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 group overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{room.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <StatusBadge status={room.occupancyStatus} type="occupancy" />
            <StatusBadge status={room.lightStatus} type="light" />
            {isLiveActive && (
              <Badge
                variant="secondary"
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
              >
                <Eye className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {room.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{room.description}</p>}
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {/* Live Camera Feed or Static Image */}
        <div className="relative">
          {isLiveActive ? (
            <LiveCameraDisplay
              roomId={room.id}
              roomName={room.name}
              isActive={isLiveActive}
              onDetectionResult={handleDetectionResult}
              className="w-full"
            />
          ) : (
            <div className="relative">
              <img
                src={room.imageUrl || "/placeholder.svg?height=200&width=300"}
                alt={room.name}
                className="w-full h-40 object-cover rounded-lg transition-all duration-300"
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
            </div>
          )}
        </div>

        {/* Live Monitoring Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isLiveActive
                  ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/25"
                  : "bg-gradient-to-r from-slate-400 to-slate-500"
              }`}
            >
              {isLiveActive ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Live Monitoring</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isLiveActive ? "AI actively monitoring" : "Manual control mode"}
              </p>
            </div>
          </div>
          <Switch
            checked={isLiveActive}
            onCheckedChange={handleLiveMonitoringToggle}
            className="data-[state=checked]:bg-green-600 dark:data-[state=checked]:bg-green-500"
          />
        </div>

        {/* AI Control Status */}
        {isLiveActive ? (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">AI Real-time Control</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">YOLOv8 Detection Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Manual Control Mode</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Upload images for analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Ready</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <UploadImageButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            disabled={isLiveActive}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
              isLiveActive
                ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">{isLiveActive ? "Disabled" : "Upload Image"}</span>
          </UploadImageButton>

          <LiveCamButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            liveMonitoringEnabled={isLiveActive}
            className="flex items-center justify-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 border border-slate-200 dark:border-slate-600"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">{isLiveActive ? "Live Feed" : "Test Camera"}</span>
          </LiveCamButton>
        </div>

        {/* Manual Light Controls Toggle */}
        <Collapsible open={showLightControls} onOpenChange={setShowLightControls}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between p-3 h-auto bg-transparent">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span className="text-sm font-medium">Manual Light Controls</span>
              </div>
              <div className="text-xs text-slate-500">{showLightControls ? "Hide" : "Show"}</div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <ManualLightControls
              roomId={room.id}
              roomName={room.name}
              isLiveMonitoring={isLiveActive}
              onSettingsChange={handleLightSettingsChange}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Light Status */}
        <div className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 transition-all duration-300">
          <span className="text-slate-600 dark:text-slate-400">Light Status:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${room.lightStatus === "on" ? "bg-yellow-400" : "bg-slate-300 dark:bg-slate-600"}`}
            />
            <span
              className={`font-medium ${room.lightStatus === "on" ? "text-yellow-600 dark:text-yellow-400" : "text-slate-500 dark:text-slate-400"}`}
            >
              {room.lightStatus === "on" ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {/* Live Monitoring Info */}
        {isLiveActive && (
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-400 transition-all duration-300">
            <strong className="text-green-700 dark:text-green-300">Live Mode Active:</strong> AI is continuously
            monitoring this room. Manual light controls can override AI automation when needed.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
