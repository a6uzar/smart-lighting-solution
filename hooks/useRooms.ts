"use client"

import { useState, useEffect } from "react"
import type { Room } from "@/types/Room"

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load rooms from localStorage
    const savedRooms = localStorage.getItem("smart-lighting-rooms")
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms))
    } else {
      // Initialize with sample data
      const sampleRooms: Room[] = [
        {
          id: "1",
          name: "Living Room",
          description: "Main living area with smart lighting",
          imageUrl: "/placeholder.svg?height=200&width=300",
          occupancyStatus: "occupied",
          lightStatus: "on",
          aiControlEnabled: true,
          manualOverride: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Kitchen",
          description: "Kitchen area with under-cabinet lighting",
          imageUrl: "/placeholder.svg?height=200&width=300",
          occupancyStatus: "empty",
          lightStatus: "off",
          aiControlEnabled: true,
          manualOverride: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setRooms(sampleRooms)
      localStorage.setItem("smart-lighting-rooms", JSON.stringify(sampleRooms))
    }
    setLoading(false)
  }, [])

  const saveRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms)
    localStorage.setItem("smart-lighting-rooms", JSON.stringify(updatedRooms))
  }

  const addRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedRooms = [...rooms, newRoom]
    saveRooms(updatedRooms)
  }

  const updateRoom = (roomId: string, roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const updatedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, ...roomData, updatedAt: new Date().toISOString() } : room,
    )
    saveRooms(updatedRooms)
  }

  const deleteRoom = (roomId: string) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId)
    saveRooms(updatedRooms)
  }

  const updateRoomStatus = (roomId: string, occupancyStatus: "occupied" | "empty", lightStatus: "on" | "off") => {
    const updatedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, occupancyStatus, lightStatus, updatedAt: new Date().toISOString() } : room,
    )
    saveRooms(updatedRooms)
  }

  return {
    rooms,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
  }
}
