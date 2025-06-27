"use client"

import { useState, useEffect } from "react"
import type { Room } from "@/types/Room"

const STORAGE_KEY = "slcs-rooms"

// Default sample rooms for better UX
const defaultRooms: Room[] = [
  {
    id: "1",
    name: "Living Room",
    description: "Main living area with smart lighting",
    imageUrl: "/placeholder.svg?height=200&width=300",
    occupancyStatus: "empty",
    lightStatus: "off",
    liveMonitoringEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Kitchen",
    description: "Kitchen area with automated lighting",
    imageUrl: "/placeholder.svg?height=200&width=300",
    occupancyStatus: "empty",
    lightStatus: "off",
    liveMonitoringEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load rooms from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedRooms = JSON.parse(stored).map((room: any) => ({
          ...room,
          createdAt: new Date(room.createdAt),
          updatedAt: new Date(room.updatedAt),
        }))
        setRooms(parsedRooms)
      } else {
        // Initialize with default rooms if none exist
        setRooms(defaultRooms)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRooms))
      }
    } catch (error) {
      console.error("Failed to load rooms from localStorage:", error)
      // Fallback to default rooms on error
      setRooms(defaultRooms)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save rooms to localStorage whenever rooms change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
      } catch (error) {
        console.error("Failed to save rooms to localStorage:", error)
      }
    }
  }, [rooms, isLoading])

  const addRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setRooms((prev) => [...prev, newRoom])
  }

  const updateRoom = (id: string, roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id
          ? {
              ...roomData,
              id,
              createdAt: room.createdAt,
              updatedAt: new Date(),
            }
          : room,
      ),
    )
  }

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id))
  }

  const getRoomById = (id: string) => {
    return rooms.find((room) => room.id === id)
  }

  return {
    rooms,
    isLoading,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoomById,
  }
}
