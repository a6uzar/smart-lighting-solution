"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartPanelProps {
  title: string
  type: "line" | "doughnut"
  data: any
}

export default function ChartPanel({ title, type, data }: ChartPanelProps) {
  // This is a placeholder component since we can't use Chart.js in this environment
  // In a real implementation, you would use react-chartjs-2 or similar

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            </div>
            <p className="text-sm text-slate-600">{type === "line" ? "Line Chart" : "Doughnut Chart"} Placeholder</p>
            <p className="text-xs text-slate-500 mt-1">Chart.js integration would render here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
