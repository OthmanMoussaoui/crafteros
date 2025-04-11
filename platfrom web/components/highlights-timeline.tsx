"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { BellIcon as Ball, Flag, Shirt, User, Video } from "lucide-react"

interface HighlightsTimelineProps {
  matchId: string
  currentMinute: number
  onSeek: (minute: number) => void
}

export default function HighlightsTimeline({ matchId, currentMinute, onSeek }: HighlightsTimelineProps) {
  // Mock highlights data
  const highlights = [
    {
      minute: 12,
      type: "goal",
      team: "home",
      player: "Mohamed Salah",
      description: "Goal! Al Ahly 1-0 Zamalek",
      teamName: "Al Ahly",
    },
    {
      minute: 27,
      type: "yellow-card",
      team: "away",
      player: "Mahmoud Kahraba",
      description: "Yellow card for Kahraba",
      teamName: "Zamalek",
    },
    {
      minute: 38,
      type: "save",
      team: "away",
      player: "Mohamed Awad",
      description: "Great save by Awad!",
      teamName: "Zamalek",
    },
    {
      minute: 45,
      type: "goal",
      team: "away",
      player: "Achraf Bencharki",
      description: "Goal! Al Ahly 1-1 Zamalek",
      teamName: "Zamalek",
    },
    {
      minute: 52,
      type: "substitution",
      team: "home",
      player: "Hussein El Shahat",
      description: "Substitution for Al Ahly",
      teamName: "Al Ahly",
    },
    {
      minute: 67,
      type: "goal",
      team: "home",
      player: "Percy Tau",
      description: "Goal! Al Ahly 2-1 Zamalek",
      teamName: "Al Ahly",
    },
    {
      minute: 73,
      type: "red-card",
      team: "away",
      player: "Tarek Hamed",
      description: "Red card for Hamed!",
      teamName: "Zamalek",
    },
    {
      minute: 85,
      type: "var",
      team: "neutral",
      player: "",
      description: "VAR check for possible penalty",
      teamName: "",
    },
  ]

  // Get icon based on highlight type
  const getHighlightIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Ball className="h-4 w-4" />
      case "yellow-card":
      case "red-card":
        return <Flag className="h-4 w-4" />
      case "save":
        return <User className="h-4 w-4" />
      case "substitution":
        return <Shirt className="h-4 w-4" />
      case "var":
        return <Video className="h-4 w-4" />
      default:
        return <Ball className="h-4 w-4" />
    }
  }

  // Get badge color based on highlight type
  const getHighlightBadgeColor = (type: string) => {
    switch (type) {
      case "goal":
        return "bg-green-500"
      case "yellow-card":
        return "bg-yellow-500"
      case "red-card":
        return "bg-red-500"
      case "save":
        return "bg-blue-500"
      case "substitution":
        return "bg-purple-500"
      case "var":
        return "bg-orange-500"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Match Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative border-l border-dashed border-muted-foreground/50 pl-4 pb-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`mb-4 relative ${currentMinute >= highlight.minute ? "opacity-100" : "opacity-60"}`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute w-3 h-3 rounded-full -left-[22px] top-1.5 ${getHighlightBadgeColor(
                    highlight.type,
                  )}`}
                />

                {/* Highlight card */}
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <Badge className={`${getHighlightBadgeColor(highlight.type)} flex items-center gap-1`}>
                      {getHighlightIcon(highlight.type)}
                      {highlight.type.replace("-", " ")}
                    </Badge>
                    <Badge variant="outline">{highlight.minute}'</Badge>
                  </div>
                  <p className="text-sm font-medium">{highlight.description}</p>
                  {highlight.player && (
                    <p className="text-xs text-muted-foreground">
                      {highlight.player} ({highlight.teamName})
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-xs"
                    onClick={() => onSeek(highlight.minute)}
                  >
                    Jump to moment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
