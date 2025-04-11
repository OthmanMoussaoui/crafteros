"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bookmark,
  Camera,
  ChevronDown,
  Download,
  Fullscreen,
  Globe,
  MessageSquare,
  Pause,
  Play,
  Share2,
  Subtitles,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import StatsPanel from "@/components/stats-panel"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import LiveStatsOverlay from "@/components/live-stats-overlay"
import HighlightsTimeline from "@/components/highlights-timeline"
import ChatReactions from "@/components/chat-reactions"

export default function MatchPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(45)
  const [volume, setVolume] = useState(80)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState("main")
  const [commentaryLanguage, setCommentaryLanguage] = useState("english")
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [isCommentaryEnabled, setIsCommentaryEnabled] = useState(true)
  const videoRef = useRef<HTMLDivElement>(null)

  // Mock match data
  const match = {
    id: params.id,
    homeTeam: "Al Ahly",
    awayTeam: "Zamalek",
    homeScore: 2,
    awayScore: 1,
    date: "2025-04-09",
    time: "18:00",
    league: "Egyptian Premier League",
    status: "Finished",
    hasHighlights: true,
    hasReport: true,
    stadium: "Cairo International Stadium",
    attendance: "60,000",
    referee: "Mohamed Ahmed",
    currentMinute: 45,
  }

  // Mock camera angles
  const cameraAngles = [
    { id: "main", name: "Main Camera" },
    { id: "tactical", name: "Tactical View" },
    { id: "behind-goal", name: "Behind Goal" },
    { id: "player-cam", name: "Player Cam" },
  ]

  // Mock timeline markers
  const timelineMarkers = [
    { time: 12, type: "goal", team: "home" },
    { time: 27, type: "yellow-card", team: "away" },
    { time: 38, type: "save", team: "away" },
    { time: 45, type: "goal", team: "away" },
    { time: 67, type: "goal", team: "home" },
    { time: 73, type: "red-card", team: "away" },
    { time: 85, type: "var", team: "neutral" },
  ]

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Bookmark current moment
  const bookmarkMoment = () => {
    // In a real app, this would create a clip starting 5s before and ending 5s after
    const clipStartTime = Math.max(0, progress - 5)
    const clipEndTime = Math.min(90, progress + 5)
    alert(`Clip bookmarked from ${clipStartTime}' to ${clipEndTime}'`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {match.homeTeam} vs {match.awayTeam}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span>{match.league}</span>
          <span>•</span>
          <span>{match.date}</span>
          <span>•</span>
          <span>{match.stadium}</span>
          <Badge variant={match.status === "Live" ? "destructive" : "secondary"}>{match.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {/* Video Player (3/4 width on desktop) */}
        <div className="lg:col-span-3">
          <div className="relative rounded-xl overflow-hidden bg-black" ref={videoRef}>
            <div className="relative aspect-video w-full">
              {/* Video element - different camera angles */}
              {selectedCamera === "main" && (
                <Image src="/placeholder.svg?height=720&width=1280" alt="Match video" fill className="object-cover" />
              )}
              {selectedCamera === "tactical" && (
                <Image
                  src="/placeholder.svg?height=720&width=1280&text=Tactical+View"
                  alt="Tactical view"
                  fill
                  className="object-cover"
                />
              )}
              {selectedCamera === "behind-goal" && (
                <Image
                  src="/placeholder.svg?height=720&width=1280&text=Behind+Goal"
                  alt="Behind goal view"
                  fill
                  className="object-cover"
                />
              )}
              {selectedCamera === "player-cam" && (
                <Image
                  src="/placeholder.svg?height=720&width=1280&text=Player+Cam"
                  alt="Player cam view"
                  fill
                  className="object-cover"
                />
              )}

              {/* Subtitles */}
              {showSubtitles && isCommentaryEnabled && (
                <div className="absolute bottom-20 left-0 right-0 text-center">
                  <div className="inline-block bg-black/70 px-4 py-2 rounded-md text-white">
                    {commentaryLanguage === "arabic"
                      ? "تمريرة رائعة من لاعب الأهلي"
                      : commentaryLanguage === "french"
                        ? "Passe magnifique du joueur d'Al Ahly"
                        : "Brilliant pass from the Al Ahly player"}
                  </div>
                </div>
              )}

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
              </div>

              {/* Camera Angle Selector - Top Left */}
              <div className="absolute top-4 left-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Camera className="h-4 w-4" />
                      {cameraAngles.find((cam) => cam.id === selectedCamera)?.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {cameraAngles.map((camera) => (
                      <DropdownMenuItem
                        key={camera.id}
                        onClick={() => setSelectedCamera(camera.id)}
                        className={selectedCamera === camera.id ? "bg-secondary" : ""}
                      >
                        {camera.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Commentary Controls - Top Right */}
              <div className="absolute top-4 right-4 flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsCommentaryEnabled(!isCommentaryEnabled)}
                      >
                        {isCommentaryEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isCommentaryEnabled ? "Disable Commentary" : "Enable Commentary"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="space-y-4">
                      <h4 className="font-medium">Commentary Settings</h4>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Language</h5>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={commentaryLanguage === "english" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCommentaryLanguage("english")}
                          >
                            English
                          </Button>
                          <Button
                            variant={commentaryLanguage === "arabic" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCommentaryLanguage("arabic")}
                          >
                            العربية
                          </Button>
                          <Button
                            variant={commentaryLanguage === "french" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCommentaryLanguage("french")}
                          >
                            Français
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="subtitles"
                          checked={showSubtitles}
                          onCheckedChange={setShowSubtitles}
                          disabled={!isCommentaryEnabled}
                        />
                        <Label htmlFor="subtitles">Show Subtitles</Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="secondary" size="icon" onClick={() => setShowStats(!showStats)}>
                        <Badge variant="outline" className="h-4 w-4 p-0 flex items-center justify-center">
                          S
                        </Badge>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{showStats ? "Hide Stats" : "Show Stats"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-2 mb-2">
                  {/* Timeline with markers */}
                  <div className="relative flex-1">
                    <Progress value={progress} className="h-2" />
                    {/* Timeline markers */}
                    {timelineMarkers.map((marker, index) => (
                      <div
                        key={index}
                        className={`absolute top-0 h-2 w-1 cursor-pointer ${
                          marker.type === "goal"
                            ? "bg-green-500"
                            : marker.type === "yellow-card"
                              ? "bg-yellow-500"
                              : marker.type === "red-card"
                                ? "bg-red-500"
                                : marker.type === "var"
                                  ? "bg-blue-500"
                                  : "bg-white"
                        }`}
                        style={{ left: `${(marker.time / 90) * 100}%` }}
                        title={`${marker.time}': ${marker.type.replace("-", " ")}`}
                        onClick={() => setProgress(marker.time)}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white">{progress}:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>

                    {/* Volume control */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60" side="top">
                        <div className="space-y-2">
                          <h4 className="font-medium">Volume</h4>
                          <Slider value={[volume]} max={100} step={1} onValueChange={(value) => setVolume(value[0])} />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setShowSubtitles(!showSubtitles)}
                    >
                      <Subtitles className="h-5 w-5" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={bookmarkMoment}
                      title="Bookmark this moment"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setShowChat(!showChat)}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Fullscreen className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Info Tabs */}
          <Tabs defaultValue="stats" className="mt-4">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="report">Tactical Report</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6">
              <StatsPanel matchId={params.id} />
            </TabsContent>

            <TabsContent value="highlights" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((highlight) => (
                  <Card key={highlight} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={`/placeholder.svg?height=180&width=320`}
                        alt={`Highlight ${highlight}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70"
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <Badge className="absolute top-2 right-2">
                        {highlight % 3 === 0 ? "Goal" : highlight % 2 === 0 ? "Save" : "Chance"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium">
                        {highlight % 2 === 0
                          ? `${match.homeTeam} chance at ${highlight * 10}'`
                          : `${match.awayTeam} chance at ${highlight * 10 + 5}'`}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">1st Half</Badge>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="report" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Match Summary</h2>
                      <p className="mb-4">
                        Al Ahly dominated possession (58%) and created more chances (15 shots, 7 on target) compared to
                        Zamalek (8 shots, 3 on target). The key difference was Al Ahly's efficiency in the final third,
                        with a higher xG (2.3 vs 0.9).
                      </p>
                      <p>
                        Zamalek struggled to contain Al Ahly's wing play, with 65% of attacks coming from the flanks.
                        The tactical shift in the second half by Al Ahly's coach to a more direct approach paid
                        dividends with the winning goal coming from a counter-attack.
                      </p>

                      <Separator className="my-6" />

                      <h3 className="text-xl font-bold mb-4">Key Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Possession</p>
                          <p className="text-2xl font-bold">58% - 42%</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Shots</p>
                          <p className="text-2xl font-bold">15 - 8</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Passes</p>
                          <p className="text-2xl font-bold">423 - 287</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">xG</p>
                          <p className="text-2xl font-bold">2.3 - 0.9</p>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button className="gap-2">
                          <Download className="h-4 w-4" /> Download Full Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Player Ratings</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Mohamed Salah", team: match.homeTeam, rating: 8.7 },
                          { name: "Ahmed Hassan", team: match.homeTeam, rating: 7.9 },
                          { name: "Mahmoud Kahraba", team: match.awayTeam, rating: 7.5 },
                          { name: "Omar Gaber", team: match.awayTeam, rating: 7.2 },
                          { name: "Hussein El Shahat", team: match.homeTeam, rating: 8.2 },
                        ].map((player) => (
                          <div key={player.name} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{player.name}</p>
                              <p className="text-sm text-muted-foreground">{player.team}</p>
                            </div>
                            <Badge variant={player.rating > 8 ? "default" : "secondary"}>{player.rating}</Badge>
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-4">
                        View All Players
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Heatmap</h3>
                      <div className="relative aspect-[4/3] bg-secondary/20 rounded-lg overflow-hidden mb-4">
                        <Image
                          src="/placeholder.svg?height=300&width=400"
                          alt="Heatmap"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Detailed Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Stats and Timeline */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* Live Stats Overlay */}
            {showStats && <LiveStatsOverlay matchId={params.id} />}

            {/* Highlights Timeline */}
            <HighlightsTimeline matchId={params.id} currentMinute={progress} onSeek={setProgress} />

            {/* Chat & Reactions */}
            {showChat && <ChatReactions matchId={params.id} />}
          </div>
        </div>
      </div>
    </div>
  )
}
