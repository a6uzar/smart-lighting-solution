export interface Room {
  id: string
  name: string
  description: string
  imageUrl: string
  occupancyStatus: "occupied" | "empty"
  lightStatus: "on" | "off"
  aiControlEnabled: boolean
  manualOverride: boolean
  createdAt: string
  updatedAt: string
}

export interface DetectionResult {
  occupied: boolean
  confidence: number
  timestamp: string
}

export interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  conditions: {
    occupancyStatus?: "occupied" | "empty"
    timeRange?: {
      start: string
      end: string
    }
    daysOfWeek?: number[]
  }
  actions: {
    lightStatus: "on" | "off"
    dimLevel?: number
  }
}
