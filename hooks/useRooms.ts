"use client"

import { useState, useEffect, useCallback } from "react"
import type { Room } from "@/types/Room"

const STORAGE_KEY = "smart-lighting-rooms"

// Default rooms for demo purposes
const defaultRooms: Room[] = [
  {
    id: "1",
    name: "Living Room",
    description: "Main living area with smart lighting",
    imageUrl: "/placeholder.svg?height=200&width=300",
    occupancyStatus: "empty",
    lightStatus: "off",
    liveMonitoringEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Kitchen",
    description: "Kitchen area with automated lighting",
    imageUrl: "/placeholder.svg?height=200&width=300",
    occupancyStatus: "empty",
    lightStatus: "off",
    liveMonitoringEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  // Load rooms from localStorage with proper error handling
  const loadRooms = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedRooms = JSON.parse(stored)
        // Ensure all rooms have the required fields with proper defaults
        const validatedRooms = parsedRooms.map((room: any) => ({
          id: room.id || crypto.randomUUID(),
          name: room.name || "Unnamed Room",
          description: room.description || "",
          imageUrl: room.imageUrl || "/placeholder.svg?height=200&width=300",
          occupancyStatus: room.occupancyStatus || "empty",
          lightStatus: room.lightStatus || "off",
          liveMonitoringEnabled: Boolean(room.liveMonitoringEnabled),
          createdAt: room.createdAt || new Date().toISOString(),
          updatedAt: room.updatedAt || new Date().toISOString(),
        }))
        setRooms(validatedRooms)
      } else {
        // Initialize with default rooms if no data exists
        setRooms(defaultRooms)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRooms))
      }
    } catch (error) {
      console.error("Failed to load rooms:", error)
      // Fallback to default rooms on error
      setRooms(defaultRooms)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save rooms to localStorage with error handling
  const saveRooms = useCallback((newRooms: Room[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRooms))
      setRooms(newRooms)
    } catch (error) {
      console.error("Failed to save rooms:", error)
    }
  }, [])

  // Initialize rooms on component mount
  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updatedRooms = JSON.parse(e.newValue)
          setRooms(updatedRooms)
        } catch (error) {
          console.error("Failed to parse updated rooms:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addRoom = useCallback(
    (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
      const newRoom: Room = {
        ...roomData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updatedRooms = [...rooms, newRoom]
      saveRooms(updatedRooms)
    },
    [rooms, saveRooms],
  )

  const updateRoom = useCallback(
    (id: string, roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
      const updatedRooms = rooms.map((room) =>
        room.id === id
          ? {
              ...room,
              ...roomData,
              updatedAt: new Date().toISOString(),
            }
          : room,
      )
      saveRooms(updatedRooms)
    },
    [rooms, saveRooms],
  )

  const deleteRoom = useCallback(
    (id: string) => {
      const filteredRooms = rooms.filter((room) => room.id !== id)
      saveRooms(filteredRooms)
    },
    [rooms, saveRooms],
  )

  const getLiveMonitoringRooms = useCallback(() => {
    return rooms.filter((room) => room.liveMonitoringEnabled)
  }, [rooms])

  const getManualControlRooms = useCallback(() => {
    return rooms.filter((room) => !room.liveMonitoringEnabled)
  }, [rooms])

  const toggleLiveMonitoring = useCallback(
    (id: string, enabled: boolean) => {
      const updatedRooms = rooms.map((room) =>
        room.id === id
          ? {
              ...room,
              liveMonitoringEnabled: enabled,
              updatedAt: new Date().toISOString(),
            }
          : room,
      )
      saveRooms(updatedRooms)
    },
    [rooms, saveRooms],
  )

  return {
    rooms,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
    getLiveMonitoringRooms,
    getManualControlRooms,
    toggleLiveMonitoring,
    refreshRooms: loadRooms,
  }
}
