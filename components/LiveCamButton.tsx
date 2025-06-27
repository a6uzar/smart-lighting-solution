"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface LiveCamButtonProps {
  roomId: string
  onDetectionResult: (isOccupied: boolean) => void
  className?: string
  children?: React.ReactNode
}

export default function LiveCamButton({ roomId, onDetectionResult, className, children }: LiveCamButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      return mediaStream
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use live detection.",
        variant: "destructive",
      })
      throw error
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const handleDetection = async () => {
    setIsProcessing(true)

    try {
      // Simulate AI detection processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random detection result
      const isOccupied = Math.random() > 0.5
      const confidence = Math.round((Math.random() * 0.3 + 0.7) * 100)

      onDetectionResult(isOccupied)

      toast({
        title: "Live detection completed",
        description: `${isOccupied ? "Person detected" : "No person detected"} (${confidence}% confidence) - Lights ${isOccupied ? "turned ON" : "turned OFF"}`,
      })

      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Detection failed",
        description: "Failed to analyze camera feed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpen = async () => {
    setIsOpen(true)
    try {
      await startCamera()
    } catch (error) {
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    stopCamera()
    setIsOpen(false)
    setIsProcessing(false)
  }

  return (
    <>
      {children ? (
        <div onClick={handleOpen} className={cn("cursor-pointer", className)}>
          {children}
        </div>
      ) : (
        <Button onClick={handleOpen} variant="outline" size="sm" className={className}>
          <Camera className="w-4 h-4 mr-2" />
          Live Camera
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Live Camera Detection</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative bg-slate-100 rounded-lg overflow-hidden">
              {stream ? (
                <video
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 object-cover"
                  ref={(video) => {
                    if (video && stream) {
                      video.srcObject = stream
                    }
                  }}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Starting camera...</p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Analyzing with YOLOv8...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleDetection}
                disabled={isProcessing || !stream}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Detect Occupancy
                  </>
                )}
              </Button>
              <Button onClick={handleClose} variant="outline">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
