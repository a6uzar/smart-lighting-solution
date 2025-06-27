import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const roomId = formData.get("roomId") as string

    if (!image || !roomId) {
      return NextResponse.json({ success: false, error: "Missing image or room ID" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate YOLOv8 detection result
    const isOccupied = Math.random() > 0.4 // 60% chance of detecting a person
    const confidence = Math.round((Math.random() * 0.3 + 0.7) * 100) // 70-100% confidence

    return NextResponse.json({
      success: true,
      occupancy: isOccupied,
      confidence,
      message: `${isOccupied ? "Person detected" : "No person detected"} with ${confidence}% confidence`,
    })
  } catch (error) {
    console.error("Upload image error:", error)
    return NextResponse.json({ success: false, error: "Failed to process image" }, { status: 500 })
  }
}
