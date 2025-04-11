import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Eye, LineChart, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface MatchCardProps {
  match: {
    id: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    date: string
    time: string
    league: string
    status: string
    hasHighlights: boolean
    hasReport: boolean
    views?: number
    goals?: number
  }
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative p-6 pb-4">
        <Badge
          className={
            match.status === "Live"
              ? "absolute top-4 right-4 bg-red-500"
              : match.status === "Upcoming"
                ? "absolute top-4 right-4 bg-blue-500"
                : "absolute top-4 right-4"
          }
        >
          {match.status}
        </Badge>
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-4">{match.league}</p>
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-2 relative overflow-hidden">
                {/* In a real app, you would use actual team logos */}
                <Image
                  src={`/placeholder.svg?height=48&width=48&text=${match.homeTeam.charAt(0)}`}
                  alt={match.homeTeam}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <p className="font-medium text-center">{match.homeTeam}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{match.status !== "Upcoming" ? match.homeScore : "-"}</span>
              <span className="text-xl text-muted-foreground">:</span>
              <span className="text-2xl font-bold">{match.status !== "Upcoming" ? match.awayScore : "-"}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-2 relative overflow-hidden">
                {/* In a real app, you would use actual team logos */}
                <Image
                  src={`/placeholder.svg?height=48&width=48&text=${match.awayTeam.charAt(0)}`}
                  alt={match.awayTeam}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <p className="font-medium text-center">{match.awayTeam}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} •{" "}
            {match.time}
          </div>
          {match.views && match.views > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              {match.views.toLocaleString()} views • {match.goals} goals
            </div>
          )}
        </div>
      </div>
      <CardFooter className="flex gap-2 bg-secondary/20 p-4">
        <Button asChild className="flex-1 gap-2">
          <Link href={`/match/${match.id}`}>
            <Eye className="h-4 w-4" /> Watch
          </Link>
        </Button>
        {match.hasHighlights && (
          <Button variant="outline" size="icon" asChild title="Highlights">
            <Link href={`/match/${match.id}/highlights`}>
              <Play className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {match.hasReport && (
          <Button variant="outline" size="icon" asChild title="Tactical Report">
            <Link href={`/match/${match.id}/report`}>
              <LineChart className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
