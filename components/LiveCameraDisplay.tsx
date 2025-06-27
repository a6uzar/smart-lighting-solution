"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, AlertCircle, Wifi } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LiveCameraDisplayProps {
  roomId: string
  roomName: string
  isActive: boolean
  onDetectionResult: (isOccupied: boolean, confidence?: number) => void
  className?: string
}

export default function LiveCameraDisplay({
  roomId,
  roomName,
  isActive,
  onDetectionResult,
  className = "",
}: LiveCameraDisplayProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastDetection, setLastDetection] = useState<{
    occupancy: boolean
    confidence: number
    timestamp: Date
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate live camera feed and detection
  useEffect(() => {
    if (!isActive) {
      setIsConnected(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setIsConnected(true)
      setError(null)
    }, 1000)

    // Simulate periodic detection results
    intervalRef.current = setInterval(() => {
      if (isConnected) {
        // Simulate random occupancy detection
        const isOccupied = Math.random() > 0.6
        const confidence = Math.random() * 0.4 + 0.6 // 60-100% confidence

        const detection = {
          occupancy: isOccupied,
          confidence,
          timestamp: new Date(),
        }

        setLastDetection(detection)
        onDetectionResult(isOccupied, confidence)
      }
    }, 3000) // Check every 3 seconds

    return () => {
      clearTimeout(connectTimeout)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isConnected, onDetectionResult])

  const handleRetryConnection = () => {
    setError(null)
    setIsConnected(false)
    setTimeout(() => setIsConnected(true), 1000)
  }

  if (!isActive) {
    return (
      <div className={`${className} relative`}>
        <img
          src="/placeholder.svg?height=200&width=300"
          alt={roomName}
          className="w-full h-40 object-cover rounded-lg opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-center text-white">
            <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Live monitoring disabled</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardContent className="p-0 relative">
        {/* Camera Feed Simulation */}
        <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900">
          {isConnected ? (
            <>
              {/* Simulated camera feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
              </div>

              {/* Detection overlay */}
              {lastDetection && (
                <div className="absolute inset-4">
                  {lastDetection.occupancy && (
                    <div className="border-2 border-green-400 rounded-lg w-20 h-16 absolute top-4 left-4 animate-pulse">
                      <div className="absolute -top-6 left-0 bg-green-400 text-black text-xs px-2 py-1 rounded">
                        Person {Math.round(lastDetection.confidence * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status indicators */}
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-500/90 text-white border-0">
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/90 text-white border-0">
                  <Camera className="w-3 h-3 mr-1" />
                  AI Active
                </Badge>
              </div>

              {/* Detection status */}
              <div className="absolute bottom-2 right-2">
                <Badge
                  variant="secondary"
                  className={`${
                    lastDetection?.occupancy ? "bg-green-500/90 text-white" : "bg-slate-500/90 text-white"
                  } border-0`}
                >
                  {lastDetection?.occupancy ? "Occupied" : "Empty"}
                </Badge>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2" />
                <p className="text-sm">Connecting to camera...</p>
              </div>
            </div>
          )}
        </div>

        {/* Detection Info */}
        {isConnected && lastDetection && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${lastDetection.occupancy ? "bg-green-400" : "bg-slate-400"}`} />
                <span className="text-slate-600 dark:text-slate-400">
                  Last detection: {lastDetection.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400">
                Confidence: {Math.round(lastDetection.confidence * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/90">
            <div className="text-center text-white p-4">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium mb-2">Connection Error</p>
              <p className="text-xs mb-3">{error}</p>
              <Button size="sm" variant="secondary" onClick={handleRetryConnection}>
                Retry Connection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
