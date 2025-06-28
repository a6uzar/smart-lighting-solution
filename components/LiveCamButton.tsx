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
  const [isTestingCamera, setIsTestingCamera] = useState(false)

  const handleToggle = async () => {
    if (liveMonitoringEnabled) {
      // If live monitoring is enabled, this button shows status
      toast.info("Live monitoring is active. Camera feed is running continuously.")
      return
    }

    try {
      setIsActive(!isActive)

      if (!isActive) {
        // Test camera access
        setIsTestingCamera(true)
        toast.info("Testing camera access...")

        try {
          // Try to access camera
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 } 
          })
          
          // Camera access successful
          toast.success("Camera access successful!")
          
          // Stop the test stream immediately
          stream.getTracks().forEach(track => track.stop())
          
          // Simulate a detection result after 2 seconds
          setTimeout(() => {
            const isOccupied = Math.random() > 0.5
            const confidence = Math.random() * 0.4 + 0.6
            onDetectionResult(isOccupied, confidence)
            toast.success(
              `Test detection: ${isOccupied ? "Occupied" : "Empty"} (${Math.round(confidence * 100)}% confidence)`,
            )
            setIsActive(false)
            setIsTestingCamera(false)
          }, 2000)
        } catch (cameraError) {
          console.error("Camera access error:", cameraError)
          toast.error("Camera access denied or not available. Using simulated detection.")
          
          // Fallback to simulated detection
          setTimeout(() => {
            const isOccupied = Math.random() > 0.5
            const confidence = Math.random() * 0.4 + 0.6
            onDetectionResult(isOccupied, confidence)
            toast.success(
              `Simulated detection: ${isOccupied ? "Occupied" : "Empty"} (${Math.round(confidence * 100)}% confidence)`,
            )
            setIsActive(false)
            setIsTestingCamera(false)
          }, 1000)
        }
      } else {
        toast.info("Camera test stopped")
        setIsTestingCamera(false)
      }
    } catch (error) {
      console.error("Camera error:", error)
      toast.error("Failed to access camera")
      setIsActive(false)
      setIsTestingCamera(false)
    }
  }

  return (
    <Button onClick={handleToggle} className={className} variant="outline" disabled={isTestingCamera}>
      {children || (
        <>
          {liveMonitoringEnabled ? (
            <Video className="w-4 h-4 mr-2 text-purple-600" />
          ) : isActive || isTestingCamera ? (
            <VideoOff className="w-4 h-4 mr-2" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          {liveMonitoringEnabled ? "Live Active" : 
           isTestingCamera ? "Testing..." :
           isActive ? "Stop Test" : "Test Camera"}
        </>
      )}
    </Button>
  )
}
