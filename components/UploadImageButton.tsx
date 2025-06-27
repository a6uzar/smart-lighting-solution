"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface UploadImageButtonProps {
  roomId: string
  onDetectionResult: (isOccupied: boolean, confidence?: number) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function UploadImageButton({
  roomId,
  onDetectionResult,
  disabled = false,
  className = "",
  children,
}: UploadImageButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("roomId", roomId)
      formData.append("mode", "upload")

      const response = await fetch("/api/ai-detection", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onDetectionResult(result.occupied, result.confidence)
        toast({
          title: "Analysis Complete",
          description: `Room is ${result.occupied ? "occupied" : "empty"} (${Math.round(result.confidence)}% confidence)`,
        })
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button onClick={handleClick} disabled={disabled || isUploading} className={className} variant="outline">
        {children || (
          <>
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            <span className="text-sm font-medium">
              {isUploading ? "Analyzing..." : disabled ? "Disabled" : "Upload Image"}
            </span>
          </>
        )}
      </Button>
    </>
  )
}
