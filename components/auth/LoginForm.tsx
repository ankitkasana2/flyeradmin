"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface LoginFormProps {
  onLogin: (role: "super-admin" | "admin" | "designer") => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<
    "super-admin" | "admin" | "designer"
  >("admin")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin(selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Split Layout */}
      <div className="grid md:grid-cols-2 w-full max-w-5xl h-[600px] rounded-xl overflow-hidden shadow-2xl">

        {/* LEFT: Logo + Admin Panel (Logo on top, text below) */}
        <div className="bg-black flex flex-col items-center justify-center p-10 space-y-2">
          {/* Logo */}
          <div className="relative w-52 h-52">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Admin Panel Text – Directly Below */}
          <p className="text-white text-lg font-semibold tracking-wider">
            Admin Panel
          </p>
        </div>

        {/* RIGHT: Form */}
        <div className="bg-[#141414] flex items-center justify-center p-8 md:p-12">
          <Card className="w-full max-w-md bg-[#141414] border-0 shadow-none">
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold text-white">Sign In</h1>
                <p className="text-sm text-gray-400">
                  Enter your credentials to access the admin panel
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#333] border-0 text-white placeholder:text-gray-500 h-12 rounded-md focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#333] border-0 text-white placeholder:text-gray-500 h-12 rounded-md focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>

                {/* Role – FULLY VISIBLE & FUNCTIONAL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(e.target.value as "super-admin" | "admin" | "designer")
                    }
                    className="w-full px-4 py-3 bg-[#333] border-0 rounded-md text-white text-sm focus:ring-2 focus:ring-[#E50914] focus:outline-none"
                  >
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="designer">Designer</option>
                  </select>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-[#C40812] text-white font-bold h-12 text-lg rounded-md transition-all"
                  disabled={!email || !password}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}