"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Camera, Upload, Eye, Lightbulb, Zap, Clock } from "lucide-react"
import UploadImageButton from "./UploadImageButton"
import type { Room } from "@/types/Room"

interface RoomDialogProps {
  onAddRoom: (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => void
  trigger?: React.ReactNode
}

export default function RoomDialog({ onAddRoom, trigger }: RoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "/placeholder.svg?height=200&width=300",
    liveMonitoringEnabled: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Room name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit the form
    onAddRoom({
      name: formData.name.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl,
      occupancyStatus: "empty",
      lightStatus: "off",
      liveMonitoringEnabled: formData.liveMonitoringEnabled,
    })

    // Reset form and close dialog
    setFormData({
      name: "",
      description: "",
      imageUrl: "/placeholder.svg?height=200&width=300",
      liveMonitoringEnabled: false,
    })
    setErrors({})
    setOpen(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Room
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span>Add New Room</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                  Room Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Living Room, Kitchen, Bedroom"
                  className={`dark:bg-slate-800 dark:border-slate-600 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the room and its lighting setup..."
                  rows={3}
                  className={`dark:bg-slate-800 dark:border-slate-600 ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Room Image */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Room Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Room preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <UploadImageButton onImageUploaded={(url) => handleInputChange("imageUrl", url)} className="w-full" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Upload an image of your room for better identification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Configuration */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Monitoring Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Live Monitoring</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enable real-time AI-powered occupancy detection
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.liveMonitoringEnabled}
                  onCheckedChange={(checked) => handleInputChange("liveMonitoringEnabled", checked)}
                />
              </div>

              {/* Feature Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.liveMonitoringEnabled
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">Live Mode</span>
                    {formData.liveMonitoringEnabled && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Selected
                      </Badge>
                    )}
                  </div>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li className="flex items-center space-x-2">
                      <Zap className="w-3 h-3" />
                      <span>Real-time detection</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Lightbulb className="w-3 h-3" />
                      <span>Automatic light control</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>Continuous monitoring</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    !formData.liveMonitoringEnabled
                      ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">Manual Mode</span>
                    {!formData.liveMonitoringEnabled && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Selected
                      </Badge>
                    )}
                  </div>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li className="flex items-center space-x-2">
                      <Upload className="w-3 h-3" />
                      <span>Upload images manually</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Lightbulb className="w-3 h-3" />
                      <span>Manual light control</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>On-demand analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="dark:bg-slate-700" />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
