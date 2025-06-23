import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const roomId = formData.get("roomId") as string

    if (!file || !roomId) {
      return NextResponse.json({ error: "File and roomId are required" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate YOLOv8 detection result
    const occupied = Math.random() > 0.4 // 60% chance of detecting occupancy
    const confidence = 0.7 + Math.random() * 0.3 // 70-100% confidence

    return NextResponse.json({
      success: true,
      roomId,
      detection: {
        occupied,
        confidence: Math.round(confidence * 100) / 100,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
