"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { getLocaleFromPathname, getTranslations, getLocalizedPathname } from "@/lib/i18n"
import { ProtectedRoute } from "@/components/auth/protected-route"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  role: z.enum(["user", "seller"], {
    required_error: "Please select an account type",
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and agreements to continue",
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const t = getTranslations(locale)
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser(data.name, data.email, data.password, data.password_confirmation, data.acceptTerms, data.role)
      toast.success("Registration successful! You are now logged in.")
      router.push(getLocalizedPathname("/", locale))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-neutral-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Or{" "}
              <Link
                href={getLocalizedPathname("/auth/login", locale)}
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Join us</CardTitle>
              <CardDescription>
                Create your account to start your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                    Full name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Account Type
                  </label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            field.value === "user"
                              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
                              : "border-neutral-300 hover:border-neutral-400"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="radio"
                            {...field}
                            value="user"
                            checked={field.value === "user"}
                            disabled={isLoading}
                            className="sr-only"
                          />
                          <svg
                            className="w-8 h-8 mb-2 text-neutral-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="font-medium text-sm">Customer</span>
                          <span className="text-xs text-neutral-500 mt-1 text-center">
                            Shop and support weavers
                          </span>
                        </label>

                        <label
                          className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            field.value === "seller"
                              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
                              : "border-neutral-300 hover:border-neutral-400"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="radio"
                            {...field}
                            value="seller"
                            checked={field.value === "seller"}
                            disabled={isLoading}
                            className="sr-only"
                          />
                          <svg
                            className="w-8 h-8 mb-2 text-neutral-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="font-medium text-sm">Seller</span>
                          <span className="text-xs text-neutral-500 mt-1 text-center">
                            Sell handwoven products
                          </span>
                        </label>
                      </div>
                    )}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register("password")}
                    className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-neutral-700">
                    Confirm password
                  </label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    {...register("password_confirmation")}
                    className={`mt-1 ${errors.password_confirmation ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <Controller
                    name="acceptTerms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="acceptTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        className="mt-1 flex-shrink-0"
                      />
                    )}
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm font-medium leading-relaxed cursor-pointer block"
                    >
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 underline inline"
                        onClick={() => {
                          // Open terms modal or navigate to terms page
                          window.open('/terms', '_blank');
                        }}
                      >
                        Terms and Agreements
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 underline inline"
                        onClick={() => {
                          // Open privacy policy modal or navigate to privacy page
                          window.open('/privacy', '_blank');
                        }}
                      >
                        Privacy Policy
                      </button>
                    </label>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      By creating an account, you agree to support CordiWeave's mission of preserving Filipino weaving traditions and understand that your data will be used to provide you with the best cultural experience.
                    </p>
                  </div>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}


