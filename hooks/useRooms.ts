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
          setRooms(JSON.parse(stored))
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

  return {
    rooms,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
  }
}
