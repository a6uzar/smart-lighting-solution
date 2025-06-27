"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, Lightbulb, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Room } from "@/types/Room"

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: Room | null
  onSubmit: (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => void
  mode: "add" | "edit"
}

export default function RoomDialog({ open, onOpenChange, room, onSubmit, mode }: RoomDialogProps) {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    description: room?.description || "",
    imageUrl: room?.imageUrl || "",
    occupancyStatus: room?.occupancyStatus || ("empty" as const),
    lightStatus: room?.lightStatus || ("off" as const),
    liveMonitoringEnabled: room?.liveMonitoringEnabled || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Room name is required"
    }
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
    onOpenChange(false)

    // Reset form if adding new room
    if (mode === "add") {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        occupancyStatus: "empty",
        lightStatus: "off",
        liveMonitoringEnabled: false,
      })
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span>{mode === "add" ? "Add New Room" : "Edit Room"}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {mode === "add"
              ? "Configure a new room for smart lighting control with AI monitoring capabilities."
              : "Update room settings and monitoring preferences."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Room Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., Living Room"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-sm font-medium">
                    Image URL (optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                    className={errors.imageUrl ? "border-red-500" : ""}
                  />
                  {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of the room and its purpose..."
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* AI Monitoring Configuration */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>AI Monitoring Configuration</span>
              </h3>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="liveMonitoring" className="text-sm font-medium">
                      Live Monitoring
                    </Label>
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        formData.liveMonitoringEnabled ? "bg-green-400 animate-pulse" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Enable real-time AI analysis and automatic light control
                  </p>
                </div>
                <Switch
                  id="liveMonitoring"
                  checked={formData.liveMonitoringEnabled}
                  onCheckedChange={(checked) => handleChange("liveMonitoringEnabled", checked)}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>

              {/* Feature Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    formData.liveMonitoringEnabled
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye
                      className={`w-4 h-4 ${
                        formData.liveMonitoringEnabled ? "text-green-600 dark:text-green-400" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.liveMonitoringEnabled
                          ? "text-green-800 dark:text-green-200"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Live Monitoring
                    </span>
                  </div>
                  <ul
                    className={`text-xs space-y-1 ${
                      formData.liveMonitoringEnabled
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <li>• Real-time AI analysis</li>
                    <li>• Automatic light control</li>
                    <li>• Continuous monitoring</li>
                    <li>• Instant response</li>
                  </ul>
                </div>

                <div
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    !formData.liveMonitoringEnabled
                      ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Upload
                      className={`w-4 h-4 ${
                        !formData.liveMonitoringEnabled ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        !formData.liveMonitoringEnabled
                          ? "text-blue-800 dark:text-blue-200"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Manual Upload
                    </span>
                  </div>
                  <ul
                    className={`text-xs space-y-1 ${
                      !formData.liveMonitoringEnabled
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <li>• On-demand analysis</li>
                    <li>• Manual control</li>
                    <li>• Image upload based</li>
                    <li>• User triggered</li>
                  </ul>
                </div>
              </div>

              {/* Information Alert */}
              <Alert>
                {formData.liveMonitoringEnabled ? (
                  <>
                    <Camera className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Live Monitoring Active:</strong> The AI engine will continuously analyze the camera feed
                      and automatically control lights based on occupancy detection. Manual image upload will be
                      disabled.
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Manual Mode:</strong> You can upload images for AI analysis. Live monitoring is disabled,
                      and lights will be controlled manually or through uploaded image analysis.
                    </AlertDescription>
                  </>
                )}
              </Alert>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
            >
              {mode === "add" ? "Add Room" : "Update Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
