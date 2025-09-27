"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Gamepad2, Coins, TrendingUp } from "lucide-react"

interface StatsOverviewProps {
  totalTournaments: number
  activeTournaments: number
  totalPrizePool: string
  userWinnings: string
}

export function StatsOverview({
  totalTournaments,
  activeTournaments,
  totalPrizePool,
  userWinnings,
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Active Tournaments",
      value: activeTournaments,
      total: totalTournaments,
      icon: Gamepad2,
      color: "text-green-400",
    },
    {
      title: "Total Prize Pool",
      value: `${totalPrizePool} ETH`,
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      title: "Your Winnings",
      value: `${userWinnings} ETH`,
      icon: Coins,
      color: "text-blue-400",
    },
    {
      title: "Win Rate",
      value: "67%",
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
                {stat.total && <span className="text-sm text-muted-foreground ml-1">/ {stat.total}</span>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
