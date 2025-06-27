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
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Sun className={`h-4 w-4 transition-colors ${isDark ? "text-slate-400" : "text-yellow-500"}`} />
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          className="data-[state=checked]:bg-slate-600 data-[state=unchecked]:bg-yellow-200"
        />
        <Moon className={`h-4 w-4 transition-colors ${isDark ? "text-blue-400" : "text-slate-400"}`} />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{isDark ? "Dark" : "Light"}</span>
    </div>
  )
}
