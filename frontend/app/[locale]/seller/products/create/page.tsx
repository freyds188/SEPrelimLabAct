"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Upload, Package, ArrowLeft, Save } from "lucide-react"

const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  stock_quantity: z.string().min(1, "Stock quantity is required"),
  category: z.string().min(1, "Category is required"),
  material: z.string().optional(),
  color: z.string().optional(),
  tribe: z.string().optional(),
  technique: z.string().optional(),
  care_instructions: z.string().optional(),
  specifications: z.string().optional(),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
  })

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [uploadedImages])

  // Redirect if not a seller
  useEffect(() => {
    if (user && user.role !== 'seller') {
      router.push('/en/shop')
    }
  }, [user, router])

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  // Redirect if not a seller
  if (user && user.role !== 'seller') {
    return null
  }

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      const uploadedUrls: string[] = []
      
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`)
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`)
          continue
        }

        // For now, use local file URLs for immediate display
        const localUrl = URL.createObjectURL(file)
        uploadedUrls.push(localUrl)
        
        console.log('Created local URL for:', file.name, localUrl)
      }

      if (uploadedUrls.length > 0) {
        setUploadedImages(prev => [...prev, ...uploadedUrls])
        
        // Set first uploaded image as main image if none is selected
        if (mainImageIndex === null) {
          setMainImageIndex(0)
        }

        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const imageToRemove = prev[index]
      
      // Revoke the object URL to free memory
      if (imageToRemove && imageToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove)
      }
      
      const newImages = prev.filter((_, i) => i !== index)
      
      // Adjust main image index if needed
      if (mainImageIndex === index) {
        setMainImageIndex(newImages.length > 0 ? 0 : null)
      } else if (mainImageIndex !== null && mainImageIndex > index) {
        setMainImageIndex(mainImageIndex - 1)
      }
      
      return newImages
    })
  }

  // Set main image
  const setMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Create a fake event object for the existing handler
      const fakeEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>
      handleImageUpload(fakeEvent)
    }
  }

  const onSubmit = async (data: CreateProductFormData) => {
    console.log('Form submission started with data:', data)
    console.log('isDraft:', isDraft)
    console.log('uploadedImages:', uploadedImages)
    console.log('mainImageIndex:', mainImageIndex)
    
    setIsLoading(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
      const token = localStorage.getItem('auth_token')
      
      console.log('API_BASE_URL:', API_BASE_URL)
      console.log('Token exists:', !!token)

      const requestBody = {
        ...data,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
        status: isDraft ? 'draft' : 'pending',
        // For now, skip images since we're using blob URLs
        // TODO: Implement proper image upload to server
        images: [], // Empty array for now
        main_image: null, // No main image for now
      }
      
      console.log('Request body:', requestBody)

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const result = await response.json()
      console.log('Response result:', result)

      if (result.success) {
        toast.success(isDraft ? 'Product saved as draft!' : 'Product submitted for approval!')
        router.push('/seller/products')
      } else {
        toast.error(result.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/seller/products')}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
                  <p className="text-gray-600">Add a new handwoven product to your store</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDraft(true)
                  handleSubmit(onSubmit)()
                }}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                form="product-form"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Submit for Approval'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <form id="product-form" onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log('Form validation errors:', errors)
                toast.error('Please fix the form errors before submitting')
              })} className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide essential details about your product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Product Name *
                      </label>
                      <Input
                        {...register('name')}
                        id="name"
                        className="mt-1"
                        placeholder="e.g., Traditional Ikat Textile"
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        {...register('description')}
                        id="description"
                        rows={4}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                        disabled={isLoading}
                        placeholder="Describe your handwoven product, its unique features, and craftsmanship..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price (₱) *
                        </label>
                        <Input
                          {...register('price')}
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          className="mt-1"
                          placeholder="0.00"
                          disabled={isLoading}
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                          Stock Quantity *
                        </label>
                        <Input
                          {...register('stock_quantity')}
                          id="stock_quantity"
                          type="number"
                          min="0"
                          className="mt-1"
                          placeholder="0"
                          disabled={isLoading}
                        />
                        {errors.stock_quantity && (
                          <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category & Classification */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category & Classification</CardTitle>
                    <CardDescription>Help customers find your product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <select
                        {...register('category')}
                        id="category"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                        disabled={isLoading}
                      >
                        <option value="">Select a category</option>
                        <option value="textiles">Textiles</option>
                        <option value="baskets">Baskets</option>
                        <option value="accessories">Accessories</option>
                        <option value="home-decor">Home Decor</option>
                        <option value="clothing">Clothing</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                          Material
                        </label>
                        <Input
                          {...register('material')}
                          id="material"
                          className="mt-1"
                          placeholder="e.g., Cotton, Abaca, Rattan"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <Input
                          {...register('color')}
                          id="color"
                          className="mt-1"
                          placeholder="e.g., Red, Blue, Natural"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tribe" className="block text-sm font-medium text-gray-700">
                          Tribe/Origin
                        </label>
                        <Input
                          {...register('tribe')}
                          id="tribe"
                          className="mt-1"
                          placeholder="e.g., T'boli, Yakan, Ibaloi"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="technique" className="block text-sm font-medium text-gray-700">
                          Weaving Technique
                        </label>
                        <Input
                          {...register('technique')}
                          id="technique"
                          className="mt-1"
                          placeholder="e.g., Backstrap, Ikat, Twining"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                    <CardDescription>Provide helpful information for customers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="care_instructions" className="block text-sm font-medium text-gray-700">
                        Care Instructions
                      </label>
                      <textarea
                        {...register('care_instructions')}
                        id="care_instructions"
                        rows={3}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                        disabled={isLoading}
                        placeholder="How should customers care for this product?"
                      />
                    </div>

                    <div>
                      <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                        Specifications
                      </label>
                      <textarea
                        {...register('specifications')}
                        id="specifications"
                        rows={3}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                        disabled={isLoading}
                        placeholder="Dimensions, weight, or other specifications..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Image Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Upload images to showcase your product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Upload Area */}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-brand-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {isUploading ? 'Uploading images...' : 'Upload product images'}
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              PNG, JPG, GIF up to 5MB each
                            </span>
                            <span className="mt-1 block text-xs text-gray-400">
                              or drag and drop files here
                            </span>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Uploaded Images ({uploadedImages.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {uploadedImages.map((imageUrl, index) => {
                            console.log(`Rendering image ${index}:`, imageUrl)
                            return (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={imageUrl}
                                  alt={`Product image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.log('Image failed to load:', imageUrl)
                                    // Show a placeholder instead of hiding
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
                                  }}
                                  onLoad={() => {
                                    console.log('Image loaded successfully:', imageUrl)
                                  }}
                                />
                              </div>
                              
                              {/* Main image indicator */}
                              {mainImageIndex === index && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                  Main
                                </div>
                              )}
                              
                              {/* Action buttons */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex space-x-1">
                                  {mainImageIndex !== index && (
                                    <button
                                      type="button"
                                      onClick={() => setMainImage(index)}
                                      className="bg-blue-600 text-white p-1 rounded text-xs"
                                      title="Set as main image"
                                    >
                                      ⭐
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="bg-red-600 text-white p-1 rounded text-xs"
                                    title="Remove image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          )})}
                        </div>
                        
                        {uploadedImages.length > 1 && (
                          <p className="text-sm text-gray-500">
                            Click the star icon to set the main product image. This will be the primary image shown in your product listing.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submission Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Review
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Products are typically reviewed within 24-48 hours.
                  </p>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Better Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use clear, descriptive product names</li>
                    <li>• Include detailed descriptions of materials and techniques</li>
                    <li>• Set competitive but fair pricing</li>
                    <li>• Provide accurate stock quantities</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {mainImageIndex !== null && uploadedImages[mainImageIndex] ? (
                        <img
                          src={uploadedImages[mainImageIndex]}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Preview image failed to load:', uploadedImages[mainImageIndex])
                            // Show a placeholder instead of hiding
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
                          }}
                          onLoad={() => {
                            console.log('Preview image loaded successfully:', uploadedImages[mainImageIndex])
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {watch('name') || 'Product Name'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {watch('category') || 'Category'}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₱{watch('price') || '0.00'}
                      </p>
                      {uploadedImages.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}