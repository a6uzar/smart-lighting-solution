"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface LiveCamButtonProps {
  roomId: string
  onDetectionResult: (isOccupied: boolean, confidence?: number) => void
  liveMonitoringEnabled: boolean
  className?: string
  children?: React.ReactNode
}

export default function LiveCamButton({
  roomId,
  onDetectionResult,
  liveMonitoringEnabled,
  className = "",
  children,
}: LiveCamButtonProps) {
  const [isActive, setIsActive] = useState(false)

  const handleToggle = async () => {
    if (liveMonitoringEnabled) {
      // If live monitoring is enabled, this button shows status
      toast.info("Live monitoring is active. Camera feed is running continuously.")
      return
    }

    try {
      setIsActive(!isActive)

      if (!isActive) {
        // Simulate camera activation
        toast.success("Camera test activated")

        // Simulate a detection result after 2 seconds
        setTimeout(() => {
          const isOccupied = Math.random() > 0.5
          const confidence = Math.random() * 0.4 + 0.6
          onDetectionResult(isOccupied, confidence)
          toast.success(
            `Test detection: ${isOccupied ? "Occupied" : "Empty"} (${Math.round(confidence * 100)}% confidence)`,
          )
          setIsActive(false)
        }, 2000)
      } else {
        toast.info("Camera test stopped")
      }
    } catch (error) {
      console.error("Camera error:", error)
      toast.error("Failed to access camera")
      setIsActive(false)
    }
  }

  return (
    <Button onClick={handleToggle} className={className} variant="outline">
      {children || (
        <>
          {liveMonitoringEnabled ? (
            <Video className="w-4 h-4 mr-2 text-green-500" />
          ) : isActive ? (
            <VideoOff className="w-4 h-4 mr-2" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          {liveMonitoringEnabled ? "Live Active" : isActive ? "Stop Test" : "Test Camera"}
        </>
      )}
    </Button>
  )
}
