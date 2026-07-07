import { NextResponse } from "next/server"
import { getSession } from "@/features/auth/dal"
import { getStoresByOwnerId } from "@/server/services/tenant.service"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stores = await getStoresByOwnerId(session.userId)
  return NextResponse.json(
    stores.map((store) => ({ id: store.id, name: store.name })),
  )
}
