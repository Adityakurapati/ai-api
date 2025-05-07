import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseDatabase } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    // Get the query parameter
    const searchParams = request.nextUrl.searchParams
    const personParam = searchParams.get("person")

    // Convert the parameter to boolean
    const personDetected = personParam === "true"

    // Get a reference to the database
    const db = getFirebaseDatabase()

    // Update the status/result node in the database
    await db.ref("status/result").set(personDetected)

    // Return a success response
    return NextResponse.json({
      success: true,
      message: `Updated status/result to ${personDetected}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating Firebase:", error)

    // Return an error response
    return NextResponse.json({ success: false, error: "Failed to update Firebase database" }, { status: 500 })
  }
}
