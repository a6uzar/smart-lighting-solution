"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("roomId", roomId)

      const response = await fetch("/api/ai-detection", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const result = await response.json()

      if (result.success) {
        onDetectionResult(result.occupancy, result.confidence)
        toast.success(
          `Detection complete: ${result.occupancy ? "Occupied" : "Empty"} (${Math.round(result.confidence * 100)}% confidence)`,
        )
      } else {
        throw new Error(result.error || "Detection failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to analyze image. Please try again.")
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClick = () => {
    if (disabled || isUploading) return
    fileInputRef.current?.click()
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
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          children || (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )
        )}
      </Button>
    </>
  )
}
