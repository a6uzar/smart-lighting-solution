"use client"

import { useState } from "react"
import { useRooms } from "./useRooms"
import { useToast } from "./use-toast"

export function useOccupancyStatus() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { updateRoomStatus } = useRooms()
  const { toast } = useToast()

  const simulateAIDetection = async (
    type: "image" | "camera",
    file?: File,
  ): Promise<{ occupied: boolean; confidence: number }> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

    // Simulate detection results with some randomness
    const occupied = Math.random() > 0.4 // 60% chance of detecting occupancy
    const confidence = 0.7 + Math.random() * 0.3 // 70-100% confidence

    return { occupied, confidence }
  }

  const updateOccupancyStatus = async (roomId: string, type: "image" | "camera", file?: File) => {
    setIsProcessing(true)

    try {
      toast({
        title: "AI Detection Started",
        description: `Processing ${type === "image" ? "uploaded image" : "live camera feed"} for occupancy detection...`,
      })

      const result = await simulateAIDetection(type, file)

      const occupancyStatus = result.occupied ? "occupied" : "empty"
      const lightStatus = result.occupied ? "on" : "off"

      updateRoomStatus(roomId, occupancyStatus, lightStatus)

      toast({
        title: "AI Detection Complete",
        description: `${result.occupied ? "Person detected" : "No person detected"} (${Math.round(result.confidence * 100)}% confidence). Lights ${lightStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Detection Failed",
        description: "Failed to process AI detection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    updateOccupancyStatus,
    isProcessing,
  }
}
