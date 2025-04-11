"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Download,
  FileJson,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Play,
  Star,
  Info,
  Maximize,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

export default function TacticalReportPage({ params }: { params: { id: string } }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState("home")

  // Mock match data
  const match = {
    id: params.id,
    homeTeam: "Al Ahly",
    awayTeam: "Zamalek",
    homeScore: 2,
    awayScore: 1,
    date: "2025-04-09",
    league: "Egyptian Premier League",
    stadium: "Cairo International Stadium",
    attendance: "60,000",
    referee: "Mohamed Ahmed",
    xG: {
      home: 2.3,
      away: 0.9,
    },
  }

  // Mock player data
  const players = {
    home: [
      { id: "p1", name: "Mohamed El-Shenawy", position: "GK", rating: 7.2 },
      { id: "p2", name: "Mohamed Hany", position: "RB", rating: 6.8 },
      { id: "p3", name: "Yasser Ibrahim", position: "CB", rating: 7.5 },
      { id: "p4", name: "Badr Benoun", position: "CB", rating: 7.3 },
      { id: "p5", name: "Ali Maaloul", position: "LB", rating: 8.1 },
      { id: "p6", name: "Amr El-Solia", position: "CM", rating: 7.7 },
      { id: "p7", name: "Aliou Dieng", position: "CDM", rating: 7.4 },
      { id: "p8", name: "Mohamed Magdy", position: "CAM", rating: 8.4 },
      { id: "p9", name: "Hussein El Shahat", position: "RW", rating: 8.7 },
      { id: "p10", name: "Percy Tau", position: "LW", rating: 8.2 },
      { id: "p11", name: "Mohamed Sherif", position: "ST", rating: 7.9 },
    ],
    away: [
      { id: "p12", name: "Mohamed Awad", position: "GK", rating: 7.8 },
      { id: "p13", name: "Hazem Emam", position: "RB", rating: 6.5 },
      { id: "p14", name: "Mahmoud Alaa", position: "CB", rating: 6.9 },
      { id: "p15", name: "Mohamed Abdel-Ghani", position: "CB", rating: 6.7 },
      { id: "p16", name: "Ahmed Fatouh", position: "LB", rating: 7.0 },
      { id: "p17", name: "Tarek Hamed", position: "CDM", rating: 7.6 },
      { id: "p18", name: "Ferjani Sassi", position: "CM", rating: 7.2 },
      { id: "p19", name: "Ahmed Sayed Zizo", position: "RW", rating: 7.9 },
      { id: "p20", name: "Youssef Obama", position: "CAM", rating: 6.8 },
      { id: "p21", name: "Achraf Bencharki", position: "LW", rating: 8.0 },
      { id: "p22", name: "Mostafa Mohamed", position: "ST", rating: 7.3 },
    ],
  }

  // Get top 3 players from both teams
  const topPlayers = [...players.home, ...players.away].sort((a, b) => b.rating - a.rating).slice(0, 3)

  // Mock key moments data
  const keyMoments = [
    {
      id: "km1",
      minute: 12,
      title: "Goal - Al Ahly",
      description:
        "Mohamed Sherif scores after a brilliant team move. The build-up involved 8 passes before the final shot.",
      player: "Mohamed Sherif",
      team: "Al Ahly",
      xG: 0.76,
      thumbnail: "/placeholder.svg?height=120&width=200&text=Goal",
    },
    {
      id: "km2",
      minute: 24,
      title: "Tactical Shift - Zamalek",
      description: "Zamalek changes formation from 4-2-3-1 to 4-3-3 to counter Al Ahly's dominance in midfield.",
      player: "",
      team: "Zamalek",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Tactical",
    },
    {
      id: "km3",
      minute: 45,
      title: "Goal - Zamalek",
      description: "Achraf Bencharki equalizes with a header from a corner. Poor marking from Al Ahly's defense.",
      player: "Achraf Bencharki",
      team: "Zamalek",
      xG: 0.32,
      thumbnail: "/placeholder.svg?height=120&width=200&text=Goal",
    },
    {
      id: "km4",
      minute: 58,
      title: "Missed Opportunity - Zamalek",
      description: "Mostafa Mohamed misses a clear chance after a defensive error. Very high xG chance wasted.",
      player: "Mostafa Mohamed",
      team: "Zamalek",
      xG: 0.85,
      thumbnail: "/placeholder.svg?height=120&width=200&text=Miss",
    },
    {
      id: "km5",
      minute: 67,
      title: "Goal - Al Ahly",
      description:
        "Hussein El Shahat scores the winner with a powerful shot from outside the box. Low xG but exceptional finish.",
      player: "Hussein El Shahat",
      team: "Al Ahly",
      xG: 0.12,
      thumbnail: "/placeholder.svg?height=120&width=200&text=Goal",
    },
    {
      id: "km6",
      minute: 73,
      title: "Red Card - Zamalek",
      description: "Tarek Hamed receives a straight red card for a dangerous tackle. Numerical advantage for Al Ahly.",
      player: "Tarek Hamed",
      team: "Zamalek",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Red+Card",
    },
  ]

  // Mock team stats
  const teamStats = {
    possession: { home: 58, away: 42 },
    shots: { home: 15, away: 8 },
    shotsOnTarget: { home: 7, away: 3 },
    passes: { home: 423, away: 287 },
    passAccuracy: { home: 87, away: 79 },
    corners: { home: 6, away: 2 },
    fouls: { home: 10, away: 14 },
    offsides: { home: 3, away: 2 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 1 },
  }

  // Mock tactical summary
  const tacticalSummary = `
    Al Ahly dominated this match with a possession-based approach, utilizing width effectively and creating overloads in the final third. Their 4-3-3 formation allowed for fluid movement between the lines, with Hussein El Shahat particularly effective drifting inside from the right wing.

    Zamalek started with a defensive 4-2-3-1 setup, focusing on counter-attacks and set pieces. Their mid-game tactical shift to a 4-3-3 temporarily disrupted Al Ahly's rhythm, leading to their equalizer. However, they struggled to maintain possession against Al Ahly's aggressive pressing.

    The turning point came at 73' with Tarek Hamed's red card, which forced Zamalek into a defensive shell. Al Ahly exploited the numerical advantage by stretching the play and creating more chances in the final minutes.

    Key tactical insights:
    - Al Ahly's fullbacks provided width, allowing wingers to move inside
    - Zamalek's compact defensive block was effective until the red card
    - Al Ahly's pressing regained possession in dangerous areas
    - Zamalek's set-piece strategy yielded their only goal
  `

  // Handle download
  const handleDownload = (format: string) => {
    toast({
      title: `Downloading ${format.toUpperCase()} report`,
      description: `Your tactical report is being prepared for download.`,
    })
    // In a real app, this would trigger the actual download
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-ultramarine font-display">Tactical Analysis Report</h1>
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span>
            {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
          </span>
          <span>•</span>
          <span>{match.league}</span>
          <span>•</span>
          <span>{match.date}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Match Summary Panel */}
        <Card className="lg:col-span-1 border-periwinkle shadow-md">
          <CardHeader className="bg-ultramarine text-white rounded-t-lg">
            <CardTitle>Match Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-between w-full mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-periwinkle rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="font-bold text-2xl text-ultramarine">{match.homeTeam.charAt(0)}</span>
                  </div>
                  <p className="font-medium">{match.homeTeam}</p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold mb-1 text-ultramarine">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  <Badge variant="outline" className="border-ultramarine text-ultramarine">
                    Full Time
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-periwinkle rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="font-bold text-2xl text-ultramarine">{match.awayTeam.charAt(0)}</span>
                  </div>
                  <p className="font-medium">{match.awayTeam}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* xG Comparison */}
              <div>
                <h3 className="font-medium mb-2 text-ultramarine">Expected Goals (xG)</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{match.homeTeam}</span>
                      <span>{match.xG.home.toFixed(1)} xG</span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="bg-ultramarine"
                        style={{ width: `${(match.xG.home / (match.xG.home + match.xG.away)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{match.awayTeam}</span>
                      <span>{match.xG.away.toFixed(1)} xG</span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="bg-violet-blue"
                        style={{ width: `${(match.xG.away / (match.xG.home + match.xG.away)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-periwinkle/50" />

              {/* Top 3 Players */}
              <div>
                <h3 className="font-medium mb-3 text-ultramarine">Top Performers</h3>
                <div className="space-y-3">
                  {topPlayers.map((player, index) => (
                    <div key={player.id} className="flex items-center gap-3 bg-periwinkle/20 p-3 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-ultramarine/20 text-ultramarine">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-ultramarine text-ultramarine">
                            {player.position}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {players.home.some((p) => p.id === player.id) ? match.homeTeam : match.awayTeam}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-ultramarine">{player.rating.toFixed(1)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-periwinkle/50" />

              {/* Key Stats */}
              <div>
                <h3 className="font-medium mb-3 text-ultramarine">Key Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-periwinkle/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Possession</p>
                    <p className="text-xl font-bold text-ultramarine">
                      {teamStats.possession.home}% - {teamStats.possession.away}%
                    </p>
                  </div>
                  <div className="bg-periwinkle/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Shots</p>
                    <p className="text-xl font-bold text-ultramarine">
                      {teamStats.shots.home} - {teamStats.shots.away}
                    </p>
                  </div>
                  <div className="bg-periwinkle/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Pass Accuracy</p>
                    <p className="text-xl font-bold text-ultramarine">
                      {teamStats.passAccuracy.home}% - {teamStats.passAccuracy.away}%
                    </p>
                  </div>
                  <div className="bg-periwinkle/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Cards</p>
                    <p className="text-xl font-bold text-ultramarine">
                      {teamStats.yellowCards.home + teamStats.redCards.home} -{" "}
                      {teamStats.yellowCards.away + teamStats.redCards.away}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Maps and Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tactical Maps Tabs */}
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle>Tactical Maps</CardTitle>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="bg-white text-ultramarine hover:bg-periwinkle">
                        {selectedTeam === "home" ? match.homeTeam : match.awayTeam}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTeam("home")}>{match.homeTeam}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedTeam("away")}>{match.awayTeam}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="bg-white text-ultramarine hover:bg-periwinkle">
                        {selectedPlayer
                          ? players[selectedTeam as "home" | "away"].find((p) => p.id === selectedPlayer)?.name ||
                            "All Players"
                          : "All Players"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedPlayer(null)}>All Players</DropdownMenuItem>
                      <Separator className="my-1" />
                      {players[selectedTeam as "home" | "away"].map((player) => (
                        <DropdownMenuItem key={player.id} onClick={() => setSelectedPlayer(player.id)}>
                          {player.name} ({player.position})
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="heatmap">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6">
                  <TabsTrigger
                    value="heatmap"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-ultramarine data-[state=active]:text-ultramarine"
                  >
                    Heatmap
                  </TabsTrigger>
                  <TabsTrigger
                    value="pass-map"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-ultramarine data-[state=active]:text-ultramarine"
                  >
                    Pass Map
                  </TabsTrigger>
                  <TabsTrigger
                    value="shots-map"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-ultramarine data-[state=active]:text-ultramarine"
                  >
                    Shots Map
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="heatmap" className="p-6">
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] bg-periwinkle/20 rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=540&width=960&text=Heatmap+${
                          selectedPlayer
                            ? players[selectedTeam as "home" | "away"].find((p) => p.id === selectedPlayer)?.name
                            : selectedTeam === "home"
                              ? match.homeTeam
                              : match.awayTeam
                        }`}
                        alt="Heatmap"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 text-ultramarine hover:bg-white"
                        title="Fullscreen"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {selectedPlayer
                        ? `Movement heatmap for ${
                            players[selectedTeam as "home" | "away"].find((p) => p.id === selectedPlayer)?.name
                          }`
                        : `Team movement heatmap for ${selectedTeam === "home" ? match.homeTeam : match.awayTeam}`}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="pass-map" className="p-6">
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] bg-periwinkle/20 rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=540&width=960&text=Pass+Map+${
                          selectedPlayer
                            ? players[selectedTeam as "home" | "away"].find((p) => p.id === selectedPlayer)?.name
                            : selectedTeam === "home"
                              ? match.homeTeam
                              : match.awayTeam
                        }`}
                        alt="Pass Map"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 text-ultramarine hover:bg-white"
                        title="Fullscreen"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {selectedPlayer
                          ? `Pass map for ${
                              players[selectedTeam as "home" | "away"].find((p) => p.id === selectedPlayer)?.name
                            }`
                          : `Team pass map for ${selectedTeam === "home" ? match.homeTeam : match.awayTeam}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs">Successful</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs">Failed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shots-map" className="p-6">
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] bg-periwinkle/20 rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=540&width=960&text=Shots+Map+${
                          selectedTeam === "home" ? match.homeTeam : match.awayTeam
                        }`}
                        alt="Shots Map"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 text-ultramarine hover:bg-white"
                        title="Fullscreen"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Shot map with xG values for {selectedTeam === "home" ? match.homeTeam : match.awayTeam}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs">Goal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">On Target</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs">Off Target</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Tactical Summary */}
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <CardTitle>AI Tactical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-periwinkle/10 p-4 rounded-lg border border-periwinkle/30">
                  <p className="whitespace-pre-line text-sm">{tacticalSummary}</p>
                </div>
                <div className="flex justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                        >
                          <Info className="h-4 w-4 mr-2" /> Analysis Methodology
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-4 bg-white border-periwinkle">
                        <p className="text-sm">
                          This analysis is generated using our proprietary AI model that processes over 3,000 data
                          points per match, including player positioning, pass trajectories, and pressure metrics.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Moments Timeline */}
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <CardTitle>Key Moments Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative border-l border-dashed border-periwinkle pl-6 pb-4">
                  {keyMoments.map((moment, index) => (
                    <div key={moment.id} className="mb-6 relative">
                      {/* Timeline dot */}
                      <div
                        className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 ${
                          moment.title.includes("Goal")
                            ? "bg-green-500"
                            : moment.title.includes("Red Card")
                              ? "bg-red-500"
                              : moment.title.includes("Tactical")
                                ? "bg-violet-blue"
                                : "bg-yellow-500"
                        }`}
                      />

                      {/* Minute marker */}
                      <div className="absolute -left-[30px] top-0 text-sm font-medium text-ultramarine">
                        {moment.minute}'
                      </div>

                      {/* Moment card */}
                      <div className="bg-periwinkle/20 rounded-lg overflow-hidden border border-periwinkle/30">
                        <div className="flex">
                          <div className="relative w-[120px] h-[80px] flex-shrink-0">
                            <Image
                              src={moment.thumbnail || "/placeholder.svg"}
                              alt={moment.title}
                              fill
                              className="object-cover"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-ultramarine/70 hover:bg-ultramarine text-white"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <Badge
                                className={
                                  moment.title.includes("Goal")
                                    ? "bg-green-500"
                                    : moment.title.includes("Red Card")
                                      ? "bg-red-500"
                                      : moment.title.includes("Tactical")
                                        ? "bg-violet-blue"
                                        : "bg-yellow-500"
                                }
                              >
                                {moment.title}
                              </Badge>
                              {moment.xG && (
                                <Badge variant="outline" className="ml-2 border-ultramarine text-ultramarine">
                                  xG: {moment.xG.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{moment.description}</p>
                            {moment.player && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {moment.player} ({moment.team})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Download Options */}
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <CardTitle>Download Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button className="gap-2 bg-ultramarine hover:bg-ultramarine/90" onClick={() => handleDownload("pdf")}>
                  <FilePdf className="h-4 w-4" /> PDF Report
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                  onClick={() => handleDownload("csv")}
                >
                  <FileSpreadsheet className="h-4 w-4" /> CSV Data
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                  onClick={() => handleDownload("json")}
                >
                  <FileJson className="h-4 w-4" /> JSON Data
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                    >
                      <Download className="h-4 w-4" /> More Options <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-ultramarine">Additional Formats</p>
                      <div className="grid gap-2">
                        <Button
                          variant="ghost"
                          className="justify-start gap-2 hover:text-ultramarine hover:bg-periwinkle/20"
                          onClick={() => handleDownload("pptx")}
                        >
                          <ArrowRight className="h-4 w-4" /> PowerPoint Presentation
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start gap-2 hover:text-ultramarine hover:bg-periwinkle/20"
                          onClick={() => handleDownload("xlsx")}
                        >
                          <ArrowRight className="h-4 w-4" /> Excel Workbook
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start gap-2 hover:text-ultramarine hover:bg-periwinkle/20"
                          onClick={() => handleDownload("api")}
                        >
                          <ArrowRight className="h-4 w-4" /> API Documentation
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
