"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "./use-toast"

interface DetectionSettings {
  interval: number // seconds
  confidence: number // percentage
  autoLightControl: boolean
  motionSensitivity: number
}

interface MonitoringStats {
  totalDetections: number
  lightSwitches: number
  uptime: number
  lastActivity: string | null
}

export function useLiveMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>({
    interval: 3,
    confidence: 75,
    autoLightControl: true,
    motionSensitivity: 50,
  })
  const [monitoringStats, setMonitoringStats] = useState<MonitoringStats>({
    totalDetections: 0,
    lightSwitches: 0,
    uptime: 0,
    lastActivity: null,
  })

  const { toast } = useToast()

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("live-monitoring-settings")
    if (savedSettings) {
      try {
        setDetectionSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to load monitoring settings:", error)
      }
    }

    const savedStats = localStorage.getItem("monitoring-stats")
    if (savedStats) {
      try {
        setMonitoringStats(JSON.parse(savedStats))
      } catch (error) {
        console.error("Failed to load monitoring stats:", error)
      }
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem("live-monitoring-settings", JSON.stringify(detectionSettings))
  }, [detectionSettings])

  // Save stats to localStorage when changed
  useEffect(() => {
    localStorage.setItem("monitoring-stats", JSON.stringify(monitoringStats))
  }, [monitoringStats])

  const startMonitoring = useCallback(async () => {
    try {
      // Check camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop()) // Stop test stream

      setIsMonitoring(true)

      toast({
        title: "Live Monitoring Started",
        description: "AI-powered occupancy detection is now active",
      })

      // Update stats
      setMonitoringStats((prev) => ({
        ...prev,
        lastActivity: new Date().toISOString(),
      }))
    } catch (error) {
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to enable live monitoring",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)

    toast({
      title: "Live Monitoring Stopped",
      description: "AI detection has been disabled",
    })
  }, [toast])

  const updateDetectionSettings = useCallback(
    (updates: Partial<DetectionSettings>) => {
      setDetectionSettings((prev) => ({ ...prev, ...updates }))

      toast({
        title: "Settings Updated",
        description: "Detection settings have been saved",
      })
    },
    [toast],
  )

  const incrementDetectionCount = useCallback(() => {
    setMonitoringStats((prev) => ({
      ...prev,
      totalDetections: prev.totalDetections + 1,
      lastActivity: new Date().toISOString(),
    }))
  }, [])

  const incrementLightSwitches = useCallback(() => {
    setMonitoringStats((prev) => ({
      ...prev,
      lightSwitches: prev.lightSwitches + 1,
      lastActivity: new Date().toISOString(),
    }))
  }, [])

  const resetStats = useCallback(() => {
    setMonitoringStats({
      totalDetections: 0,
      lightSwitches: 0,
      uptime: 0,
      lastActivity: null,
    })

    toast({
      title: "Statistics Reset",
      description: "All monitoring statistics have been cleared",
    })
  }, [toast])

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    detectionSettings,
    updateDetectionSettings,
    monitoringStats,
    incrementDetectionCount,
    incrementLightSwitches,
    resetStats,
  }
}
