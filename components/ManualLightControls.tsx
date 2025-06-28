"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Palette, Sun, Power, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface LightSettings {
  isOn: boolean
  brightness: number
  color: string
  temperature: number
  manualOverride: boolean
}

interface ManualLightControlsProps {
  roomId: string
  roomName: string
  isLiveMonitoring: boolean
  onSettingsChange: (settings: LightSettings) => void
  className?: string
}

const colorPresets = [
  { name: "Warm White", color: "#FFF8DC", temp: 2700 },
  { name: "Cool White", color: "#F0F8FF", temp: 5000 },
  { name: "Daylight", color: "#FFFAFA", temp: 6500 },
  { name: "Soft Red", color: "#FFB6C1", temp: 2000 },
  { name: "Ocean Blue", color: "#87CEEB", temp: 7000 },
  { name: "Forest Green", color: "#90EE90", temp: 4000 },
]

export default function ManualLightControls({
  roomId,
  roomName,
  isLiveMonitoring,
  onSettingsChange,
  className = "",
}: ManualLightControlsProps) {
  const [settings, setSettings] = useState<LightSettings>({
    isOn: false,
    brightness: 75,
    color: "#FFF8DC",
    temperature: 2700,
    manualOverride: false,
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load saved settings for this room
    const savedSettings = localStorage.getItem(`light-settings-${roomId}`)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error("Failed to load light settings:", error)
      }
    }
  }, [roomId])

  const updateSettings = (newSettings: Partial<LightSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    setHasChanges(true)

    // Save to localStorage
    localStorage.setItem(`light-settings-${roomId}`, JSON.stringify(updated))

    // Notify parent component
    onSettingsChange(updated)
  }

  const handlePowerToggle = (isOn: boolean) => {
    updateSettings({ isOn, manualOverride: true })
  }

  const handleBrightnessChange = (value: number[]) => {
    updateSettings({ brightness: value[0], manualOverride: true })
  }

  const handleColorSelect = (color: string, temperature: number) => {
    updateSettings({ color, temperature, manualOverride: true })
  }

  const handleManualOverrideToggle = (enabled: boolean) => {
    updateSettings({ manualOverride: enabled })
    if (!enabled) {
      setHasChanges(false)
    }
  }

  const resetToDefaults = () => {
    const defaults: LightSettings = {
      isOn: false,
      brightness: 75,
      color: "#FFF8DC",
      temperature: 2700,
      manualOverride: false,
    }
    setSettings(defaults)
    setHasChanges(false)
    localStorage.setItem(`light-settings-${roomId}`, JSON.stringify(defaults))
    onSettingsChange(defaults)
  }

  return (
    <Card className={`${className} transition-all duration-300`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>Manual Light Controls</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {settings.manualOverride && (
              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
              >
                Override Active
              </Badge>
            )}
            {isLiveMonitoring && !settings.manualOverride && (
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                AI Controlled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Manual Override Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <Power className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Manual Override</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {settings.manualOverride ? "Manual control active" : "AI control active"}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.manualOverride}
            onCheckedChange={handleManualOverrideToggle}
            className="data-[state=checked]:bg-orange-600"
          />
        </div>

        {/* Light Power Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Light Power</label>
            <Switch
              checked={settings.isOn}
              onCheckedChange={handlePowerToggle}
              disabled={!settings.manualOverride}
              className="data-[state=checked]:bg-yellow-600"
            />
          </div>

          {settings.isOn && (
            <div className="ml-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Light is ON</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Brightness Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <span>Brightness</span>
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400">{settings.brightness}%</span>
          </div>
          <Slider
            value={[settings.brightness]}
            onValueChange={handleBrightnessChange}
            max={100}
            min={1}
            step={1}
            disabled={!settings.manualOverride || !settings.isOn}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Color Temperature Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Color & Temperature</span>
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400">{settings.temperature}K</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleColorSelect(preset.color, preset.temp)}
                disabled={!settings.manualOverride || !settings.isOn}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  settings.color === preset.color
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                } ${!settings.manualOverride || !settings.isOn ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: preset.color }}
                  />
                  <div className="text-left">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{preset.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{preset.temp}K</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Status</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Power:</span>
              <span
                className={`ml-2 font-medium ${settings.isOn ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
              >
                {settings.isOn ? "ON" : "OFF"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Brightness:</span>
              <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{settings.brightness}%</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Temperature:</span>
              <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{settings.temperature}K</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Control:</span>
              <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                {settings.manualOverride ? "Manual" : "AI"}
              </span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </Button>
        </div>

        {/* Override Warning */}
        {settings.manualOverride && isLiveMonitoring && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>Manual Override Active:</strong> These settings will take precedence over AI automation until
              override is disabled.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
