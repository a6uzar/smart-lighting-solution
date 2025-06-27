"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Loader2, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface LiveCamButtonProps {
  roomId: string
  onDetectionResult: (isOccupied: boolean) => void
  liveMonitoringEnabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function LiveCamButton({
  roomId,
  onDetectionResult,
  liveMonitoringEnabled = false,
  className,
  children,
}: LiveCamButtonProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Auto-start streaming when live monitoring is enabled
  useEffect(() => {
    if (liveMonitoringEnabled && !isStreaming) {
      startStreaming()
    } else if (!liveMonitoringEnabled && isStreaming) {
      stopStreaming()
    }
  }, [liveMonitoringEnabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming()
    }
  }, [])

  const startStreaming = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      setStream(mediaStream)
      setIsStreaming(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      // Start continuous detection if live monitoring is enabled
      if (liveMonitoringEnabled) {
        startContinuousDetection()
      }

      toast({
        title: liveMonitoringEnabled ? "Live monitoring started" : "Camera activated",
        description: liveMonitoringEnabled
          ? "AI is now continuously monitoring this room"
          : "Camera is ready for manual detection",
      })
    } catch (error) {
      toast({
        title: "Camera access failed",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
      })
    }
  }

  const stopStreaming = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsStreaming(false)
    setIsProcessing(false)

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startContinuousDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Detect every 3 seconds when live monitoring is enabled
    intervalRef.current = setInterval(() => {
      if (liveMonitoringEnabled && isStreaming) {
        captureAndAnalyze()
      }
    }, 3000)
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) return

          const formData = new FormData()
          formData.append("image", blob, "camera-capture.jpg")
          formData.append("roomId", roomId)
          formData.append("isLiveMonitoring", liveMonitoringEnabled.toString())

          try {
            const response = await fetch("/api/ai-detection", {
              method: "POST",
              body: formData,
            })

            const result = await response.json()

            if (result.success) {
              onDetectionResult(result.occupancy)

              // Only show toast for manual captures, not continuous monitoring
              if (!liveMonitoringEnabled) {
                toast({
                  title: "Detection complete",
                  description: `${result.occupancy ? "Person detected" : "No person detected"} - Lights ${result.occupancy ? "turned ON" : "turned OFF"}`,
                })
              }
            }
          } catch (error) {
            if (!liveMonitoringEnabled) {
              toast({
                title: "Detection failed",
                description: "Failed to analyze camera feed. Please try again.",
                variant: "destructive",
              })
            }
          }
        },
        "image/jpeg",
        0.8,
      )
    } catch (error) {
      console.error("Capture failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClick = () => {
    if (liveMonitoringEnabled) {
      // In live monitoring mode, just show the feed
      if (!isStreaming) {
        startStreaming()
      }
    } else {
      // In manual mode, toggle streaming or capture
      if (isStreaming) {
        captureAndAnalyze()
      } else {
        startStreaming()
      }
    }
  }

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Analyzing...</span>
        </div>
      )
    }

    if (liveMonitoringEnabled) {
      return (
        children || (
          <>
            <Camera className="w-4 h-4 mr-2" />
            {isStreaming ? "Live Feed" : "Start Live"}
          </>
        )
      )
    }

    return (
      children || (
        <>
          <Camera className="w-4 h-4 mr-2" />
          {isStreaming ? "Capture" : "Start Camera"}
        </>
      )
    )
  }

  return (
    <div className="space-y-2">
      {children ? (
        <div
          onClick={handleClick}
          className={cn(
            "cursor-pointer transition-opacity",
            isProcessing && "opacity-50 pointer-events-none",
            className,
          )}
        >
          {getButtonContent()}
        </div>
      ) : (
        <Button onClick={handleClick} disabled={isProcessing} variant="outline" size="sm" className={className}>
          {getButtonContent()}
        </Button>
      )}

      {/* Camera Feed */}
      {isStreaming && (
        <div className="relative">
          <video ref={videoRef} className="w-full h-32 object-cover rounded-lg bg-black" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />

          {/* Live indicator */}
          {liveMonitoringEnabled && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>LIVE AI</span>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="bg-white/90 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Analyzing...</span>
              </div>
            </div>
          )}

          {/* Manual controls */}
          {!liveMonitoringEnabled && (
            <div className="absolute bottom-2 right-2 flex space-x-1">
              <Button size="sm" variant="secondary" onClick={captureAndAnalyze} disabled={isProcessing}>
                <Camera className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="secondary" onClick={stopStreaming}>
                <Square className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
