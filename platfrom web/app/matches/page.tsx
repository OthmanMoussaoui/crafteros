"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, Search, SortDesc, X } from "lucide-react"
import MatchCard from "@/components/match-card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for matches
const allMatches = [
  {
    id: "1",
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
    views: 12500,
    goals: 3,
  },
  {
    id: "2",
    homeTeam: "Al-Hilal",
    awayTeam: "Al-Nassr",
    homeScore: 0,
    awayScore: 0,
    date: "2025-04-09",
    time: "20:30",
    league: "Saudi Pro League",
    status: "Live",
    hasHighlights: true,
    hasReport: false,
    views: 45000,
    goals: 0,
  },
  {
    id: "3",
    homeTeam: "Wydad AC",
    awayTeam: "Raja CA",
    homeScore: 1,
    awayScore: 2,
    date: "2025-04-08",
    time: "19:00",
    league: "Botola Pro",
    status: "Finished",
    hasHighlights: true,
    hasReport: true,
    views: 8700,
    goals: 3,
  },
  {
    id: "4",
    homeTeam: "ES Tunis",
    awayTeam: "CS Sfaxien",
    homeScore: 3,
    awayScore: 0,
    date: "2025-04-08",
    time: "17:00",
    league: "Tunisian Ligue 1",
    status: "Finished",
    hasHighlights: true,
    hasReport: true,
    views: 7200,
    goals: 3,
  },
  {
    id: "5",
    homeTeam: "MC Alger",
    awayTeam: "JS Kabylie",
    homeScore: 0,
    awayScore: 0,
    date: "2025-04-10",
    time: "16:00",
    league: "Algerian Ligue 1",
    status: "Upcoming",
    hasHighlights: false,
    hasReport: false,
    views: 3500,
    goals: 0,
  },
  {
    id: "6",
    homeTeam: "Espérance",
    awayTeam: "Club Africain",
    homeScore: 0,
    awayScore: 0,
    date: "2025-04-10",
    time: "19:30",
    league: "Tunisian Ligue 1",
    status: "Upcoming",
    hasHighlights: false,
    hasReport: false,
    views: 4200,
    goals: 0,
  },
  {
    id: "7",
    homeTeam: "Al Ahly",
    awayTeam: "Al-Hilal",
    homeScore: 1,
    awayScore: 1,
    date: "2025-04-07",
    time: "20:00",
    league: "Arab Club Champions Cup",
    status: "Finished",
    hasHighlights: true,
    hasReport: true,
    views: 32000,
    goals: 2,
  },
  {
    id: "8",
    homeTeam: "Zamalek",
    awayTeam: "Pyramids FC",
    homeScore: 2,
    awayScore: 0,
    date: "2025-04-06",
    time: "18:30",
    league: "Egyptian Premier League",
    status: "Finished",
    hasHighlights: true,
    hasReport: true,
    views: 18500,
    goals: 2,
  },
  {
    id: "9",
    homeTeam: "Al-Nassr",
    awayTeam: "Al-Ittihad",
    homeScore: 0,
    awayScore: 0,
    date: "2025-04-11",
    time: "19:00",
    league: "Saudi Pro League",
    status: "Upcoming",
    hasHighlights: false,
    hasReport: false,
    views: 28000,
    goals: 0,
  },
  {
    id: "10",
    homeTeam: "Raja CA",
    awayTeam: "FAR Rabat",
    homeScore: 0,
    awayScore: 0,
    date: "2025-04-11",
    time: "20:00",
    league: "Botola Pro",
    status: "Upcoming",
    hasHighlights: false,
    hasReport: false,
    views: 6800,
    goals: 0,
  },
  {
    id: "11",
    homeTeam: "Al-Ahli",
    awayTeam: "Al-Shabab",
    homeScore: 3,
    awayScore: 1,
    date: "2025-04-09",
    time: "18:30",
    league: "Saudi Pro League",
    status: "Live",
    hasHighlights: true,
    hasReport: false,
    views: 22000,
    goals: 4,
  },
  {
    id: "12",
    homeTeam: "Ismaily",
    awayTeam: "El Gouna",
    homeScore: 1,
    awayScore: 1,
    date: "2025-04-07",
    time: "16:00",
    league: "Egyptian Premier League",
    status: "Finished",
    hasHighlights: true,
    hasReport: true,
    views: 9500,
    goals: 2,
  },
]

