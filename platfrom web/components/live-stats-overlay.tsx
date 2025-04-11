import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface LiveStatsOverlayProps {
  matchId: string
}

export default function LiveStatsOverlay({ matchId }: LiveStatsOverlayProps) {
  // Mock live stats data
  const liveStats = {
    possession: {
      home: 58,
      away: 42,
    },
    shots: {
      home: 15,
      away: 8,
    },
    shotsOnTarget: {
      home: 7,
      away: 3,
    },
    corners: {
      home: 6,
      away: 2,
    },
    fouls: {
      home: 10,
      away: 14,
    },
    yellowCards: {
      home: 2,
      away: 3,
    },
    redCards: {
      home: 0,
      away: 1,
    },
    passAccuracy: {
      home: 87,
      away: 79,
    },
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Stats</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="shape">Team Shape</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="pt-4 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{liveStats.possession.home}%</span>
                <span className="font-medium">Possession</span>
                <span>{liveStats.possession.away}%</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="bg-primary" style={{ width: `${liveStats.possession.home}%` }} />
                <div className="bg-destructive" style={{ width: `${liveStats.possession.away}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{liveStats.shots.home}</span>
                <span className="font-medium">Shots</span>
                <span>{liveStats.shots.away}</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="bg-primary"
                  style={{
                    width: `${(liveStats.shots.home / (liveStats.shots.home + liveStats.shots.away)) * 100}%`,
                  }}
                />
                <div
                  className="bg-destructive"
                  style={{
                    width: `${(liveStats.shots.away / (liveStats.shots.home + liveStats.shots.away)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{liveStats.shotsOnTarget.home}</span>
                <span className="font-medium">On Target</span>
                <span>{liveStats.shotsOnTarget.away}</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="bg-primary"
                  style={{
                    width: `${
                      (liveStats.shotsOnTarget.home / (liveStats.shotsOnTarget.home + liveStats.shotsOnTarget.away)) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="bg-destructive"
                  style={{
                    width: `${
                      (liveStats.shotsOnTarget.away / (liveStats.shotsOnTarget.home + liveStats.shotsOnTarget.away)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{liveStats.passAccuracy.home}%</span>
                <span className="font-medium">Pass Accuracy</span>
                <span>{liveStats.passAccuracy.away}%</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="bg-primary" style={{ width: `${liveStats.passAccuracy.home}%` }} />
                <div className="bg-destructive" style={{ width: `${liveStats.passAccuracy.away}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                <span className="text-xs">Yellow Cards</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
                    {liveStats.yellowCards.home}
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
                    {liveStats.yellowCards.away}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                <span className="text-xs">Red Cards</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="bg-red-500/20 text-red-500">
                    {liveStats.redCards.home}
                  </Badge>
                  <Badge variant="outline" className="bg-red-500/20 text-red-500">
                    {liveStats.redCards.away}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                <span className="text-xs">Corners</span>
                <div className="flex gap-1">
                  <Badge variant="outline">{liveStats.corners.home}</Badge>
                  <Badge variant="outline">{liveStats.corners.away}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                <span className="text-xs">Fouls</span>
                <div className="flex gap-1">
                  <Badge variant="outline">{liveStats.fouls.home}</Badge>
                  <Badge variant="outline">{liveStats.fouls.away}</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="pt-4">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-secondary/20 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Heatmap"
                  alt="Heatmap"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between">
                <Badge variant="outline">Al Ahly</Badge>
                <Badge variant="outline">Zamalek</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shape" className="pt-4">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-secondary/20 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400&text=Team+Shape"
                  alt="Team Shape"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs text-center text-muted-foreground">
                Al Ahly formation: 4-3-3 | Zamalek formation: 4-2-3-1
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
