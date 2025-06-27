export interface Room {
  id: string
  name: string
  description?: string
  imageUrl?: string
  occupancyStatus: "occupied" | "empty"
  lightStatus: "on" | "off"
  createdAt: string
  updatedAt: string
}

export interface DetectionResult {
  success: boolean
  occupancy: boolean
  confidence: number
  error?: string
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
