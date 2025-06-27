"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type: "occupancy" | "light"
  className?: string
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "occupancy") {
      return status === "occupied"
        ? {
            label: "Occupied",
            className: "bg-green-100 text-green-800 border-green-200",
            dotColor: "bg-green-400",
          }
        : {
            label: "Empty",
            className: "bg-red-100 text-red-800 border-red-200",
            dotColor: "bg-red-400",
          }
    } else {
      return status === "on"
        ? {
            label: "ON",
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
            dotColor: "bg-yellow-400",
          }
        : {
            label: "OFF",
            className: "bg-slate-100 text-slate-800 border-slate-200",
            dotColor: "bg-slate-400",
          }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200",
        config.className,
        className,
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
      <span>{config.label}</span>
    </div>
  )
}
