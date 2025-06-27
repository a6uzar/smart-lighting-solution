export interface Room {
  id: string
  name: string
  description?: string
  imageUrl?: string
  occupancyStatus: "occupied" | "empty"
  lightStatus: "on" | "off"
  liveMonitoringEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface DetectionResult {
  success: boolean
  occupancy: boolean
  confidence: number
  error?: string
  boundingBoxes?: Array<{
    x: number
    y: number
    width: number
    height: number
    confidence: number
  }>
  processingTime?: number
}

export interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  conditions: {
    occupancy?: boolean
    timeRange?: {
      start: string
      end: string
    }
    dayOfWeek?: number[]
  }
  actions: {
    lightStatus?: "on" | "off"
    dimLevel?: number
  }
}

export interface LiveMonitoringSettings {
  detectionInterval: number // seconds
  confidenceThreshold: number // 0-1
  autoLightControl: boolean
  enableBoundingBoxes: boolean
}
