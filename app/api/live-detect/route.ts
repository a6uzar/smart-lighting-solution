import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { roomId } = await request.json()

    if (!roomId) {
      return NextResponse.json({ error: "roomId is required" }, { status: 400 })
    }

    // Simulate live camera processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate YOLOv8 live detection result
    const occupied = Math.random() > 0.3 // 70% chance of detecting occupancy in live mode
    const confidence = 0.75 + Math.random() * 0.25 // 75-100% confidence for live detection

    return NextResponse.json({
      success: true,
      roomId,
      detection: {
        occupied,
        confidence: Math.round(confidence * 100) / 100,
        timestamp: new Date().toISOString(),
        source: "live_camera",
      },
    })
  } catch (error) {
    console.error("Live detection error:", error)
    return NextResponse.json({ error: "Failed to process live detection" }, { status: 500 })
  }
}
