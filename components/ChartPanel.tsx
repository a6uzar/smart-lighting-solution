"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartPanelProps {
  title: string
  description?: string
  type: "line" | "doughnut" | "bar" | "area" | "donut"
  timeRange?: string
  data?: any
}

export default function ChartPanel({ title, description, type, timeRange, data }: ChartPanelProps) {
  // This is a placeholder component since we can't use Chart.js in this environment
  // In a real implementation, you would use react-chartjs-2 or similar

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg dark:text-slate-100">{title}</CardTitle>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
        {timeRange && (
          <p className="text-xs text-slate-500 dark:text-slate-500">Time Range: {timeRange}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {type === "line" ? "Line Chart" : 
               type === "doughnut" || type === "donut" ? "Doughnut Chart" :
               type === "bar" ? "Bar Chart" : 
               type === "area" ? "Area Chart" : "Chart"} Placeholder
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Chart.js integration would render here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
