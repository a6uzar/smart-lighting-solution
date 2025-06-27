"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Loader2, Wifi, WifiOff, Zap, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useOccupancyStatus } from "@/hooks/useOccupancyStatus"

interface LiveCameraFeedProps {
  roomId: string
  roomName: string
  isMonitoring: boolean
  detectionSettings: {
    interval: number
    confidence: number
  }
}

interface DetectionResult {
  occupied: boolean
  confidence: number
  timestamp: string
  boundingBoxes?: Array<{
    x: number
    y: number
    width: number
    height: number
    confidence: number
  }>
}

export default function LiveCameraFeed({ roomId, roomName, isMonitoring, detectionSettings }: LiveCameraFeedProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastDetection, setLastDetection] = useState<DetectionResult | null>(null)
  const [detectionHistory, setDetectionHistory] = useState<DetectionResult[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { toast } = useToast()
  const { updateOccupancyStatus } = useOccupancyStatus()

  // Initialize camera stream
  useEffect(() => {
    if (isMonitoring) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isMonitoring])

  // Start detection interval
  useEffect(() => {
    if (isMonitoring && isConnected && stream) {
      startDetectionInterval()
    } else {
      stopDetectionInterval()
    }

    return () => stopDetectionInterval()
  }, [isMonitoring, isConnected, stream, detectionSettings.interval])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      })

      setStream(mediaStream)
      setIsConnected(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setIsConnected(false)
      toast({
        title: "Camera Error",
        description: `Failed to access camera for ${roomName}`,
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
    stopDetectionInterval()
  }

  const startDetectionInterval = () => {
    stopDetectionInterval()

    intervalRef.current = setInterval(() => {
      if (!isProcessing) {
        performDetection()
      }
    }, detectionSettings.interval * 1000)
  }

  const stopDetectionInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const performDetection = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    setIsProcessing(true)

    try {
      // Capture frame from video
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx?.drawImage(video, 0, 0)

      // Convert canvas to blob for API call
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8)
      })

      // Call backend AI detection API
      const formData = new FormData()
      formData.append("image", blob, "frame.jpg")
      formData.append("roomId", roomId)
      formData.append("confidenceThreshold", detectionSettings.confidence.toString())

      const response = await fetch("/api/ai-detection", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const detection: DetectionResult = {
          occupied: result.occupied,
          confidence: result.confidence,
          timestamp: new Date().toISOString(),
          boundingBoxes: result.boundingBoxes || [],
        }

        setLastDetection(detection)
        setDetectionHistory((prev) => [...prev.slice(-9), detection]) // Keep last 10 detections

        // Update room status if confidence meets threshold
        if (result.confidence >= detectionSettings.confidence) {
          updateOccupancyStatus(roomId, result.occupied ? "occupied" : "empty")

          // Draw bounding boxes if available
          if (result.boundingBoxes && result.boundingBoxes.length > 0) {
            drawBoundingBoxes(result.boundingBoxes)
          }
        }
      }
    } catch (error) {
      console.error("Detection error:", error)
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
    ctx.lineWidth = 3
    ctx.font = "14px Arial"
    ctx.fillStyle = "#10B981"

    boxes.forEach((box) => {
      ctx.strokeRect(box.x, box.y, box.width, box.height)
      ctx.fillText(`Person ${Math.round(box.confidence)}%`, box.x, box.y - 5)
    })
  }

  return (
    <div className="space-y-4">
      {/* Camera Feed */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
        {isConnected ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Overlay canvas for bounding boxes */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: "multiply" }}
            />

            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs">AI Processing</span>
              </div>
            )}

            {/* Connection status */}
            <div className="absolute top-2 left-2 flex items-center space-x-2">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                {isConnected ? (
                  <Wifi className="w-3 h-3 text-green-400" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-400" />
                )}
                <span className="text-xs text-white">{isConnected ? "Live" : "Offline"}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera Offline</p>
            </div>
          </div>
        )}
      </div>

      {/* Detection Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-900">Last Detection</span>
          </div>
          {lastDetection ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={lastDetection.occupied ? "default" : "secondary"}
                  className={lastDetection.occupied ? "bg-green-600" : ""}
                >
                  {lastDetection.occupied ? "Occupied" : "Empty"}
                </Badge>
                <span className="text-xs text-slate-600">{Math.round(lastDetection.confidence)}%</span>
              </div>
              <p className="text-xs text-slate-500">{new Date(lastDetection.timestamp).toLocaleTimeString()}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No detection yet</p>
          )}
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-900">Auto Control</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-400 animate-pulse" : "bg-slate-300"}`} />
            <span className="text-xs text-slate-600">{isMonitoring ? "Active" : "Inactive"}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Interval: {detectionSettings.interval}s</p>
        </div>
      </div>

      {/* Detection History */}
      {detectionHistory.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Recent Activity</h4>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {detectionHistory
              .slice(-5)
              .reverse()
              .map((detection, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className={detection.occupied ? "text-green-600" : "text-slate-500"}>
                    {detection.occupied ? "Person detected" : "Empty"}
                  </span>
                  <span className="text-slate-400">{new Date(detection.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
