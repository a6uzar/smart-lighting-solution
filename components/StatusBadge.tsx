"use client"

import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  type: "occupancy" | "light"
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "occupancy") {
      return status === "occupied"
        ? {
            label: "Occupied",
            className:
              "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700",
          }
        : {
            label: "Empty",
            className:
              "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          }
    }

    return status === "on"
      ? {
          label: "On",
          className:
            "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700",
        }
      : {
          label: "Off",
          className:
            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        }
  }

  const config = getStatusConfig()

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}
