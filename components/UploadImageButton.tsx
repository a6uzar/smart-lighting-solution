"use client"

import type React from "react"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadImageButtonProps {
  onUpload: (file: File) => void
  disabled?: boolean
}

export default function UploadImageButton({ onUpload, disabled }: UploadImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        className="w-full bg-white text-slate-700 hover:bg-slate-50"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Image
      </Button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </>
  )
}
