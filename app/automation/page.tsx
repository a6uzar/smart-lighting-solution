"use client"

import { useState } from "react"
import { Plus, Settings, Clock, Zap, Users, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Navigation from "@/components/Navigation"

interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  trigger: {
    type: "occupancy" | "time" | "manual"
    condition: string
  }
  action: {
    type: "lights" | "notification"
    value: string
  }
  rooms: string[]
  createdAt: string
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Auto Lights On - Person Detected",
      enabled: true,
      trigger: {
        type: "occupancy",
        condition: "Person detected with >75% confidence",
      },
      action: {
        type: "lights",
        value: "Turn ON lights",
      },
      rooms: ["All AI-enabled rooms"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Auto Lights Off - Room Empty",
      enabled: true,
      trigger: {
        type: "occupancy",
        condition: "No person detected for 30 seconds",
      },
      action: {
        type: "lights",
        value: "Turn OFF lights",
      },
      rooms: ["All AI-enabled rooms"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Night Mode - Low Light",
      enabled: false,
      trigger: {
        type: "time",
        condition: "Between 10:00 PM - 6:00 AM",
      },
      action: {
        type: "lights",
        value: "Dim to 30%",
      },
      rooms: ["Bedroom", "Hallway"],
      createdAt: new Date().toISOString(),
    },
  ])

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const activeRules = rules.filter((rule) => rule.enabled).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold dark-text-primary mb-2">Automation Rules</h1>
            <p className="dark-text-secondary">Configure smart lighting automation and AI behavior</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center text-slate-600">
                <Settings className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p>Rule creation interface coming soon...</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{rules.length}</div>
              <div className="text-sm dark-text-secondary">Total Rules</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{activeRules}</div>
              <div className="text-sm dark-text-secondary">Active Rules</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm dark-text-secondary">AI Monitoring</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Configuration */}
        <Card className="mb-8 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>AI Detection Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium dark-text-primary">Detection Parameters</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium dark-text-primary">Real-time Processing</div>
                      <div className="text-sm dark-text-secondary">Continuous AI analysis of camera feeds</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium dark-text-primary">Auto Light Control</div>
                      <div className="text-sm dark-text-secondary">Automatically control lights based on occupancy</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium dark-text-primary">Motion Sensitivity</div>
                      <div className="text-sm dark-text-secondary">High sensitivity for person detection</div>
                    </div>
                    <Badge variant="outline">High</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium dark-text-primary">Performance Metrics</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium dark-text-primary">Detection Accuracy</div>
                      <div className="text-sm dark-text-secondary">Average confidence score</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">87%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium dark-text-primary">Response Time</div>
                      <div className="text-sm dark-text-secondary">Average detection to action time</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">1.2s</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium dark-text-primary">Uptime</div>
                      <div className="text-sm dark-text-secondary">System availability</div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">99.8%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Active Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white/40 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                      <div>
                        <h3 className="font-medium dark-text-primary">{rule.name}</h3>
                        <p className="text-sm dark-text-secondary">
                          Created {new Date(rule.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Badge variant={rule.enabled ? "default" : "secondary"}>
                      {rule.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      {rule.trigger.type === "occupancy" ? (
                        <Users className="w-4 h-4 text-blue-600" />
                      ) : rule.trigger.type === "time" ? (
                        <Clock className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Settings className="w-4 h-4 text-slate-600" />
                      )}
                      <div>
                        <div className="font-medium dark-text-primary">Trigger</div>
                        <div className="dark-text-secondary">{rule.trigger.condition}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <div>
                        <div className="font-medium dark-text-primary">Action</div>
                        <div className="dark-text-secondary">{rule.action.value}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-medium dark-text-primary">Applies to</div>
                        <div className="dark-text-secondary">{rule.rooms.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
