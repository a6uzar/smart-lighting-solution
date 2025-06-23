"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Zap, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AutomationPage() {
  const [autoTurnOff, setAutoTurnOff] = useState(true)
  const [turnOffDelay, setTurnOffDelay] = useState([5])
  const [nightMode, setNightMode] = useState(true)
  const [nightModeTime, setNightModeTime] = useState("22:00")
  const [dimLevel, setDimLevel] = useState([30])
  const [motionSensitivity, setMotionSensitivity] = useState("medium")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Automation Rules</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Auto Turn Off */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle>Auto Turn Off</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      Automatically turn off lights when no occupancy is detected
                    </p>
                  </div>
                </div>
                <Switch checked={autoTurnOff} onCheckedChange={setAutoTurnOff} />
              </div>
            </CardHeader>
            {autoTurnOff && (
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Turn off after: {turnOffDelay[0]} minutes
                    </label>
                    <Slider
                      value={turnOffDelay}
                      onValueChange={setTurnOffDelay}
                      max={30}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Night Mode */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-purple-600" />
                  <div>
                    <CardTitle>Night Mode</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">Dim lights automatically during night hours</p>
                  </div>
                </div>
                <Switch checked={nightMode} onCheckedChange={setNightMode} />
              </div>
            </CardHeader>
            {nightMode && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Start Time</label>
                    <input
                      type="time"
                      value={nightModeTime}
                      onChange={(e) => setNightModeTime(e.target.value)}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Dim Level: {dimLevel[0]}%</label>
                    <Slider value={dimLevel} onValueChange={setDimLevel} max={80} min={10} step={5} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Motion Detection */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-green-600" />
                <div>
                  <CardTitle>Motion Detection Settings</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Configure AI-based occupancy detection sensitivity</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Detection Sensitivity</label>
                  <Select value={motionSensitivity} onValueChange={setMotionSensitivity}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Reduce false positives</SelectItem>
                      <SelectItem value="medium">Medium - Balanced detection</SelectItem>
                      <SelectItem value="high">High - Maximum sensitivity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Saving */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Sun className="w-5 h-5 text-yellow-600" />
                <div>
                  <CardTitle>Energy Saving Mode</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Optimize lighting for maximum energy efficiency</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Daylight Adjustment</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Gradual Dimming</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
