"use client"

import { Navigation } from "@/components/navigation"

export default function Dashboard() {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to ChainPlay Arcade</h1>
        </div>
      </main>
    </div>
  )
}
