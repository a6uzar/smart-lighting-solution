"use client"

import { useState, useEffect } from "react"
import type { Room } from "@/types/Room"

const STORAGE_KEY = "smart-lighting-rooms"

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRooms = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsedRooms = JSON.parse(stored)
          // Ensure all rooms have the liveMonitoringEnabled field
          const updatedRooms = parsedRooms.map((room: any) => ({
            ...room,
            liveMonitoringEnabled: room.liveMonitoringEnabled ?? false,
          }))
          setRooms(updatedRooms)
        }
      } catch (error) {
        console.error("Failed to load rooms:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [])

  const saveRooms = (newRooms: Room[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRooms))
      setRooms(newRooms)
    } catch (error) {
      console.error("Failed to save rooms:", error)
    }
  }

  const addRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const newRoom: Room = {
      ...roomData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveRooms([...rooms, newRoom])
  }

  const updateRoom = (id: string, roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id ? { ...room, ...roomData, updatedAt: new Date().toISOString() } : room,
    )
    saveRooms(updatedRooms)
  }

  const deleteRoom = (id: string) => {
    const filteredRooms = rooms.filter((room) => room.id !== id)
    saveRooms(filteredRooms)
  }

  const getLiveMonitoringRooms = () => {
    return rooms.filter((room) => room.liveMonitoringEnabled)
  }

  const getManualControlRooms = () => {
    return rooms.filter((room) => !room.liveMonitoringEnabled)
  }

  return {
    rooms,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
    getLiveMonitoringRooms,
    getManualControlRooms,
  }
}
