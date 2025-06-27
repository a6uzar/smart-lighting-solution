"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Eye, Lightbulb, Users, Settings, Trash2, Power } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LiveCamButton from "./LiveCamButton"
import ManualLightControls from "./ManualLightControls"
import StatusBadge from "./StatusBadge"
import type { Room, LightSettings } from "@/types/Room"

interface RoomCardProps {
  room: Room
  onToggleLiveMonitoring: (id: string) => void
  onUpdateLightStatus: (id: string, status: "on" | "off") => void
  onUpdateOccupancyStatus: (id: string, status: "occupied" | "empty") => void
  onDeleteRoom: (id: string) => void
  onUpdateRoom: (id: string, roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => void
}

export default function RoomCard({
  room,
  onToggleLiveMonitoring,
  onUpdateLightStatus,
  onUpdateOccupancyStatus,
  onDeleteRoom,
  onUpdateRoom,
}: RoomCardProps) {
  const [showControls, setShowControls] = useState(false)

  const handleDetectionResult = (isOccupied: boolean) => {
    onUpdateOccupancyStatus(room.id, isOccupied ? "occupied" : "empty")

    // Auto-control lights based on occupancy if not in manual override
    if (!room.manualOverride) {
      onUpdateLightStatus(room.id, isOccupied ? "on" : "off")
    }
  }

  const handleLightSettingsChange = (settings: LightSettings) => {
    // Update room with new light settings
    onUpdateRoom(room.id, {
      ...room,
      lightStatus: settings.isOn ? "on" : "off",
      brightness: settings.brightness,
      colorTemperature: settings.colorTemperature,
      colorPreset: settings.colorPreset,
      manualOverride: settings.manualOverride,
    })

    // If manual override is enabled, update light status immediately
    if (settings.manualOverride) {
      onUpdateLightStatus(room.id, settings.isOn ? "on" : "off")
    }
  }

  const handleQuickLightToggle = () => {
    const newStatus = room.lightStatus === "on" ? "off" : "on"
    onUpdateLightStatus(room.id, newStatus)

    // If toggling lights manually, enable manual override
    if (!room.manualOverride) {
      onUpdateRoom(room.id, {
        ...room,
        manualOverride: true,
        lightStatus: newStatus,
      })
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 dark:bg-slate-800/80 dark:border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{room.name}</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{room.description}</p>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={room.occupancyStatus} type="occupancy" icon={<Users className="w-3 h-3" />} />
              <StatusBadge status={room.lightStatus} type="light" icon={<Lightbulb className="w-3 h-3" />} />
              {room.liveMonitoringEnabled && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
              {room.manualOverride && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Override
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="dark:border-slate-600"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 dark:border-slate-600 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark:bg-slate-900">
                <AlertDialogHeader>
                  <AlertDialogTitle className="dark:text-slate-100">Delete Room</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-slate-400">
                    Are you sure you want to delete "{room.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:border-slate-600 dark:text-slate-300">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteRoom(room.id)} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Room Image */}
        <div className="relative">
          <img
            src={room.imageUrl || "/placeholder.svg"}
            alt={room.name}
            className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
          />
          <div className="absolute top-2 right-2">
            <div
              className={`w-3 h-3 rounded-full ${
                room.occupancyStatus === "occupied" ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            />
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-4">
            {/* Live Monitoring Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live</span>
              <Switch
                checked={room.liveMonitoringEnabled}
                onCheckedChange={() => onToggleLiveMonitoring(room.id)}
                size="sm"
              />
            </div>

            {/* Quick Light Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lights</span>
              <Button
                variant={room.lightStatus === "on" ? "default" : "outline"}
                size="sm"
                onClick={handleQuickLightToggle}
                className="h-8 w-8 p-0"
              >
                <Power className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Live Camera Button */}
          <LiveCamButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            liveMonitoringEnabled={room.liveMonitoringEnabled}
            size="sm"
          />
        </div>

        {/* Manual Light Controls */}
        {showControls && (
          <>
            <Separator className="dark:bg-slate-700" />
            <ManualLightControls room={room} onSettingsChange={handleLightSettingsChange} />
          </>
        )}

        {/* Room Status Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Occupancy:</span>
            <span
              className={`font-medium ${
                room.occupancyStatus === "occupied"
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {room.occupancyStatus === "occupied" ? "Occupied" : "Empty"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Lights:</span>
            <span
              className={`font-medium ${
                room.lightStatus === "on"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {room.lightStatus === "on" ? "On" : "Off"}
            </span>
          </div>
        </div>

        {room.manualOverride && (
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
            <p className="text-xs text-orange-800 dark:text-orange-200 text-center">
              Manual override active - AI automation paused
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