export default function MatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("all")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [sortOption, setSortOption] = useState("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [visibleMatches, setVisibleMatches] = useState(6)
  const [isLoading, setIsLoading] = useState(false)

  // Get unique leagues and teams for filters
  const leagues = Array.from(new Set(allMatches.map((match) => match.league)))
  const teams = Array.from(new Set(allMatches.flatMap((match) => [match.homeTeam, match.awayTeam]))).sort()

  // Filter matches based on selected filters
  const filteredMatches = allMatches.filter((match) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase())

    // League filter
    const matchesLeague = selectedLeague === "all" || match.league === selectedLeague

    // Team filter
    const matchesTeam = selectedTeam === "all" || match.homeTeam === selectedTeam || match.awayTeam === selectedTeam

    // Status filter
    const matchesStatus = selectedStatus === "all" || match.status.toLowerCase() === selectedStatus.toLowerCase()

    // Date range filter
    let matchesDate = true
    if (dateRange.from) {
      const matchDate = new Date(match.date)
      matchesDate = matchesDate && matchDate >= dateRange.from
      if (dateRange.to) {
        matchesDate = matchesDate && matchDate <= dateRange.to
      }
    }

    return matchesSearch && matchesLeague && matchesTeam && matchesStatus && matchesDate
  })

  // Sort matches based on selected sort option
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "most-viewed":
        return b.views - a.views
      case "most-goals":
        return b.goals - a.goals
      default:
        return 0
    }
  })

  // Get matches to display based on visibility limit
  const displayedMatches = sortedMatches.slice(0, visibleMatches)

  // Load more matches
  const loadMoreMatches = () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      setVisibleMatches((prev) => prev + 6)
      setIsLoading(false)
    }, 1000)
  }

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300 &&
        !isLoading &&
        visibleMatches < filteredMatches.length
      ) {
        loadMoreMatches()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [visibleMatches, filteredMatches.length, isLoading])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedLeague("all")
    setSelectedTeam("all")
    setDateRange({ from: undefined, to: undefined })
    setSortOption("newest")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Explore Matches</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range as { from: Date | undefined; to: Date | undefined })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(searchTerm || selectedLeague !== "all" || selectedTeam !== "all") && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {(searchTerm ? 1 : 0) + (selectedLeague !== "all" ? 1 : 0) + (selectedTeam !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Sort By</h3>
                  <RadioGroup value={sortOption} onValueChange={setSortOption}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="newest" id="newest" />
                      <Label htmlFor="newest">Newest First</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oldest" id="oldest" />
                      <Label htmlFor="oldest">Oldest First</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="most-viewed" id="most-viewed" />
                      <Label htmlFor="most-viewed">Most Viewed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="most-goals" id="most-goals" />
                      <Label htmlFor="most-goals">Most Goals</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">League</h3>
                  <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Leagues" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Leagues</SelectItem>
                      {leagues.map((league) => (
                        <SelectItem key={league} value={league}>
                          {league}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Team</h3>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams, leagues..."
          className="pl-9 pr-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sort dropdown (mobile) */}
      <div className="md:hidden mb-4">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full">
            <SortDesc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most-viewed">Most Viewed</SelectItem>
            <SelectItem value="most-goals">Most Goals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">
            Live <Badge className="ml-2 bg-red-500">{allMatches.filter((m) => m.status === "Live").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="finished">Finished</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {displayedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No matches found matching your filters.</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="p-6 pb-4">
                    <Skeleton className="h-4 w-24 mb-4 mx-auto" />
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="flex flex-col items-center">
                        <Skeleton className="w-12 h-12 rounded-full mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                      <div className="flex flex-col items-center">
                        <Skeleton className="w-12 h-12 rounded-full mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <div className="bg-secondary/20 p-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load more button */}
          {visibleMatches < filteredMatches.length && !isLoading && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMoreMatches} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finished" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
