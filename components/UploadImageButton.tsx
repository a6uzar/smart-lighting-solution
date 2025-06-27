"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface UploadImageButtonProps {
  roomId: string
  onDetectionResult: (isOccupied: boolean) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function UploadImageButton({
  roomId,
  onDetectionResult,
  disabled = false,
  className,
  children,
}: UploadImageButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("roomId", roomId)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onDetectionResult(result.occupancy)
        toast({
          title: "Image analyzed successfully",
          description: `${result.occupancy ? "Person detected" : "No person detected"} - Lights ${result.occupancy ? "turned ON" : "turned OFF"}`,
        })
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the uploaded image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClick = () => {
    if (disabled) {
      toast({
        title: "Upload disabled",
        description: "Live monitoring is active. Disable live monitoring to upload images manually.",
        variant: "destructive",
      })
      return
    }
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />

      {children ? (
        <div
          onClick={handleClick}
          className={cn(
            "cursor-pointer transition-opacity",
            (isProcessing || disabled) && "opacity-50",
            disabled && "cursor-not-allowed",
            className,
          )}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Analyzing...</span>
            </div>
          ) : disabled ? (
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Disabled</span>
            </div>
          ) : (
            children
          )}
        </div>
      ) : (
        <Button
          onClick={handleClick}
          disabled={isProcessing || disabled}
          variant="outline"
          size="sm"
          className={className}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : disabled ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Disabled
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
      )}
    </>
  )
}
