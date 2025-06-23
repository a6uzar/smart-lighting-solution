interface StatusBadgeProps {
  status: "occupied" | "empty" | "on" | "off"
  type: "occupancy" | "light"
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "occupancy") {
      return status === "occupied"
        ? { label: "Occupied", className: "bg-green-100 text-green-800 border-green-200" }
        : { label: "Empty", className: "bg-red-100 text-red-800 border-red-200" }
    } else {
      return status === "on"
        ? { label: "ON", className: "bg-blue-100 text-blue-800 border-blue-200" }
        : { label: "OFF", className: "bg-slate-100 text-slate-800 border-slate-200" }
    }
  }

  const config = getStatusConfig()

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border transition-all duration-200 ${config.className}`}
    >
      {config.label}
    </span>
  )
}
