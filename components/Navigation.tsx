"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, BarChart3, Camera, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview & Controls",
  },
  {
    name: "Rooms",
    href: "/rooms",
    icon: Lightbulb,
    description: "Room Management",
  },
  {
    name: "Live Monitor",
    href: "/live-monitor",
    icon: Camera,
    description: "Real-time Monitoring",
  },
  {
    name: "Automation",
    href: "/automation",
    icon: Settings,
    description: "Smart Rules",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Usage Statistics",
  },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Smart Lighting</h1>
              <p className="text-xs text-slate-600">AI Control System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}

                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.description}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
