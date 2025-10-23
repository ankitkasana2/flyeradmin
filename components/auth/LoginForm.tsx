"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormProps {
  onLogin: (role: "super-admin" | "admin" | "designer") => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<"super-admin" | "admin" | "designer">("admin")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin(selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E50914] text-white rounded flex items-center justify-center font-bold">N</div>
            <span className="text-xl font-bold text-foreground">Admin Panel</span>
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm"
              >
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="designer">Designer</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#E50914] text-white hover:bg-[#C40812] font-semibold"
              disabled={!email || !password}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-3 bg-secondary rounded text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: any value</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
