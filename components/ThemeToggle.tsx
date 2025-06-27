"use client"

import * as React from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
      </div>
    )
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Enhanced Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          "relative w-14 h-8 rounded-full border-2 transition-all duration-500 ease-in-out overflow-hidden group",
          isDark 
            ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 hover:border-slate-500" 
            : "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 hover:border-yellow-400"
        )}
      >
        {/* Background Effects */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-100" : "opacity-0"
        )}>
          {/* Stars for dark mode */}
          <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-1 left-4 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse delay-700" />
        </div>
        
        {/* Sun/Moon Toggle Circle */}
        <div className={cn(
          "absolute top-1 w-6 h-6 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center shadow-lg",
          isDark 
            ? "translate-x-6 bg-gradient-to-br from-slate-300 to-slate-100" 
            : "translate-x-0 bg-gradient-to-br from-yellow-300 to-orange-400"
        )}>
          {isDark ? (
            <Moon className="w-3 h-3 text-slate-700 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <Sun className="w-3 h-3 text-yellow-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          )}
        </div>

        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-sm transition-opacity duration-500",
          isDark 
            ? "bg-blue-500/20 opacity-0 group-hover:opacity-100" 
            : "bg-yellow-400/30 opacity-0 group-hover:opacity-100"
        )} />
      </Button>

      {/* Theme Label with Icon */}
      <div className="flex items-center space-x-1.5">
        <Sparkles className={cn(
          "w-3 h-3 transition-all duration-300",
          isDark ? "text-blue-400" : "text-yellow-500"
        )} />
        <span className={cn(
          "text-sm font-medium transition-colors duration-300",
          isDark ? "text-slate-300" : "text-slate-700"
        )}>
          {isDark ? "Dark" : "Light"}
        </span>
      </div>
    </div>
  )
}
