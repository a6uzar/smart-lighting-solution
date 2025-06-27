"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoomForm from "@/components/RoomForm"
import Navigation from "@/components/Navigation"
import type { Room } from "@/types/Room"
import { useRooms } from "@/hooks/useRooms"
import { useToast } from "@/hooks/use-toast"

export default function RoomsPage() {
  const { rooms, addRoom, updateRoom, deleteRoom, loading } = useRooms()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const handleAddRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    addRoom(roomData)
    setShowForm(false)
    toast({
      title: "Room added successfully",
      description: `${roomData.name} has been added to your smart lighting system.`,
    })
  }

  const handleUpdateRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    if (editingRoom) {
      updateRoom(editingRoom.id, roomData)
      setEditingRoom(null)
      toast({
        title: "Room updated successfully",
        description: `${roomData.name} has been updated.`,
      })
    }
  }

  const handleDeleteRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    deleteRoom(roomId)
    toast({
      title: "Room deleted",
      description: `${room?.name} has been removed from your system.`,
      variant: "destructive",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Room Management</h2>
            <p className="text-slate-600 mt-1">Create, edit, and manage your smart lighting rooms</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Room
          </Button>
        </div>

        {/* Room Form */}
        {(showForm || editingRoom) && (
          <Card className="mb-8 bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle>{editingRoom ? "Edit Room" : "Add New Room"}</CardTitle>
            </CardHeader>
            <CardContent>
              <RoomForm
                room={editingRoom}
                onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
                onCancel={() => {
                  setShowForm(false)
                  setEditingRoom(null)
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Rooms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{room.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingRoom(room)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {room.imageUrl && (
                  <img
                    src={room.imageUrl || "/placeholder.svg"}
                    alt={room.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Created:</span>
                  <span className="text-slate-900">{new Date(room.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No rooms yet</h3>
              <p className="text-slate-600 text-center mb-4 max-w-md">
                Create your first room to start managing smart lighting automation with AI-powered occupancy detection.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Room
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
