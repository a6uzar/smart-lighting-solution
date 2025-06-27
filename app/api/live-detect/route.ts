import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { roomId } = await request.json()

    if (!roomId) {
      return NextResponse.json({ success: false, error: "Missing room ID" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate YOLOv8 live detection result
    const isOccupied = Math.random() > 0.3 // 70% chance of detecting a person
    const confidence = Math.round((Math.random() * 0.2 + 0.8) * 100) // 80-100% confidence

    return NextResponse.json({
      success: true,
      occupancy: isOccupied,
      confidence,
      message: `Live detection: ${isOccupied ? "Person detected" : "No person detected"} with ${confidence}% confidence`,
    })
  } catch (error) {
    console.error("Live detect error:", error)
    return NextResponse.json({ success: false, error: "Failed to process live detection" }, { status: 500 })
  }
}
