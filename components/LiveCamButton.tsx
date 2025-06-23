"use client"

import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LiveCamButtonProps {
  onDetect: () => void
  disabled?: boolean
}

export default function LiveCamButton({ onDetect, disabled }: LiveCamButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onDetect}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100 border-blue-200"
    >
      <Video className="w-4 h-4 mr-2" />
      Live Camera
    </Button>
  )
}
