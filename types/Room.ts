export interface Room {
  id: string
  name: string
  description: string
  imageUrl: string
  occupancyStatus: "occupied" | "empty"
  lightStatus: "on" | "off"
  liveMonitoringEnabled: boolean
  createdAt: Date
  updatedAt: Date
  // Optional manual light control settings
  manualOverride?: boolean
  brightness?: number
  colorTemperature?: number
  colorPreset?: string
}

export interface LightSettings {
  isOn: boolean
  brightness: number
  colorTemperature: number
  colorPreset: string
  manualOverride: boolean
}
