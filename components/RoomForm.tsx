"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
    aiControlEnabled: room?.aiControlEnabled ?? true,
    manualOverride: room?.manualOverride ?? false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Room Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter room name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter room description (optional)"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Initial Image URL (optional)</label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/room-image.jpg"
          type="url"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {room ? "Update Room" : "Create Room"}
        </Button>
      </div>
    </form>
  )
}
