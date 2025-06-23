"use client"

import { useState } from "react"
import { Camera, Lightbulb, Users, Loader2 } from "lucide-react"
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
  const { updateOccupancyStatus, isProcessing } = useOccupancyStatus()
  const [manualOverride, setManualOverride] = useState(false)

  const handleImageUpload = async (file: File) => {
    await updateOccupancyStatus(room.id, "image", file)
  }

  const handleLiveDetection = async () => {
    await updateOccupancyStatus(room.id, "camera")
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-slate-900">{room.name}</CardTitle>
          <div className="flex space-x-1">
            <StatusBadge status={room.occupancyStatus} type="occupancy" />
            <StatusBadge status={room.lightStatus} type="light" />
          </div>
        </div>
        {room.description && <p className="text-sm text-slate-600">{room.description}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Room Image */}
        <div className="relative">
          <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
            {room.imageUrl ? (
              <img src={room.imageUrl || "/placeholder.svg"} alt={room.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>

          {/* AI Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">AI Processing...</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Control Indicator */}
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">AI Controlled</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lightbulb className={`w-4 h-4 ${room.lightStatus === "on" ? "text-yellow-500" : "text-slate-400"}`} />
            <Users className={`w-4 h-4 ${room.occupancyStatus === "occupied" ? "text-green-500" : "text-slate-400"}`} />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <UploadImageButton onUpload={handleImageUpload} disabled={isProcessing} />
          <LiveCamButton onDetect={handleLiveDetection} disabled={isProcessing} />
        </div>

        {/* Manual Override */}
        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-700">Manual Override</span>
          <Switch checked={manualOverride} onCheckedChange={setManualOverride} disabled={isProcessing} />
        </div>

        {/* Last Updated */}
        <div className="text-xs text-slate-500 text-center">
          Last updated: {new Date(room.updatedAt).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
