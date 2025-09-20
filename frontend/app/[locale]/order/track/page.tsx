"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type OrderData = {
  id: number
  createdAt: string
  items: Array<{
    id: number
    product_id: number
    name: string
    slug: string
    price: number
    quantity: number
  }>
  shippingMethod: {
    id: string
    name: string
    price: number
    eta: string
  }
  estimatedDeliveryDate: string
}

const STATUS_STEPS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const

type Status = typeof STATUS_STEPS[number]

export default function OrderTrackPage() {
  const params = useParams() as { locale: string }
  const search = useSearchParams()
  const router = useRouter()
  const orderIdParam = search.get("orderId")

  const [order, setOrder] = useState<OrderData | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(0)

  useEffect(() => {
    const key = orderIdParam ? `order_${orderIdParam}` : "order_last"
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setOrder(parsed)
      } catch {}
    }
  }, [orderIdParam])

  // Simulate status progression on the client for demo purposes
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("order_status_step") : null
    const initialStep = stored ? Number(stored) : 1 // start from Processing
    setCurrentStep(isNaN(initialStep) ? 1 : Math.min(initialStep, STATUS_STEPS.length - 1))

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = Math.min(prev + 1, STATUS_STEPS.length - 1)
        if (typeof window !== "undefined") {
          localStorage.setItem("order_status_step", String(next))
        }
        return next
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const currency = useMemo(() => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }), [])

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Track Order</h1>
        <div className="rounded-md border p-6 bg-background">
          <p className="text-sm text-muted-foreground">No order data found. Place an order first.</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.push(`/${params.locale}/shop`)}>Back to Shop</Button>
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/checkout`)}>Go to Checkout</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="rounded-md border p-6 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Order Tracking</h1>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Shipping</p>
            <p className="font-medium">{order.shippingMethod.name}</p>
            <p className="text-muted-foreground">ETA: {order.shippingMethod.eta}</p>
          </div>
        </div>

        <div className="mt-8">
          <ol className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {STATUS_STEPS.map((label, idx) => {
              const isDone = idx <= currentStep
              return (
                <li key={label} className={`rounded-md border p-4 text-center ${isDone ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                  <p className="text-sm font-medium">{label}</p>
                </li>
              )
            })}
          </ol>

          <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-2 bg-primary transition-all"
              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground mt-3">Estimated delivery: <span className="font-medium">{order.estimatedDeliveryDate}</span></p>
        </div>

        <div className="my-8 border-t" />

        <div>
          <h2 className="font-semibold mb-3">Items</h2>
          <div className="space-y-2 text-sm max-h-48 overflow-auto pr-2">
            {order.items.map(i => (
              <div key={i.id} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {i.name} × {i.quantity}
                </span>
                <span className="font-medium">{currency.format(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href={`/${params.locale}/shop`}>Back to Shop</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${params.locale}/order/success?orderId=${order.id}`}>View Receipt</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}




