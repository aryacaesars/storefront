import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { stripe } from "@/lib/stripe"
import { markPurchasePaid, activateTemplate } from "@/server/services/template.service"
import { markOrderPaid } from "@/server/services/order.service"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed"
    console.error("[stripe webhook] verification failed:", message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const meta = (session.metadata ?? {}) as {
      orderId?: string
      storeId?: string
      templateId?: string
    }

    try {
      if (meta.orderId) {
        // Storefront order: bayar produk end user.
        const paymentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? session.id)
        await markOrderPaid(meta.orderId, paymentId)
        console.log(`[stripe webhook] order ${meta.orderId} marked PAID`)
      } else if (meta.storeId && meta.templateId) {
        // Template purchase: owner beli template.
        await markPurchasePaid(session.id)
        await activateTemplate(meta.storeId, meta.templateId)
        console.log(`[stripe webhook] template ${meta.templateId} activated for store ${meta.storeId}`)
      } else {
        console.error("[stripe webhook] missing metadata:", session.id)
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }
    } catch (err) {
      console.error("[stripe webhook] failed to process:", err)
      return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
