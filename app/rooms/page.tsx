"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import RoomCard from "@/components/RoomCard"
import RoomDialog from "@/components/RoomDialog"
import { useRooms } from "@/hooks/useRooms"
import type { Room } from "@/types/Room"

export default function RoomsPage() {
  const { rooms, addRoom, updateRoom } = useRooms()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")

  const handleAddRoom = () => {
    setEditingRoom(null)
    setDialogMode("add")
    setDialogOpen(true)
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleSubmitRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    if (dialogMode === "add") {
      addRoom(roomData)
    } else if (editingRoom) {
      updateRoom(editingRoom.id, roomData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-500">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Room Management</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Configure and monitor your smart lighting rooms with AI-powered automation
              </p>
            </div>
            <Button
              onClick={handleAddRoom}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </Button>
          </div>

          {/* Rooms Grid */}
          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No rooms configured</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Get started by adding your first room to enable smart lighting control
              </p>
              <Button
                onClick={handleAddRoom}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Add Your First Room
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onEdit={() => handleEditRoom(room)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Room Dialog */}
      <RoomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        room={editingRoom}
        onSubmit={handleSubmitRoom}
        mode={dialogMode}
      />
    </div>
  )
}
