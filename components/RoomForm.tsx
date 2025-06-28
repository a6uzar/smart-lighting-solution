"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Camera, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Room } from "@/types/Room"

interface RoomFormProps {
  room?: Room | null
  onSubmit: (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export default function RoomForm({ room, onSubmit, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    description: room?.description || "",
    imageUrl: room?.imageUrl || "",
    occupancyStatus: room?.occupancyStatus || ("empty" as const),
    lightStatus: room?.lightStatus || ("off" as const),
    liveMonitoringEnabled: room?.liveMonitoringEnabled || false,
    aiControlEnabled: room?.aiControlEnabled || true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Living Room"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the room..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Monitoring Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>AI Monitoring Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label htmlFor="liveMonitoring" className="text-base font-medium">
                  Live Monitoring
                </Label>
                <div
                  className={`w-2 h-2 rounded-full ${formData.liveMonitoringEnabled ? "bg-blue-400 animate-pulse" : "bg-gray-300"}`}
                />
              </div>
              <p className="text-sm text-slate-600">Enable real-time AI analysis and automatic light control</p>
            </div>
            <Switch
              id="liveMonitoring"
              checked={formData.liveMonitoringEnabled}
              onCheckedChange={(checked) => handleChange("liveMonitoringEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label htmlFor="aiControl" className="text-base font-medium">
                  AI Control Enabled
                </Label>
                <div
                  className={`w-2 h-2 rounded-full ${formData.aiControlEnabled ? "bg-purple-400 animate-pulse" : "bg-gray-300"}`}
                />
              </div>
              <p className="text-sm text-slate-600">Allow AI to automatically control room lighting</p>
            </div>
            <Switch
              id="aiControl"
              checked={formData.aiControlEnabled}
              onCheckedChange={(checked) => handleChange("aiControlEnabled", checked)}
            />
          </div>

          <Separator />

          {/* Live Monitoring Info */}
          {formData.liveMonitoringEnabled ? (
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                <strong>Live Monitoring Active:</strong> The AI engine will continuously analyze the camera feed and
                automatically control lights based on occupancy detection. Manual image upload will be disabled.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                <strong>Manual Mode:</strong> You can upload images for AI analysis. Live monitoring is disabled, and
                lights will be controlled manually or through uploaded image analysis.
              </AlertDescription>
            </Alert>
          )}

          {/* Feature Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div
              className={`p-3 rounded-lg border-2 transition-all ${formData.liveMonitoringEnabled ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Camera className={`w-4 h-4 ${formData.liveMonitoringEnabled ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`font-medium ${formData.liveMonitoringEnabled ? "text-blue-800" : "text-gray-600"}`}>
                  Live Monitoring
                </span>
              </div>
              <ul
                className={`text-xs space-y-1 ${formData.liveMonitoringEnabled ? "text-blue-700" : "text-gray-500"}`}
              >
                <li>• Real-time AI analysis</li>
                <li>• Automatic light control</li>
                <li>• Continuous monitoring</li>
                <li>• Instant response</li>
              </ul>
            </div>

            <div
              className={`p-3 rounded-lg border-2 transition-all ${!formData.liveMonitoringEnabled ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Upload className={`w-4 h-4 ${!formData.liveMonitoringEnabled ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`font-medium ${!formData.liveMonitoringEnabled ? "text-blue-800" : "text-gray-600"}`}>
                  Manual Upload
                </span>
              </div>
              <ul
                className={`text-xs space-y-1 ${!formData.liveMonitoringEnabled ? "text-blue-700" : "text-gray-500"}`}
              >
                <li>• On-demand analysis</li>
                <li>• Manual control</li>
                <li>• Image upload based</li>
                <li>• User triggered</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {room ? "Update Room" : "Add Room"}
        </Button>
      </div>
    </form>
  )
}
