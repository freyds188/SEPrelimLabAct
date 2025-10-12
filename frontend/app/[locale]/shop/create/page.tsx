"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Upload, Package } from "lucide-react"

const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  stock_quantity: z.string().min(0, "Stock quantity is required"),
  category: z.string().min(1, "Category is required"),
  material: z.string().optional(),
  color: z.string().optional(),
  tribe: z.string().optional(),
  technique: z.string().optional(),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
  })

  // Redirect sellers to the new seller dashboard
  useEffect(() => {
    if (user && user.role === 'seller') {
      router.push('/seller/products/create')
    }
  }, [user, router])

  // Redirect if not a seller
  if (user && user.role !== 'seller') {
    router.push('/en/shop')
    return null
  }

  const onSubmit = async (data: CreateProductFormData) => {
    setIsLoading(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          stock_quantity: parseInt(data.stock_quantity),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Product submitted for approval!')
        router.push('/en/shop')
      } else {
        toast.error(result.message || 'Failed to create product')
      }
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/en/shop"
            className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-accent-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Product</CardTitle>
                <CardDescription>
                  Submit your handwoven product for admin approval
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Product Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                  disabled={isLoading}
                  placeholder="e.g., Traditional Ikat Textile"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 ${
                    errors.description ? "border-red-500" : "border-neutral-300"
                  }`}
                  disabled={isLoading}
                  placeholder="Describe your handwoven product..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-700">
                    Price (₱) *
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className={`mt-1 ${errors.price ? "border-red-500" : ""}`}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-neutral-700">
                    Stock Quantity *
                  </label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    {...register("stock_quantity")}
                    className={`mt-1 ${errors.stock_quantity ? "border-red-500" : ""}`}
                    disabled={isLoading}
                    placeholder="0"
                  />
                  {errors.stock_quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700">
                  Category *
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 ${
                    errors.category ? "border-red-500" : "border-neutral-300"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  <option value="textiles">Textiles</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="home-decor">Home Decor</option>
                  <option value="bags">Bags</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="material" className="block text-sm font-medium text-neutral-700">
                    Material
                  </label>
                  <Input
                    id="material"
                    type="text"
                    {...register("material")}
                    className="mt-1"
                    disabled={isLoading}
                    placeholder="e.g., Cotton, Abaca"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-neutral-700">
                    Color
                  </label>
                  <Input
                    id="color"
                    type="text"
                    {...register("color")}
                    className="mt-1"
                    disabled={isLoading}
                    placeholder="e.g., Red, Blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tribe" className="block text-sm font-medium text-neutral-700">
                    Tribe/Origin
                  </label>
                  <Input
                    id="tribe"
                    type="text"
                    {...register("tribe")}
                    className="mt-1"
                    disabled={isLoading}
                    placeholder="e.g., T'boli, Yakan"
                  />
                </div>

                <div>
                  <label htmlFor="technique" className="block text-sm font-medium text-neutral-700">
                    Weaving Technique
                  </label>
                  <Input
                    id="technique"
                    type="text"
                    {...register("technique")}
                    className="mt-1"
                    disabled={isLoading}
                    placeholder="e.g., Backstrap, Ikat"
                  />
                </div>
              </div>

              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <p className="text-sm text-brand-700">
                  <strong>Note:</strong> Your product will be reviewed by our admin team before appearing in the shop. 
                  You'll be notified once it's approved or if any changes are needed.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/en/shop')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit for Approval"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


