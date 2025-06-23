"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartPanelProps {
  title: string
  type: "line" | "doughnut" | "bar"
  data: any
}

export default function ChartPanel({ title, type, data }: ChartPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Simulate chart rendering with a simple canvas drawing
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (type === "line") {
      // Draw a simple line chart
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()

      const points = data.datasets[0].data
      const width = canvas.width
      const height = canvas.height
      const stepX = width / (points.length - 1)
      const maxY = Math.max(...points)

      points.forEach((point: number, index: number) => {
        const x = index * stepX
        const y = height - (point / maxY) * height * 0.8

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    } else if (type === "doughnut") {
      // Draw a simple doughnut chart
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.7
      const innerRadius = radius * 0.5

      let currentAngle = 0
      const total = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)

      data.datasets[0].data.forEach((value: number, index: number) => {
        const sliceAngle = (value / total) * 2 * Math.PI

        ctx.fillStyle = data.datasets[0].backgroundColor[index]
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
        ctx.closePath()
        ctx.fill()

        currentAngle += sliceAngle
      })
    }
  }, [data, type])

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <canvas ref={canvasRef} width={400} height={256} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}
