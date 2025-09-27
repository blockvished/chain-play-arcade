"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, Trophy, TrendingUp, Clock, DollarSign } from "lucide-react"

interface AdminStatsProps {
  totalTournaments: number
  activeTournaments: number
  totalPlayers: number
  totalPrizePool: string
  totalRevenue: string
  avgPlayersPerTournament: number
}

export function AdminStats({
  totalTournaments,
  activeTournaments,
  totalPlayers,
  totalPrizePool,
  totalRevenue,
  avgPlayersPerTournament,
}: AdminStatsProps) {
  const stats = [
    {
      title: "Total Tournaments",
      value: totalTournaments,
      change: "+12%",
      icon: Gamepad2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Tournaments",
      value: activeTournaments,
      change: `${activeTournaments}/${totalTournaments}`,
      icon: Clock,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Players",
      value: totalPlayers,
      change: "+23%",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Prize Pool",
      value: `${totalPrizePool} ETH`,
      change: "+8%",
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Platform Revenue",
      value: `${totalRevenue} ETH`,
      change: "+15%",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg Players/Tournament",
      value: Math.round(avgPlayersPerTournament),
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
