"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Camera, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LiveCameraDisplay from "./LiveCameraDisplay"

interface LiveCamButtonProps {
  roomId: string
  onDetectionResult: (isOccupied: boolean, confidence?: number) => void
  liveMonitoringEnabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function LiveCamButton({
  roomId,
  onDetectionResult,
  liveMonitoringEnabled = false,
  className = "",
  children,
}: LiveCamButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = () => {
    if (liveMonitoringEnabled) {
      // In live monitoring mode, just show a status or redirect to live monitor page
      window.location.href = "/live-monitor"
    } else {
      // In manual mode, open the camera dialog
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <Button onClick={handleClick} className={className} variant="outline">
        {children || (
          <>
            <Camera className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{liveMonitoringEnabled ? "View Live Feed" : "Test Camera"}</span>
          </>
        )}
      </Button>

      {!liveMonitoringEnabled && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Camera Test - Room {roomId}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <LiveCameraDisplay
                roomId={roomId}
                roomName={`Room ${roomId}`}
                isActive={isDialogOpen}
                onDetectionResult={onDetectionResult}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
