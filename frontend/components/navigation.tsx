"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/hooks/use-admin"
import { WalletConnect } from "./wallet-connect"
import { Gamepad2, Trophy, BarChart3, Settings, Home, Shield } from "lucide-react"

const playerNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  // { href: "/tournaments", label: "Tournaments", icon: Gamepad2 },
]

const adminNavItems = [
  { href: "/admin", label: "Admin Dashboard", icon: Shield },
  // { href: "/admin/tournaments", label: "Manage Tournaments", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAdmin } = useAdmin()

  return (  
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">ChainPlay Arcade</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              {playerNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
 {isAdmin && (
                <>
                  <div className="w-px h-6 bg-border" />
                  {adminNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-destructive text-destructive-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </>
              )}
            </div>
          </div>

          <WalletConnect />
        </div>
      </div>
    </nav>
  )
}
