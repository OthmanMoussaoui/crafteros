"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Check,
  ChevronDown,
  Clock,
  Download,
  Facebook,
  Link,
  Play,
  Plus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Twitter,
  Video,
  PhoneIcon as WhatsApp,
  X,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function HighlightsPage({ params }: { params: { id: string } }) {
  const [selectedClips, setSelectedClips] = useState<string[]>([])
  const [filterPlayer, setFilterPlayer] = useState<string | null>(null)
  const [isCreatingReel, setIsCreatingReel] = useState(false)
  const [reelName, setReelName] = useState("")
  const [includeCommentary, setIncludeCommentary] = useState(true)
  const [selectedClipsData, setSelectedClipsData] = useState<any[]>([])

  // Mock match data
  const match = {
    id: params.id,
    homeTeam: "Al Ahly",
    awayTeam: "Zamalek",
    homeScore: 2,
    awayScore: 1,
    date: "2025-04-09",
    league: "Egyptian Premier League",
  }

  // Mock players data
  const players = [
    { id: "p1", name: "Mohamed Salah", team: match.homeTeam },
    { id: "p2", name: "Hussein El Shahat", team: match.homeTeam },
    { id: "p3", name: "Percy Tau", team: match.homeTeam },
    { id: "p4", name: "Achraf Bencharki", team: match.awayTeam },
    { id: "p5", name: "Mahmoud Kahraba", team: match.awayTeam },
    { id: "p6", name: "Tarek Hamed", team: match.awayTeam },
  ]

  // Mock highlights data
  const highlights = [
    {
      id: "h1",
      type: "goal",
      team: match.homeTeam,
      player: "Mohamed Salah",
      playerId: "p1",
      minute: 12,
      duration: "0:18",
      caption: "Brilliant finish by Salah after a quick counter-attack",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Goal",
      rating: { up: 245, down: 12 },
    },
    {
      id: "h2",
      type: "save",
      team: match.awayTeam,
      player: "Mohamed Awad",
      playerId: "p5",
      minute: 24,
      duration: "0:12",
      caption: "Spectacular diving save by Awad to deny a certain goal",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Save",
      rating: { up: 187, down: 8 },
    },
    {
      id: "h3",
      type: "chance",
      team: match.homeTeam,
      player: "Hussein El Shahat",
      playerId: "p2",
      minute: 32,
      duration: "0:15",
      caption: "El Shahat narrowly misses after a great team move",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Chance",
      rating: { up: 124, down: 18 },
    },
    {
      id: "h4",
      type: "goal",
      team: match.awayTeam,
      player: "Achraf Bencharki",
      playerId: "p4",
      minute: 45,
      duration: "0:22",
      caption: "Bencharki equalizes with a powerful header from the corner",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Goal",
      rating: { up: 198, down: 45 },
    },
    {
      id: "h5",
      type: "skill",
      team: match.homeTeam,
      player: "Percy Tau",
      playerId: "p3",
      minute: 58,
      duration: "0:10",
      caption: "Incredible skill by Tau to beat two defenders",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Skill",
      rating: { up: 276, down: 5 },
    },
    {
      id: "h6",
      type: "goal",
      team: match.homeTeam,
      player: "Percy Tau",
      playerId: "p3",
      minute: 67,
      duration: "0:20",
      caption: "Tau scores the winner with a precise finish into the bottom corner",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Goal",
      rating: { up: 312, down: 22 },
    },
    {
      id: "h7",
      type: "red-card",
      team: match.awayTeam,
      player: "Tarek Hamed",
      playerId: "p6",
      minute: 73,
      duration: "0:25",
      caption: "Hamed receives a straight red card for a dangerous tackle",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Red+Card",
      rating: { up: 156, down: 87 },
    },
    {
      id: "h8",
      type: "chance",
      team: match.homeTeam,
      player: "Mohamed Salah",
      playerId: "p1",
      minute: 82,
      duration: "0:14",
      caption: "Salah hits the post with a curling effort from outside the box",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Chance",
      rating: { up: 201, down: 14 },
    },
  ]

  // Get top 3 moments based on rating
  const topMoments = [...highlights]
    .sort((a, b) => b.rating.up - a.rating.up)
    .slice(0, 3)
    .map((highlight) => highlight.id)

  // Filter highlights based on selected tab and player filter
  const getFilteredHighlights = (filter: string) => {
    let filtered = [...highlights]

    // Apply player filter if selected
    if (filterPlayer) {
      filtered = filtered.filter((h) => h.playerId === filterPlayer)
    }

    // Apply tab filter
    switch (filter) {
      case "goals":
        return filtered.filter((h) => h.type === "goal")
      case "top":
        return filtered.filter((h) => topMoments.includes(h.id))
      case "team-a":
        return filtered.filter((h) => h.team === match.homeTeam)
      case "team-b":
        return filtered.filter((h) => h.team === match.awayTeam)
      default:
        return filtered
    }
  }

  // Toggle clip selection
  const toggleClipSelection = (clipId: string) => {
    if (selectedClips.includes(clipId)) {
      setSelectedClips(selectedClips.filter((id) => id !== clipId))
    } else {
      setSelectedClips([...selectedClips, clipId])
    }
  }

  // Rate a clip
  const rateClip = (clipId: string, isPositive: boolean) => {
    // In a real app, this would send the rating to the server
    toast({
      title: "Thanks for your feedback!",
      description: `You rated this clip ${isPositive ? "positively" : "negatively"}.`,
    })
  }

  // Share a clip
  const shareClip = (clipId: string, platform: string) => {
    // In a real app, this would generate a sharing link for the specific platform
    const shareUrl = `https://matchvisor.com/share/clip/${clipId}`

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
    } else {
      toast({
        title: "Sharing to " + platform,
        description: "Opening share dialog...",
      })
      // Would open the appropriate share dialog in a real app
    }
  }

  // Create a reel from selected clips
  const createReel = () => {
    if (selectedClips.length === 0) {
      toast({
        title: "No clips selected",
        description: "Please select at least one clip to create a reel.",
        variant: "destructive",
      })
      return
    }

    if (!reelName.trim()) {
      toast({
        title: "Reel name required",
        description: "Please enter a name for your reel.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would process the selected clips into a reel
    toast({
      title: "Creating your reel",
      description: "Your personal highlight reel is being created. This may take a moment.",
    })

    // Simulate processing time
    setTimeout(() => {
      toast({
        title: "Reel created successfully!",
        description: `Your reel "${reelName}" is ready to download or share.`,
        action: (
          <ToastAction altText="Download">
            <Download className="h-4 w-4 mr-1" /> Download
          </ToastAction>
        ),
      })
      setIsCreatingReel(false)
      // In a real app, we would provide a download link or redirect to the reel
    }, 2000)
  }

  // Update selected clips data when selection changes
  useEffect(() => {
    const clipsData = highlights.filter((clip) => selectedClips.includes(clip.id))
    setSelectedClipsData(clipsData)
  }, [selectedClips])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Smart Highlights</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Main content - Clips grid (3/4 width on desktop) */}
        <div className="lg:col-span-3">
          {/* Filter tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="goals">Goals Only</TabsTrigger>
                <TabsTrigger value="top">Top 3 Moments</TabsTrigger>
                <TabsTrigger value="team-a">{match.homeTeam}</TabsTrigger>
                <TabsTrigger value="team-b">{match.awayTeam}</TabsTrigger>
              </TabsList>

              {/* Player filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {filterPlayer ? players.find((p) => p.id === filterPlayer)?.name : "Filter by Player"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterPlayer(null)}>All Players</DropdownMenuItem>
                  <Separator className="my-1" />
                  {players.map((player) => (
                    <DropdownMenuItem key={player.id} onClick={() => setFilterPlayer(player.id)}>
                      {player.name} ({player.team})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Clips grid for each tab */}
            {["all", "goals", "top", "team-a", "team-b"].map((filter) => (
              <TabsContent key={filter} value={filter} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredHighlights(filter).map((clip) => (
                    <Card key={clip.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={clip.thumbnail || "/placeholder.svg"}
                          alt={clip.caption}
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
                        <Badge
                          className={`absolute top-2 right-2 ${
                            clip.type === "goal"
                              ? "bg-green-500"
                              : clip.type === "save"
                                ? "bg-blue-500"
                                : clip.type === "red-card"
                                  ? "bg-red-500"
                                  : clip.type === "skill"
                                    ? "bg-purple-500"
                                    : ""
                          }`}
                        >
                          {clip.type.replace("-", " ")}
                        </Badge>
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <Badge variant="outline" className="bg-black/50">
                            {clip.minute}'
                          </Badge>
                          <Badge variant="outline" className="bg-black/50">
                            <Clock className="h-3 w-3 mr-1" />
                            {clip.duration}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Checkbox
                            id={`select-${clip.id}`}
                            checked={selectedClips.includes(clip.id)}
                            onCheckedChange={() => toggleClipSelection(clip.id)}
                            className="h-5 w-5 bg-black/50 border-white"
                          />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium mb-1">{clip.caption}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {clip.player} ({clip.team})
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => rateClip(clip.id, true)}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{clip.rating.up}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => rateClip(clip.id, false)}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              <span>{clip.rating.down}</span>
                            </Button>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" side="top" align="end">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => shareClip(clip.id, "whatsapp")}
                                >
                                  <WhatsApp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => shareClip(clip.id, "twitter")}
                                >
                                  <Twitter className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => shareClip(clip.id, "facebook")}
                                >
                                  <Facebook className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => shareClip(clip.id, "copy")}
                                >
                                  <Link className="h-4 w-4" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getFilteredHighlights(filter).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No highlights match your current filters.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setFilterPlayer(null)}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Sidebar - Reel Builder (1/4 width on desktop) */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reel Builder</h2>
                <Badge variant="outline">{selectedClips.length}</Badge>
              </div>

              {selectedClips.length > 0 ? (
                <>
                  <ScrollArea className="h-[300px] pr-4 mb-4">
                    <div className="space-y-3">
                      {selectedClipsData.map((clip, index) => (
                        <div key={clip.id} className="flex items-center gap-3 bg-secondary/20 p-2 rounded-md">
                          <div className="font-bold text-sm w-6 text-center">{index + 1}</div>
                          <div className="relative w-16 h-9 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={clip.thumbnail || "/placeholder.svg"}
                              alt={clip.caption}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{clip.type.replace("-", " ")}</p>
                            <p className="text-xs text-muted-foreground truncate">{clip.player}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => toggleClipSelection(clip.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {isCreatingReel ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reel-name">Reel Name</Label>
                        <Input
                          id="reel-name"
                          placeholder="My Highlight Reel"
                          value={reelName}
                          onChange={(e) => setReelName(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="include-commentary"
                          checked={includeCommentary}
                          onCheckedChange={setIncludeCommentary}
                        />
                        <Label htmlFor="include-commentary">Include AI Commentary</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2" onClick={createReel}>
                          <Check className="h-4 w-4" /> Create Reel
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreatingReel(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full gap-2" onClick={() => setIsCreatingReel(true)}>
                      <Video className="h-4 w-4" /> Create Highlight Reel
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="bg-secondary/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No clips selected</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select clips from the grid to build your personal highlight reel.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
