"use client"

import { useCallback } from "react"

export function useOccupancyStatus() {
  const updateOccupancyStatus = useCallback((roomId: string, status: "occupied" | "empty") => {
    // Get current rooms from localStorage
    const stored = localStorage.getItem("smart-lighting-rooms")
    if (!stored) return

    try {
      const rooms = JSON.parse(stored)
      const updatedRooms = rooms.map((room: any) => {
        if (room.id === roomId) {
          return {
            ...room,
            occupancyStatus: status,
            lightStatus: status === "occupied" ? "on" : "off",
            updatedAt: new Date().toISOString(),
          }
        }
        return room
      })

      localStorage.setItem("smart-lighting-rooms", JSON.stringify(updatedRooms))

      // Trigger a storage event to update other components
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Failed to update occupancy status:", error)
    }
  }, [])

  return { updateOccupancyStatus }
}
