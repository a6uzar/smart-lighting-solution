"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-slate-400" />
          <div className="w-11 h-6 bg-slate-200 rounded-full" />
          <Moon className="h-4 w-4 text-slate-400" />
        </div>
        <span className="text-sm font-medium text-slate-400">Loading...</span>
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${isDark ? "text-slate-400 scale-90" : "text-yellow-500 scale-110"}`}
        />
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-yellow-300 transition-all duration-300"
        />
        <Moon
          className={`h-4 w-4 transition-all duration-300 ${isDark ? "text-blue-400 scale-110" : "text-slate-400 scale-90"}`}
        />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
        {isDark ? "Dark" : "Light"}
      </span>
    </div>
  )
}
