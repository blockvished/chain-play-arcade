"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Save } from "lucide-react"
import { format } from "date-fns"
import type { Tournament } from "@/lib/store"

interface TournamentFormProps {
  onSubmit: (tournament: Omit<Tournament, "id" | "currentPlayers">) => void
  onCancel: () => void
  initialData?: Tournament
  isEditing?: boolean
}

export function TournamentForm({ onSubmit, onCancel, initialData, isEditing = false }: TournamentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gameType: initialData?.gameType || ("tic-tac-toe" as Tournament["gameType"]),
    entryFee: initialData?.entryFee || "",
    prizePool: initialData?.prizePool || "",
    duration: initialData?.duration || 6,
    maxPlayers: initialData?.maxPlayers || 100,
    status: initialData?.status || ("upcoming" as Tournament["status"]),
    startTime: initialData?.startTime || new Date(),
    rules: initialData?.rules || "",
    difficulty: initialData?.difficulty || ("medium" as Tournament["difficulty"]),
  })

  const [startDate, setStartDate] = useState<Date | undefined>(formData.startTime)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const endTime = new Date(formData.startTime)
    endTime.setHours(endTime.getHours() + formData.duration)

    onSubmit({
      ...formData,
      startTime: formData.startTime,
      endTime,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const gameTypeOptions = [
    { value: "tic-tac-toe", label: "Tic-Tac-Toe" },
    { value: "simon-says", label: "Simon Says" },
    { value: "memory-match", label: "Memory Match" },
    { value: "number-guess", label: "Number Guess" },
  ]

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "bg-green-500/20 text-green-400" },
    { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
    { value: "hard", label: "Hard", color: "bg-red-500/20 text-red-400" },
  ]

  const statusOptions = [
    { value: "upcoming", label: "Upcoming", color: "bg-blue-500/20 text-blue-400" },
    { value: "active", label: "Active", color: "bg-green-500/20 text-green-400" },
    { value: "ended", label: "Ended", color: "bg-gray-500/20 text-gray-400" },
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isEditing ? <Save className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
          {isEditing ? "Edit Tournament" : "Create New Tournament"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter tournament name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <Select value={formData.gameType} onValueChange={(value) => handleInputChange("gameType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select game type" />
                </SelectTrigger>
                <SelectContent>
                  {gameTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (ETH)</Label>
              <Input
                id="entryFee"
                type="number"
                step="0.001"
                value={formData.entryFee}
                onChange={(e) => handleInputChange("entryFee", e.target.value)}
                placeholder="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool (ETH)</Label>
              <Input
                id="prizePool"
                type="number"
                step="0.001"
                value={formData.prizePool}
                onChange={(e) => handleInputChange("prizePool", e.target.value)}
                placeholder="1.0"
                required
              />
            </div>
          </div>

          {/* Tournament Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="168"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="2"
                max="1000"
                value={formData.maxPlayers}
                onChange={(e) => handleInputChange("maxPlayers", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={option.color} variant="secondary">
                          {option.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Start Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={option.color} variant="outline">
                          {option.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      if (date) {
                        handleInputChange("startTime", date)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <Label htmlFor="rules">Tournament Rules</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => handleInputChange("rules", e.target.value)}
              placeholder="Enter tournament rules and scoring details..."
              rows={3}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 game-glow">
              {isEditing ? "Update Tournament" : "Create Tournament"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
