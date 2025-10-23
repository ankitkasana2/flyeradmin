"use client"

import { useState } from "react"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { LoginForm } from "@/components/auth/LoginForm"


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"super-admin" | "admin" | "designer">("admin")

  const handleLogin = (role: "super-admin" | "admin" | "designer") => {
    setUserRole(role)
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <AdminLayout userRole={userRole} onLogout={() => setIsAuthenticated(false)} />
}
