"use client"

import { useState } from "react"
import { Camera, Upload, Lightbulb, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import StatusBadge from "./StatusBadge"
import UploadImageButton from "./UploadImageButton"
import LiveCamButton from "./LiveCamButton"
import type { Room } from "@/types/Room"
import { useOccupancyStatus } from "@/hooks/useOccupancyStatus"

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const { updateOccupancyStatus } = useOccupancyStatus()
  const [manualOverride, setManualOverride] = useState(false)

  const handleDetectionResult = (isOccupied: boolean) => {
    updateOccupancyStatus(room.id, isOccupied ? "occupied" : "empty")
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">{room.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <StatusBadge status={room.occupancyStatus} type="occupancy" />
            <StatusBadge status={room.lightStatus} type="light" />
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
        </div>

        {/* AI Control Indicator */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">AI Controlled</p>
              <p className="text-xs text-slate-600">YOLOv8 Detection Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <UploadImageButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload Image</span>
          </UploadImageButton>

          <LiveCamButton
            roomId={room.id}
            onDetectionResult={handleDetectionResult}
            className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Live Camera</span>
          </LiveCamButton>
        </div>

        {/* Manual Override */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Manual Override</span>
          </div>
          <Switch checked={manualOverride} onCheckedChange={setManualOverride} size="sm" />
        </div>

        {/* Light Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Light Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${room.lightStatus === "on" ? "bg-yellow-400" : "bg-slate-300"}`} />
            <span className={`font-medium ${room.lightStatus === "on" ? "text-yellow-600" : "text-slate-500"}`}>
              {room.lightStatus === "on" ? "Auto ON" : "Auto OFF"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
