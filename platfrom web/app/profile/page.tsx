"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Bell, Camera, Check, Clock, Edit, Globe, LogOut, Mail, Play, Plus, Search, Star, User, X } from "lucide-react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Monitor } from "@/components/monitor"
import { Tablet } from "@/components/tablet"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("favorites")
  const [searchTeam, setSearchTeam] = useState("")
  const [editingProfile, setEditingProfile] = useState(false)

  // Mock user data
  const user = {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    username: "ahmed_h",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "January 2025",
    subscription: "Premium",
    subscriptionRenews: "May 15, 2025",
  }

  // Mock favorite teams
  const [favoriteTeams, setFavoriteTeams] = useState([
    {
      id: "t1",
      name: "Al Ahly",
      league: "Egyptian Premier League",
      logo: "/placeholder.svg?height=40&width=40&text=A",
    },
    { id: "t2", name: "Al-Hilal", league: "Saudi Pro League", logo: "/placeholder.svg?height=40&width=40&text=H" },
    { id: "t3", name: "Wydad AC", league: "Botola Pro", logo: "/placeholder.svg?height=40&width=40&text=W" },
  ])

  // Mock available teams for adding
  const availableTeams = [
    {
      id: "t4",
      name: "Zamalek",
      league: "Egyptian Premier League",
      logo: "/placeholder.svg?height=40&width=40&text=Z",
    },
    { id: "t5", name: "Al-Nassr", league: "Saudi Pro League", logo: "/placeholder.svg?height=40&width=40&text=N" },
    { id: "t6", name: "Raja CA", league: "Botola Pro", logo: "/placeholder.svg?height=40&width=40&text=R" },
    { id: "t7", name: "ES Tunis", league: "Tunisian Ligue 1", logo: "/placeholder.svg?height=40&width=40&text=E" },
    { id: "t8", name: "MC Alger", league: "Algerian Ligue 1", logo: "/placeholder.svg?height=40&width=40&text=M" },
    { id: "t9", name: "Al-Ahli", league: "Saudi Pro League", logo: "/placeholder.svg?height=40&width=40&text=A" },
  ]

  // Mock saved clips
  const savedClips = [
    {
      id: "c1",
      title: "Al Ahly goal against Zamalek",
      match: "Al Ahly vs Zamalek",
      date: "April 9, 2025",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Goal",
      duration: "0:18",
      type: "clip",
    },
    {
      id: "c2",
      title: "Amazing save by Al-Nassr goalkeeper",
      match: "Al-Hilal vs Al-Nassr",
      date: "April 9, 2025",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Save",
      duration: "0:12",
      type: "clip",
    },
    {
      id: "c3",
      title: "Best Goals Compilation",
      match: "Multiple Matches",
      date: "April 8, 2025",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Reel",
      duration: "2:45",
      type: "reel",
    },
    {
      id: "c4",
      title: "Red card for ES Tunis defender",
      match: "ES Tunis vs CS Sfaxien",
      date: "April 8, 2025",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Red+Card",
      duration: "0:25",
      type: "clip",
    },
    {
      id: "c5",
      title: "Top 10 Saves of the Week",
      match: "Multiple Matches",
      date: "April 7, 2025",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Reel",
      duration: "3:12",
      type: "reel",
    },
  ]

  // Mock connected devices
  const connectedDevices = [
    {
      id: "d1",
      name: "iPhone 15 Pro",
      type: "Mobile",
      lastActive: "Today, 10:23 AM",
      location: "Cairo, Egypt",
      current: true,
    },
    {
      id: "d2",
      name: "MacBook Pro",
      type: "Desktop",
      lastActive: "Today, 9:45 AM",
      location: "Cairo, Egypt",
      current: false,
    },
    {
      id: "d3",
      name: "iPad Air",
      type: "Tablet",
      lastActive: "Yesterday, 8:30 PM",
      location: "Alexandria, Egypt",
      current: false,
    },
    {
      id: "d4",
      name: "Samsung Galaxy S23",
      type: "Mobile",
      lastActive: "April 5, 2025",
      location: "Riyadh, Saudi Arabia",
      current: false,
    },
  ]

  // Handle adding a team to favorites
  const addTeamToFavorites = (teamId: string) => {
    const teamToAdd = availableTeams.find((team) => team.id === teamId)
    if (teamToAdd && !favoriteTeams.some((team) => team.id === teamId)) {
      setFavoriteTeams([...favoriteTeams, teamToAdd])
      toast({
        title: "Team added to favorites",
        description: `${teamToAdd.name} has been added to your favorite teams.`,
      })
    }
  }

  // Handle removing a team from favorites
  const removeTeamFromFavorites = (teamId: string) => {
    setFavoriteTeams(favoriteTeams.filter((team) => team.id !== teamId))
    toast({
      title: "Team removed from favorites",
      description: "The team has been removed from your favorites.",
    })
  }

  // Handle deleting a saved clip
  const deleteClip = (clipId: string) => {
    toast({
      title: "Clip deleted",
      description: "The clip has been removed from your saved items.",
    })
    // In a real app, this would update the state or make an API call
  }

  // Handle saving profile changes
  const saveProfileChanges = () => {
    setEditingProfile(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  // Handle password change
  const changePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    })
  }

  // Handle notification settings change
  const updateNotificationSettings = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  // Handle language preferences change
  const updateLanguagePreferences = () => {
    toast({
      title: "Language preferences updated",
      description: "Your language settings have been saved.",
    })
  }

  // Handle logging out a device
  const logoutDevice = (deviceId: string) => {
    toast({
      title: "Device logged out",
      description: "The device has been logged out successfully.",
    })
    // In a real app, this would update the state or make an API call
  }

  // Filter available teams based on search
  const filteredTeams = availableTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
      team.league.toLowerCase().includes(searchTeam.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar - User Info */}
        <div className="md:col-span-1">
          <Card className="border-periwinkle shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 border-4 border-periwinkle">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-ultramarine text-white">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-ultramarine text-white hover:bg-violet-blue"
                    onClick={() =>
                      toast({
                        title: "Feature coming soon",
                        description: "Profile picture upload will be available soon.",
                      })
                    }
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold text-ultramarine">{user.name}</h2>
                <p className="text-muted-foreground">@{user.username}</p>
                <Badge className="mt-2 bg-ultramarine">{user.subscription}</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-ultramarine" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {editingProfile ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ultramarine hover:bg-periwinkle/20"
                      onClick={() => setEditingProfile(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ultramarine hover:bg-periwinkle/20"
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-ultramarine" />
                    <span className="text-sm">Joined {user.joinDate}</span>
                  </div>
                </div>

                <Separator className="bg-periwinkle/50" />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-ultramarine">Subscription</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Premium Plan</span>
                    <Badge variant="outline" className="border-ultramarine text-ultramarine">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Renews on {user.subscriptionRenews}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                  >
                    Manage Subscription
                  </Button>
                </div>

                <Separator className="bg-periwinkle/50" />

                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "favorites" ? "bg-periwinkle/30 text-ultramarine" : "hover:bg-periwinkle/20 hover:text-ultramarine"}`}
                    onClick={() => setActiveTab("favorites")}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Favorite Teams
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "clips" ? "bg-periwinkle/30 text-ultramarine" : "hover:bg-periwinkle/20 hover:text-ultramarine"}`}
                    onClick={() => setActiveTab("clips")}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Saved Clips
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "language" ? "bg-periwinkle/30 text-ultramarine" : "hover:bg-periwinkle/20 hover:text-ultramarine"}`}
                    onClick={() => setActiveTab("language")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Language Preferences
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "notifications" ? "bg-periwinkle/30 text-ultramarine" : "hover:bg-periwinkle/20 hover:text-ultramarine"}`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "account" ? "bg-periwinkle/30 text-ultramarine" : "hover:bg-periwinkle/20 hover:text-ultramarine"}`}
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account Details
                  </Button>
                </nav>

                <Button variant="destructive" className="w-full mt-4">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Profile Edit Form (conditionally rendered) */}
          {editingProfile && (
            <Card className="mb-6 border-periwinkle shadow-md">
              <CardHeader className="bg-ultramarine text-white rounded-t-lg">
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription className="text-white/80">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-ultramarine">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        defaultValue={user.name}
                        className="border-periwinkle focus:border-ultramarine"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-ultramarine">
                        Username
                      </Label>
                      <Input
                        id="username"
                        defaultValue={user.username}
                        className="border-periwinkle focus:border-ultramarine"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-ultramarine">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      className="border-periwinkle focus:border-ultramarine"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-ultramarine">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      className="border-periwinkle focus:border-ultramarine"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-ultramarine hover:bg-ultramarine/90" onClick={saveProfileChanges}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Favorite Teams */}
            <TabsContent value="favorites">
              <Card className="border-periwinkle shadow-md">
                <CardHeader className="bg-ultramarine text-white rounded-t-lg">
                  <CardTitle>Favorite Teams</CardTitle>
                  <CardDescription className="text-white/80">
                    Teams you follow will be prioritized in your content feed and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current favorite teams */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Your Teams</h3>
                      {favoriteTeams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {favoriteTeams.map((team) => (
                            <div
                              key={team.id}
                              className="flex items-center justify-between p-3 bg-periwinkle/20 rounded-lg border border-periwinkle/30"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={team.logo || "/placeholder.svg"}
                                  alt={team.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full border-2 border-periwinkle"
                                />
                                <div>
                                  <p className="font-medium text-ultramarine">{team.name}</p>
                                  <p className="text-xs text-muted-foreground">{team.league}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-ultramarine hover:bg-periwinkle/50"
                                onClick={() => removeTeamFromFavorites(team.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-periwinkle/10 rounded-lg border border-periwinkle/30">
                          <Star className="h-8 w-8 mx-auto text-ultramarine/50 mb-2" />
                          <p className="text-muted-foreground">You haven't added any favorite teams yet</p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    {/* Add new teams */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Add Teams</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search teams by name or league..."
                          className="pl-9 border-periwinkle focus:border-ultramarine"
                          value={searchTeam}
                          onChange={(e) => setSearchTeam(e.target.value)}
                        />
                      </div>

                      <ScrollArea className="h-[300px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredTeams.map((team) => (
                            <div
                              key={team.id}
                              className="flex items-center justify-between p-3 bg-periwinkle/10 rounded-lg border border-periwinkle/20"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={team.logo || "/placeholder.svg"}
                                  alt={team.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full border-2 border-periwinkle/50"
                                />
                                <div>
                                  <p className="font-medium">{team.name}</p>
                                  <p className="text-xs text-muted-foreground">{team.league}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-ultramarine hover:bg-periwinkle/30"
                                onClick={() => addTeamToFavorites(team.id)}
                                disabled={favoriteTeams.some((t) => t.id === team.id)}
                              >
                                {favoriteTeams.some((t) => t.id === team.id) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Clips */}
            <TabsContent value="clips">
              <Card className="border-periwinkle shadow-md">
                <CardHeader className="bg-ultramarine text-white rounded-t-lg">
                  <CardTitle>Saved Clips</CardTitle>
                  <CardDescription className="text-white/80">Your saved highlights and custom reels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedClips.map((clip) => (
                        <div key={clip.id} className="rounded-lg overflow-hidden border border-periwinkle/30">
                          <div className="relative aspect-video">
                            <Image
                              src={clip.thumbnail || "/placeholder.svg"}
                              alt={clip.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70"
                              >
                                <Play className="h-6 w-6 text-white" />
                              </Button>
                            </div>
                            <Badge
                              className={`absolute top-2 right-2 ${
                                clip.type === "reel" ? "bg-violet-blue" : "bg-ultramarine"
                              }`}
                            >
                              {clip.type === "reel" ? "Reel" : "Clip"}
                            </Badge>
                            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                              {clip.duration}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-1">{clip.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{clip.match}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{clip.date}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-ultramarine hover:bg-periwinkle/30"
                                onClick={() => deleteClip(clip.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Language Preferences */}
            <TabsContent value="language">
              <Card className="border-periwinkle shadow-md">
                <CardHeader className="bg-ultramarine text-white rounded-t-lg">
                  <CardTitle>Language Preferences</CardTitle>
                  <CardDescription className="text-white/80">
                    Customize your language settings for the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Interface Language</h3>
                      <Select defaultValue="en">
                        <SelectTrigger className="border-periwinkle focus:border-ultramarine">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية (Arabic)</SelectItem>
                          <SelectItem value="fr">Français (French)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Commentary Language</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="commentary-en" defaultChecked />
                          <Label htmlFor="commentary-en">English</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="commentary-ar" defaultChecked />
                          <Label htmlFor="commentary-ar">العربية (Arabic)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="commentary-fr" />
                          <Label htmlFor="commentary-fr">Français (French)</Label>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Subtitles</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="subtitles-enabled" defaultChecked />
                          <Label htmlFor="subtitles-enabled">Enable subtitles</Label>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="border-periwinkle focus:border-ultramarine">
                            <SelectValue placeholder="Select subtitle language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">العربية (Arabic)</SelectItem>
                            <SelectItem value="fr">Français (French)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-ultramarine hover:bg-ultramarine/90" onClick={updateLanguagePreferences}>
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="border-periwinkle shadow-md">
                <CardHeader className="bg-ultramarine text-white rounded-t-lg">
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription className="text-white/80">
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-matches" className="flex-1">
                            Match reminders
                          </Label>
                          <Switch id="email-matches" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-highlights" className="flex-1">
                            New highlights available
                          </Label>
                          <Switch id="email-highlights" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-newsletter" className="flex-1">
                            Weekly newsletter
                          </Label>
                          <Switch id="email-newsletter" />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Push Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-live" className="flex-1">
                            Live match updates
                          </Label>
                          <Switch id="push-live" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-goals" className="flex-1">
                            Goal alerts
                          </Label>
                          <Switch id="push-goals" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-favorite" className="flex-1">
                            Favorite team updates
                          </Label>
                          <Switch id="push-favorite" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">In-App Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp-comments" className="flex-1">
                            Replies to your comments
                          </Label>
                          <Switch id="inapp-comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp-mentions" className="flex-1">
                            Mentions
                          </Label>
                          <Switch id="inapp-mentions" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp-system" className="flex-1">
                            System announcements
                          </Label>
                          <Switch id="inapp-system" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-ultramarine hover:bg-ultramarine/90" onClick={updateNotificationSettings}>
                        Save Notification Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Details */}
            <TabsContent value="account">
              <Card className="border-periwinkle shadow-md">
                <CardHeader className="bg-ultramarine text-white rounded-t-lg">
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription className="text-white/80">Manage your account settings and security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Change Password</h3>
                      <form onSubmit={changePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            className="border-periwinkle focus:border-ultramarine"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            className="border-periwinkle focus:border-ultramarine"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            className="border-periwinkle focus:border-ultramarine"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" className="bg-ultramarine hover:bg-ultramarine/90">
                            Change Password
                          </Button>
                        </div>
                      </form>
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Connected Devices</h3>
                      <div className="space-y-3">
                        {connectedDevices.map((device) => (
                          <div
                            key={device.id}
                            className="flex items-center justify-between p-3 bg-periwinkle/10 rounded-lg border border-periwinkle/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-periwinkle/30 p-2 rounded-full">
                                {device.type === "Mobile" ? (
                                  <User className="h-5 w-5 text-ultramarine" />
                                ) : device.type === "Desktop" ? (
                                  <Monitor className="h-5 w-5 text-ultramarine" />
                                ) : (
                                  <Tablet className="h-5 w-5 text-ultramarine" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {device.name} {device.current && <Badge className="ml-2 bg-green-500">Current</Badge>}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{device.location}</span>
                                  <span>•</span>
                                  <span>Last active: {device.lastActive}</span>
                                </div>
                              </div>
                            </div>
                            {!device.current && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                                onClick={() => logoutDevice(device.id)}
                              >
                                Log Out
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-periwinkle/50" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-ultramarine">Account Actions</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                        >
                          Download My Data
                        </Button>
                        <Button variant="destructive" className="w-full">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
