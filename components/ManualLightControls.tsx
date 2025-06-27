"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Lightbulb,
  Settings,
  Palette,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
  Power,
  Thermometer,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Room, LightSettings } from "@/types/Room"

interface ManualLightControlsProps {
  room: Room
  onSettingsChange: (settings: LightSettings) => void
  className?: string
}

const colorPresets = [
  { name: "Warm White", value: "warm-white", temp: 2700, color: "#FFB366" },
  { name: "Soft White", value: "soft-white", temp: 3000, color: "#FFC649" },
  { name: "Cool White", value: "cool-white", temp: 4000, color: "#FFE135" },
  { name: "Daylight", value: "daylight", temp: 5000, color: "#FFFFFF" },
  { name: "Cool Blue", value: "cool-blue", temp: 6500, color: "#B3D9FF" },
  { name: "Energizing", value: "energizing", temp: 7000, color: "#9FCDFF" },
]

export default function ManualLightControls({ room, onSettingsChange, className = "" }: ManualLightControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<LightSettings>({
    isOn: room.lightStatus === "on",
    brightness: room.brightness || 80,
    colorTemperature: room.colorTemperature || 3000,
    colorPreset: room.colorPreset || "warm-white",
    manualOverride: room.manualOverride || false,
  })

  // Update settings when room changes
  useEffect(() => {
    setSettings({
      isOn: room.lightStatus === "on",
      brightness: room.brightness || 80,
      colorTemperature: room.colorTemperature || 3000,
      colorPreset: room.colorPreset || "warm-white",
      manualOverride: room.manualOverride || false,
    })
  }, [room])

  const handleSettingChange = (newSettings: Partial<LightSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    onSettingsChange(updatedSettings)
  }

  const handlePresetSelect = (preset: (typeof colorPresets)[0]) => {
    handleSettingChange({
      colorPreset: preset.value,
      colorTemperature: preset.temp,
    })
  }

  const getTemperatureIcon = (temp: number) => {
    if (temp <= 3000) return <Sunset className="w-4 h-4" />
    if (temp <= 4000) return <Sun className="w-4 h-4" />
    if (temp <= 5000) return <Sunrise className="w-4 h-4" />
    return <Moon className="w-4 h-4" />
  }

  const selectedPreset = colorPresets.find((p) => p.value === settings.colorPreset)

  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 ${className}`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Manual Light Controls</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Override AI automation with manual settings
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {settings.manualOverride && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    Override Active
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Manual Override Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Power className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Manual Override</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Take control over AI automation</p>
                </div>
              </div>
              <Switch
                checked={settings.manualOverride}
                onCheckedChange={(checked) => handleSettingChange({ manualOverride: checked })}
              />
            </div>

            {settings.manualOverride && (
              <>
                {/* Power Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">Power</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.isOn}
                        onCheckedChange={(checked) => handleSettingChange({ isOn: checked })}
                      />
                      <Badge variant={settings.isOn ? "default" : "secondary"}>{settings.isOn ? "ON" : "OFF"}</Badge>
                    </div>
                  </div>
                </div>

                <Separator className="dark:bg-slate-700" />

                {/* Brightness Control */}
                {settings.isOn && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">Brightness</span>
                      </div>
                      <Badge variant="outline" className="dark:border-slate-600">
                        {settings.brightness}%
                      </Badge>
                    </div>
                    <Slider
                      value={[settings.brightness]}
                      onValueChange={([value]) => handleSettingChange({ brightness: value })}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {settings.isOn && (
                  <>
                    <Separator className="dark:bg-slate-700" />

                    {/* Color Temperature */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-slate-100">Color Temperature</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTemperatureIcon(settings.colorTemperature)}
                          <Badge variant="outline" className="dark:border-slate-600">
                            {settings.colorTemperature}K
                          </Badge>
                        </div>
                      </div>
                      <Slider
                        value={[settings.colorTemperature]}
                        onValueChange={([value]) => handleSettingChange({ colorTemperature: value })}
                        max={7000}
                        min={2700}
                        step={100}
                        className="w-full"
                      />
                    </div>

                    <Separator className="dark:bg-slate-700" />

                    {/* Color Presets */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Palette className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">Color Presets</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {colorPresets.map((preset) => (
                          <Button
                            key={preset.value}
                            variant={settings.colorPreset === preset.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePresetSelect(preset)}
                            className="justify-start space-x-2 dark:border-slate-600"
                          >
                            <div
                              className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600"
                              style={{ backgroundColor: preset.color }}
                            />
                            <span className="text-xs">{preset.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="dark:bg-slate-700" />

                {/* Current Status */}
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Current Status:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: settings.isOn ? selectedPreset?.color || "#FFB366" : "#94a3b8",
                        }}
                      />
                      <span className="text-slate-900 dark:text-slate-100">
                        {settings.isOn ? `${selectedPreset?.name} at ${settings.brightness}%` : "Off"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!settings.manualOverride && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Enable manual override to take control of the lights
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
