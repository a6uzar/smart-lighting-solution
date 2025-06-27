"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Loader2, Wifi, WifiOff, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface LiveCameraDisplayProps {
  roomId: string
  roomName: string
  isActive: boolean
  onDetectionResult?: (isOccupied: boolean, confidence: number) => void
  className?: string
}

export default function LiveCameraDisplay({
  roomId,
  roomName,
  isActive,
  onDetectionResult,
  className = "",
}: LiveCameraDisplayProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastDetection, setLastDetection] = useState<{
    occupied: boolean
    confidence: number
    timestamp: string
  } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { toast } = useToast()

  // Initialize camera when component becomes active
  useEffect(() => {
    if (isActive) {
      startCamera()
      startDetectionLoop()
    } else {
      stopCamera()
      stopDetectionLoop()
    }

    return () => {
      stopCamera()
      stopDetectionLoop()
    }
  }, [isActive])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 15 },
        },
      })

      setStream(mediaStream)
      setIsConnected(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      const errorMessage = `Failed to access camera for ${roomName}`
      setError(errorMessage)
      setIsConnected(false)
      console.error("Camera access error:", err)
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsConnected(false)
    setError(null)
  }

  const startDetectionLoop = () => {
    stopDetectionLoop()
    if (isActive) {
      intervalRef.current = setInterval(() => {
        performDetection()
      }, 3000) // Detect every 3 seconds
    }
  }

  const stopDetectionLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const performDetection = async () => {
    if (!videoRef.current || !canvasRef.current || !isConnected || isProcessing) return

    setIsProcessing(true)

    try {
      // Capture frame from video
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx?.drawImage(video, 0, 0)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8)
      })

      // Call AI detection API
      const formData = new FormData()
      formData.append("image", blob, "frame.jpg")
      formData.append("roomId", roomId)
      formData.append("mode", "live")

      const response = await fetch("/api/ai-detection", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const detection = {
          occupied: result.occupied,
          confidence: result.confidence,
          timestamp: new Date().toISOString(),
        }

        setLastDetection(detection)
        onDetectionResult?.(result.occupied, result.confidence)

        // Draw bounding boxes if available
        if (result.boundingBoxes && result.boundingBoxes.length > 0) {
          drawBoundingBoxes(result.boundingBoxes)
        }
      }
    } catch (err) {
      console.error("Detection error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const drawBoundingBoxes = (
    boxes: Array<{ x: number; y: number; width: number; height: number; confidence: number }>,
  ) => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bounding boxes
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 2
    ctx.font = "12px Arial"
    ctx.fillStyle = "#10B981"

    boxes.forEach((box) => {
      ctx.strokeRect(box.x, box.y, box.width, box.height)
      ctx.fillText(`${Math.round(box.confidence)}%`, box.x, box.y - 5)
    })
  }

  const retryConnection = () => {
    stopCamera()
    setTimeout(() => {
      if (isActive) {
        startCamera()
      }
    }, 1000)
  }

  return (
    <div className={`relative bg-slate-900 dark:bg-slate-800 rounded-lg overflow-hidden ${className}`}>
      {/* Video Container */}
      <div className="relative aspect-video">
        {isConnected && !error ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Overlay canvas for bounding boxes */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            />

            {/* Live indicator */}
            <div className="absolute top-3 left-3">
              <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs text-white font-medium">LIVE</span>
              </div>
            </div>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="absolute top-3 right-3">
                <div className="bg-blue-500/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                  <span className="text-xs text-white font-medium">AI</span>
                </div>
              </div>
            )}

            {/* Connection status */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-green-400" />
                <span className="text-xs text-white">Connected</span>
              </div>
            </div>

            {/* Last detection */}
            {lastDetection && (
              <div className="absolute bottom-3 right-3">
                <Badge
                  variant={lastDetection.occupied ? "default" : "secondary"}
                  className={`${
                    lastDetection.occupied ? "bg-green-500/90 text-white" : "bg-slate-500/90 text-white"
                  } backdrop-blur-sm`}
                >
                  {lastDetection.occupied ? "Occupied" : "Empty"} {Math.round(lastDetection.confidence)}%
                </Badge>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              {error ? (
                <>
                  <WifiOff className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <p className="text-sm mb-3">{error}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={retryConnection}
                    className="text-white border-white hover:bg-white hover:text-slate-900 bg-transparent"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </>
              ) : (
                <>
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Initializing camera...</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
