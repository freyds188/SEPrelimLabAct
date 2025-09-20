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
    image?: string
    weaver_name?: string
  }>
  shippingMethod: {
    id: string
    name: string
    price: number
    eta: string
  }
  addresses: {
    shipping: any
    billing: any
  }
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  estimatedDeliveryDate: string
}

export default function OrderSuccessPage() {
  const params = useParams() as { locale: string }
  const search = useSearchParams()
  const router = useRouter()
  const orderIdParam = search.get("orderId")
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const key = orderIdParam ? `order_${orderIdParam}` : "order_last"
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (raw) {
      try {
        setOrder(JSON.parse(raw))
      } catch {}
    }
  }, [orderIdParam])

  const currency = useMemo(() => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }), [])

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Order Success</h1>
        <div className="rounded-md border p-6 bg-background">
          <p className="text-sm text-muted-foreground">We couldn't find your order details.</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.push(`/${params.locale}/shop`)}>Back to Shop</Button>
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/order/track`)}>Track Orders</Button>
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
            <h1 className="text-2xl font-semibold">Thank you! 🎉</h1>
            <p className="text-sm text-muted-foreground">Your order has been placed successfully.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="text-lg font-semibold">#{order.id}</p>
          </div>
        </div>

        <div className="my-6 border-t" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Items</h2>
            <div className="space-y-3 max-h-60 overflow-auto pr-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-medium">{currency.format(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Shipping Method</h2>
            <div className="rounded-md border p-4">
              <p className="font-medium">{order.shippingMethod.name}</p>
              <p className="text-sm text-muted-foreground">{order.shippingMethod.eta}</p>
              <p className="text-sm mt-2">Estimated delivery: <span className="font-medium">{order.estimatedDeliveryDate}</span></p>
            </div>

            <h2 className="font-semibold mt-6 mb-2">Addresses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md border p-4">
                <p className="font-medium mb-1">Shipping</p>
                <AddressBlock addr={order.addresses.shipping} />
              </div>
              <div className="rounded-md border p-4">
                <p className="font-medium mb-1">Billing</p>
                <AddressBlock addr={order.addresses.billing} />
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 border-t" />

        <div className="flex items-center justify-between">
          <div className="text-sm space-y-1">
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{currency.format(order.totals.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{currency.format(order.totals.shipping)}</span>
            </div>
            <div className="flex justify-between gap-6 border-t pt-2 text-base font-semibold">
              <span>Total Paid</span>
              <span>{currency.format(order.totals.total)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/${params.locale}/order/track?orderId=${order.id}`}>Track Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${params.locale}/shop`}>Back to Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddressBlock({ addr }: { addr: any }) {
  return (
    <div className="text-sm text-muted-foreground">
      <p>{addr.fullName}</p>
      <p>{addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}</p>
      <p>{addr.city}, {addr.province} {addr.postalCode}</p>
      <p>{addr.country}</p>
      <p className="mt-1">{addr.email} • {addr.phone}</p>
    </div>
  )
}




