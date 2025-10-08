"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { authenticateUser, setAuthCookies } from "@/lib/auth"
import { CredentialsInfo } from "@/components/credentials-info"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !pin) {
      setError("Please enter both email and PIN")
      setIsLoading(false)
      return
    }

    const user = authenticateUser(email, pin)

    if (!user) {
      setError("Invalid credentials. Please try again.")
      setIsLoading(false)
      return
    }

    // Set auth cookies
    setAuthCookies(user)

    // Redirect based on role
    const roleRoutes: Record<string, string> = {
      admin: "/admin",
      manager: "/admin",
      waiter: "/waiter",
      kitchen: "/kitchen",
      reception: "/receptionist",
      guest: "/qr-order/1",
    }

    const redirectPath = roleRoutes[user.role] || "/"

    // Use window.location for more reliable navigation
    window.location.href = redirectPath
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/")} className="gap-2 text-xs sm:text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to POS
        </Button>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Maria Havens Logo"
            width={250}
            height={150}
            className="object-contain sm:w-[300px]"
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Card */}
          <Card className="border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Staff Login</CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@mariahavens.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-xs sm:text-sm"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-xs sm:text-sm">
                    PIN
                  </Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    className="bg-background text-xs sm:text-sm"
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-xs sm:text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Credentials Info */}
          <CredentialsInfo />
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground">Maria Havens - Homes & Restaurant</p>
      </div>
    </div>
  )
}
