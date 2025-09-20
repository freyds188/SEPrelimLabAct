"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/cart-context"

type ShippingOption = {
  id: string
  name: string
  price: number
  eta: string
  daysMin: number
  daysMax: number
}

type Address = {
  fullName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
}

type OrderPayload = {
  id: number
  createdAt: string
  items: ReturnType<typeof useCart>["items"]
  shippingMethod: ShippingOption
  addresses: {
    shipping: Address
    billing: Address
  }
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  estimatedDeliveryDate: string
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 120,
    eta: "3-5 business days",
    daysMin: 3,
    daysMax: 5,
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 250,
    eta: "1-2 business days",
    daysMin: 1,
    daysMax: 2,
  },
  {
    id: "pickup",
    name: "Free Pickup",
    price: 0,
    eta: "Same day pickup",
    daysMin: 0,
    daysMax: 0,
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams() as { locale: string }
  const { items, getTotalPrice, clearCart, isCartAccessible } = useCart()

  const [selectedShipping, setSelectedShipping] = useState<string>("")
  const [billingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
  })

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (billingSameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }, [billingSameAsShipping, shippingAddress])

  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice])
  const shippingFee = useMemo(() => {
    const opt = SHIPPING_OPTIONS.find(o => o.id === selectedShipping)
    return opt ? opt.price : 0
  }, [selectedShipping])
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee])

  const currency = useMemo(() => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }), [])

  function handleAddressChange(
    which: "shipping" | "billing",
    field: keyof Address,
    value: string
  ) {
    if (which === "shipping") {
      setShippingAddress(prev => ({ ...prev, [field]: value }))
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }))
    }
  }

  function validateForm(): boolean {
    const requiredFields: (keyof Address)[] = [
      "fullName",
      "email",
      "phone",
      "address1",
      "city",
      "province",
      "postalCode",
      "country",
    ]
    const newErrors: Record<string, string> = {}

    requiredFields.forEach(key => {
      if (!shippingAddress[key] || String(shippingAddress[key]).trim() === "") {
        newErrors[`shipping.${key}`] = "Required"
      }
      const billing = billingSameAsShipping ? shippingAddress : billingAddress
      if (!billing[key] || String(billing[key]).trim() === "") {
        newErrors[`billing.${key}`] = "Required"
      }
    })

    if (!selectedShipping) {
      newErrors["shippingMethod"] = "Please select a shipping method"
    }

    if (!items.length) {
      newErrors["cart"] = "Your cart is empty"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function getEstimatedDeliveryDate(option: ShippingOption): string {
    const now = new Date()
    const daysToAdd = option.daysMin
    const etaDate = new Date(now)
    etaDate.setDate(now.getDate() + daysToAdd)
    return etaDate.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  async function handlePlaceOrder() {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const chosen = SHIPPING_OPTIONS.find(o => o.id === selectedShipping) as ShippingOption

      const orderId = Date.now() // demo numeric id
      const payload: OrderPayload = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items,
        shippingMethod: chosen,
        addresses: {
          shipping: shippingAddress,
          billing: billingSameAsShipping ? shippingAddress : billingAddress,
        },
        totals: {
          subtotal,
          shipping: chosen.price,
          total,
        },
        estimatedDeliveryDate: getEstimatedDeliveryDate(chosen),
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(`order_${orderId}`, JSON.stringify(payload))
        localStorage.setItem("order_last", JSON.stringify(payload))
      }

      clearCart()

      router.push(`/${params.locale}/order/success?orderId=${orderId}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isCartAccessible) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        <div className="rounded-md border p-6 bg-background">
          <p className="text-sm text-muted-foreground">Please sign in to access your cart and proceed to checkout.</p>
          <div className="mt-6">
            <Button onClick={() => router.push(`/${params.locale}/shop`)}>
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        <div className="rounded-md border p-6 bg-background">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <div className="mt-6">
            <Button onClick={() => router.push(`/${params.locale}/shop`)}>
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section className="rounded-md border p-6 bg-background">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s_fullName">Full name</Label>
              <Input id="s_fullName" value={shippingAddress.fullName} onChange={e => handleAddressChange("shipping", "fullName", e.target.value)} />
              {errors["shipping.fullName"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.fullName"]}</p>}
            </div>
            <div>
              <Label htmlFor="s_email">Email</Label>
              <Input id="s_email" type="email" value={shippingAddress.email} onChange={e => handleAddressChange("shipping", "email", e.target.value)} />
              {errors["shipping.email"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.email"]}</p>}
            </div>
            <div>
              <Label htmlFor="s_phone">Phone</Label>
              <Input id="s_phone" value={shippingAddress.phone} onChange={e => handleAddressChange("shipping", "phone", e.target.value)} />
              {errors["shipping.phone"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.phone"]}</p>}
            </div>
            <div>
              <Label htmlFor="s_country">Country</Label>
              <Input id="s_country" value={shippingAddress.country} onChange={e => handleAddressChange("shipping", "country", e.target.value)} />
              {errors["shipping.country"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.country"]}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="s_address1">Address line 1</Label>
              <Input id="s_address1" value={shippingAddress.address1} onChange={e => handleAddressChange("shipping", "address1", e.target.value)} />
              {errors["shipping.address1"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.address1"]}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="s_address2">Address line 2 (optional)</Label>
              <Input id="s_address2" value={shippingAddress.address2} onChange={e => handleAddressChange("shipping", "address2", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="s_city">City</Label>
              <Input id="s_city" value={shippingAddress.city} onChange={e => handleAddressChange("shipping", "city", e.target.value)} />
              {errors["shipping.city"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.city"]}</p>}
            </div>
            <div>
              <Label htmlFor="s_province">Province</Label>
              <Input id="s_province" value={shippingAddress.province} onChange={e => handleAddressChange("shipping", "province", e.target.value)} />
              {errors["shipping.province"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.province"]}</p>}
            </div>
            <div>
              <Label htmlFor="s_postal">Postal code</Label>
              <Input id="s_postal" value={shippingAddress.postalCode} onChange={e => handleAddressChange("shipping", "postalCode", e.target.value)} />
              {errors["shipping.postalCode"] && <p className="text-xs text-red-600 mt-1">{errors["shipping.postalCode"]}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-md border p-6 bg-background">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Billing Address</h2>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                checked={billingSameAsShipping}
                onChange={e => setBillingSameAsShipping(e.target.checked)}
              />
              Same as shipping
            </label>
          </div>

          {!billingSameAsShipping && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="b_fullName">Full name</Label>
                <Input id="b_fullName" value={billingAddress.fullName} onChange={e => handleAddressChange("billing", "fullName", e.target.value)} />
                {errors["billing.fullName"] && <p className="text-xs text-red-600 mt-1">{errors["billing.fullName"]}</p>}
              </div>
              <div>
                <Label htmlFor="b_email">Email</Label>
                <Input id="b_email" type="email" value={billingAddress.email} onChange={e => handleAddressChange("billing", "email", e.target.value)} />
                {errors["billing.email"] && <p className="text-xs text-red-600 mt-1">{errors["billing.email"]}</p>}
              </div>
              <div>
                <Label htmlFor="b_phone">Phone</Label>
                <Input id="b_phone" value={billingAddress.phone} onChange={e => handleAddressChange("billing", "phone", e.target.value)} />
                {errors["billing.phone"] && <p className="text-xs text-red-600 mt-1">{errors["billing.phone"]}</p>}
              </div>
              <div>
                <Label htmlFor="b_country">Country</Label>
                <Input id="b_country" value={billingAddress.country} onChange={e => handleAddressChange("billing", "country", e.target.value)} />
                {errors["billing.country"] && <p className="text-xs text-red-600 mt-1">{errors["billing.country"]}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="b_address1">Address line 1</Label>
                <Input id="b_address1" value={billingAddress.address1} onChange={e => handleAddressChange("billing", "address1", e.target.value)} />
                {errors["billing.address1"] && <p className="text-xs text-red-600 mt-1">{errors["billing.address1"]}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="b_address2">Address line 2 (optional)</Label>
                <Input id="b_address2" value={billingAddress.address2} onChange={e => handleAddressChange("billing", "address2", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="b_city">City</Label>
                <Input id="b_city" value={billingAddress.city} onChange={e => handleAddressChange("billing", "city", e.target.value)} />
                {errors["billing.city"] && <p className="text-xs text-red-600 mt-1">{errors["billing.city"]}</p>}
              </div>
              <div>
                <Label htmlFor="b_province">Province</Label>
                <Input id="b_province" value={billingAddress.province} onChange={e => handleAddressChange("billing", "province", e.target.value)} />
                {errors["billing.province"] && <p className="text-xs text-red-600 mt-1">{errors["billing.province"]}</p>}
              </div>
              <div>
                <Label htmlFor="b_postal">Postal code</Label>
                <Input id="b_postal" value={billingAddress.postalCode} onChange={e => handleAddressChange("billing", "postalCode", e.target.value)} />
                {errors["billing.postalCode"] && <p className="text-xs text-red-600 mt-1">{errors["billing.postalCode"]}</p>}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-md border p-6 bg-background">
          <h2 className="text-xl font-semibold mb-4">Shipping Options</h2>
          {errors["shippingMethod"] && <p className="text-sm text-red-600 mb-3">{errors["shippingMethod"]}</p>}
          <div className="space-y-3">
            {SHIPPING_OPTIONS.map(option => {
              const isSelected = selectedShipping === option.id
              return (
                <label key={option.id} className={`flex items-center justify-between gap-4 rounded-md border p-4 cursor-pointer transition ${isSelected ? "border-primary bg-accent" : "hover:bg-accent/50"}`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shippingOption"
                      className="h-4 w-4"
                      checked={isSelected}
                      onChange={() => setSelectedShipping(option.id)}
                    />
                    <div>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-muted-foreground">{option.eta}</p>
                    </div>
                  </div>
                  <div className="font-semibold">{currency.format(option.price)}</div>
                </label>
              )
            })}
          </div>
        </section>
      </div>

      <aside className="lg:col-span-1">
        <div className="rounded-md border p-6 bg-background">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 max-h-[320px] overflow-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium">{currency.format(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="my-4 border-t" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{currency.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{selectedShipping ? currency.format(shippingFee) : "—"}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t">
              <span>Total</span>
              <span>{currency.format(total)}</span>
            </div>
          </div>

          {selectedShipping && (
            <p className="text-xs text-muted-foreground mt-2">
              Est. delivery: {getEstimatedDeliveryDate(SHIPPING_OPTIONS.find(o => o.id === selectedShipping)!)}
            </p>
          )}

          {errors["cart"] && <p className="text-sm text-red-600 mt-3">{errors["cart"]}</p>}

          <Button
            className="w-full mt-6"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            aria-label="Place Order"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => router.push(`/${params.locale}/shop`)}
          >
            Back to Shop
          </Button>
        </div>
      </aside>
    </div>
  )
}
