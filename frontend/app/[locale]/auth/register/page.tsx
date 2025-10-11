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
import { useAuth } from "@/lib/auth-context"
import { getLocaleFromPathname, getTranslations, getLocalizedPathname } from "@/lib/i18n"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms and Agreements before proceeding" })
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
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const hasAgreed = watch("agreeTerms", false)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser(
        data.name,
        data.email,
        data.password,
        data.password_confirmation,
        true
      )
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
                {/* Optional: Quick preview link/modal for Terms */}
                {/* <p className="text-xs text-neutral-500 -mb-2">
                  Want to preview? <button type="button" className="underline text-brand-600">Open Terms</button>
                </p> */}
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

                <div>
                  <div className="flex items-start gap-3">
                    <Controller
                      name="agreeTerms"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          id="agreeTerms"
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          disabled={isLoading}
                        />
                      )}
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-neutral-700 select-none">
                      I agree to the {""}
                      <Link href={getLocalizedPathname("/terms", locale)} className="font-medium text-brand-600 hover:text-brand-500 underline" target="_blank">
                        Terms and Agreements
                      </Link>
                      .
                      {" "}
                      <Dialog>
                        <DialogTrigger className="ml-2 text-xs underline text-neutral-500 hover:text-neutral-700">Preview</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Terms and Agreements</DialogTitle>
                          </DialogHeader>
                          <div className="prose prose-sm max-h-[60vh] overflow-auto text-neutral-700">
                            <p>This is a quick preview. For the full text, visit the dedicated Terms page.</p>
                            <p>By creating an account, you agree to abide by our acceptable use, content, and purchase policies. You consent to processing of your data as described in our Privacy Policy.</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeTerms.message as string}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !hasAgreed}
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


