"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Download,
  Edit,
  FileText,
  Flag,
  HardDrive,
  Info,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  XCircle,
} from "lucide-react"
import { Monitor } from "@/components/monitor"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [showBannedUsers, setShowBannedUsers] = useState(false)

  // Mock data for users
  const users = [
    {
      id: "u1",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      role: "admin",
      status: "active",
      lastActive: "Today, 10:23 AM",
      avatar: "/placeholder.svg?height=40&width=40&text=A",
    },
    {
      id: "u2",
      name: "Mohamed Ali",
      email: "mohamed.ali@example.com",
      role: "editor",
      status: "active",
      lastActive: "Today, 9:45 AM",
      avatar: "/placeholder.svg?height=40&width=40&text=M",
    },
    {
      id: "u3",
      name: "Sara Ahmed",
      email: "sara.ahmed@example.com",
      role: "viewer",
      status: "active",
      lastActive: "Yesterday, 8:30 PM",
      avatar: "/placeholder.svg?height=40&width=40&text=S",
    },
    {
      id: "u4",
      name: "Karim Mahmoud",
      email: "karim.mahmoud@example.com",
      role: "editor",
      status: "banned",
      lastActive: "April 5, 2025",
      avatar: "/placeholder.svg?height=40&width=40&text=K",
    },
    {
      id: "u5",
      name: "Layla Ibrahim",
      email: "layla.ibrahim@example.com",
      role: "viewer",
      status: "active",
      lastActive: "April 7, 2025",
      avatar: "/placeholder.svg?height=40&width=40&text=L",
    },
  ]

  // Mock data for flagged content
  const flaggedContent = [
    {
      id: "f1",
      title: "Inappropriate celebration",
      match: "Al Ahly vs Zamalek",
      reporter: "Mohamed Ali",
      date: "April 9, 2025",
      status: "pending",
      reason: "Offensive gestures",
    },
    {
      id: "f2",
      title: "Violent tackle",
      match: "Al-Hilal vs Al-Nassr",
      reporter: "Sara Ahmed",
      date: "April 8, 2025",
      status: "reviewed",
      reason: "Excessive violence",
    },
    {
      id: "f3",
      title: "Incorrect commentary",
      match: "Wydad AC vs Raja CA",
      reporter: "Karim Mahmoud",
      date: "April 7, 2025",
      status: "resolved",
      reason: "Factual errors",
    },
  ]

  // Mock data for system logs
  const systemLogs = [
    {
      id: "l1",
      type: "error",
      message: "Failed to process video for Al Ahly vs Zamalek",
      timestamp: "April 9, 2025 10:23 AM",
      details: "Error code: VID_PROC_001. Encoding failed at 45% completion.",
    },
    {
      id: "l2",
      type: "warning",
      message: "High server load detected",
      timestamp: "April 9, 2025 09:45 AM",
      details: "CPU usage at 85% for over 10 minutes. Consider scaling resources.",
    },
    {
      id: "l3",
      type: "info",
      message: "New user registered",
      timestamp: "April 8, 2025 08:30 PM",
      details: "User ID: u5, Email: layla.ibrahim@example.com",
    },
    {
      id: "l4",
      type: "success",
      message: "Successfully processed Al-Hilal vs Al-Nassr match",
      timestamp: "April 8, 2025 07:15 PM",
      details: "Generated 12 highlights, 1 tactical report, and commentary in 3 languages.",
    },
  ]

  // Mock data for system stats
  const systemStats = {
    storage: {
      used: 1.7,
      total: 5,
      unit: "TB",
    },
    cpu: {
      usage: 42,
    },
    memory: {
      usage: 68,
    },
    activeUsers: {
      count: 1243,
      change: 12,
    },
    processedMatches: {
      count: 87,
      change: 5,
    },
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const matchesSearch =
      userSearchQuery === "" ||
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())

    // Filter by role
    const matchesRole = selectedRole === "all" || user.role === selectedRole

    // Filter by status
    const matchesStatus = !showBannedUsers || user.status === "banned"

    return matchesSearch && matchesRole && matchesStatus
  })

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload complete",
            description: "The match video has been uploaded successfully.",
          })
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  // Handle user actions
  const handleUserAction = (userId: string, action: "edit" | "ban" | "delete") => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    switch (action) {
      case "edit":
        toast({
          title: "Edit user",
          description: `Editing user ${user.name}`,
        })
        break
      case "ban":
        toast({
          title: user.status === "banned" ? "User unbanned" : "User banned",
          description: `${user.name} has been ${user.status === "banned" ? "unbanned" : "banned"}.`,
        })
        break
      case "delete":
        toast({
          title: "User deleted",
          description: `${user.name} has been deleted.`,
          variant: "destructive",
        })
        break
    }
  }

  // Handle flagged content actions
  const handleFlaggedContentAction = (contentId: string, action: "review" | "resolve" | "dismiss") => {
    const content = flaggedContent.find((c) => c.id === contentId)
    if (!content) return

    switch (action) {
      case "review":
        toast({
          title: "Content marked for review",
          description: `"${content.title}" has been marked for review.`,
        })
        break
      case "resolve":
        toast({
          title: "Content issue resolved",
          description: `"${content.title}" has been resolved.`,
        })
        break
      case "dismiss":
        toast({
          title: "Flag dismissed",
          description: `Flag for "${content.title}" has been dismissed.`,
        })
        break
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-ultramarine font-display">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, content, and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <Card className="border-periwinkle shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <h3 className="text-2xl font-bold text-ultramarine">{systemStats.activeUsers.count}</h3>
              </div>
              <div className="bg-periwinkle/30 p-2 rounded-full">
                <Users className="h-5 w-5 text-ultramarine" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                +{systemStats.activeUsers.change}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs. last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-periwinkle shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <h3 className="text-2xl font-bold text-ultramarine">
                  {systemStats.storage.used} / {systemStats.storage.total} {systemStats.storage.unit}
                </h3>
              </div>
              <div className="bg-periwinkle/30 p-2 rounded-full">
                <HardDrive className="h-5 w-5 text-ultramarine" />
              </div>
            </div>
            <Progress value={(systemStats.storage.used / systemStats.storage.total) * 100} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="border-periwinkle shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <h3 className="text-2xl font-bold text-ultramarine">{systemStats.cpu.usage}%</h3>
              </div>
              <div className="bg-periwinkle/30 p-2 rounded-full">
                <Monitor className="h-5 w-5 text-ultramarine" />
              </div>
            </div>
            <Progress
              value={systemStats.cpu.usage}
              className={`h-2 mt-4 ${systemStats.cpu.usage > 80 ? "bg-red-200" : ""}`}
            />
          </CardContent>
        </Card>

        <Card className="border-periwinkle shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Processed Matches</p>
                <h3 className="text-2xl font-bold text-ultramarine">{systemStats.processedMatches.count}</h3>
              </div>
              <div className="bg-periwinkle/30 p-2 rounded-full">
                <FileText className="h-5 w-5 text-ultramarine" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                +{systemStats.processedMatches.change}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs. last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-periwinkle/20 p-1">
          <TabsTrigger value="upload" className="data-[state=active]:bg-ultramarine data-[state=active]:text-white">
            Upload Match
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-ultramarine data-[state=active]:text-white">
            User Management
          </TabsTrigger>
          <TabsTrigger value="flagged" className="data-[state=active]:bg-ultramarine data-[state=active]:text-white">
            Flagged Content
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-ultramarine data-[state=active]:text-white">
            System Logs
          </TabsTrigger>
        </TabsList>

        {/* Upload Match Tab */}
        <TabsContent value="upload">
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <CardTitle>Upload Match Video</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="match-title" className="text-ultramarine">
                        Match Title
                      </Label>
                      <Input
                        id="match-title"
                        placeholder="e.g. Al Ahly vs Zamalek"
                        className="border-periwinkle focus:border-ultramarine"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="match-date" className="text-ultramarine">
                        Match Date
                      </Label>
                      <Input id="match-date" type="date" className="border-periwinkle focus:border-ultramarine" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="match-league" className="text-ultramarine">
                        League
                      </Label>
                      <Select>
                        <SelectTrigger className="border-periwinkle focus:border-ultramarine">
                          <SelectValue placeholder="Select league" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="egyptian-premier-league">Egyptian Premier League</SelectItem>
                          <SelectItem value="saudi-pro-league">Saudi Pro League</SelectItem>
                          <SelectItem value="botola-pro">Botola Pro</SelectItem>
                          <SelectItem value="tunisian-ligue-1">Tunisian Ligue 1</SelectItem>
                          <SelectItem value="algerian-ligue-1">Algerian Ligue 1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="home-team" className="text-ultramarine">
                        Home Team
                      </Label>
                      <Select>
                        <SelectTrigger className="border-periwinkle focus:border-ultramarine">
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="al-ahly">Al Ahly</SelectItem>
                          <SelectItem value="zamalek">Zamalek</SelectItem>
                          <SelectItem value="al-hilal">Al-Hilal</SelectItem>
                          <SelectItem value="al-nassr">Al-Nassr</SelectItem>
                          <SelectItem value="wydad-ac">Wydad AC</SelectItem>
                          <SelectItem value="raja-ca">Raja CA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="away-team" className="text-ultramarine">
                        Away Team
                      </Label>
                      <Select>
                        <SelectTrigger className="border-periwinkle focus:border-ultramarine">
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="al-ahly">Al Ahly</SelectItem>
                          <SelectItem value="zamalek">Zamalek</SelectItem>
                          <SelectItem value="al-hilal">Al-Hilal</SelectItem>
                          <SelectItem value="al-nassr">Al-Nassr</SelectItem>
                          <SelectItem value="wydad-ac">Wydad AC</SelectItem>
                          <SelectItem value="raja-ca">Raja CA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="match-type" className="text-ultramarine">
                        Match Type
                      </Label>
                      <Select>
                        <SelectTrigger className="border-periwinkle focus:border-ultramarine">
                          <SelectValue placeholder="Select match type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="league">League Match</SelectItem>
                          <SelectItem value="cup">Cup Match</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="bg-periwinkle/50" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="file-upload" className="text-ultramarine">
                      Upload Video File
                    </Label>
                    <div className="flex items-center gap-2">
                      <Switch id="auto-process" />
                      <Label htmlFor="auto-process" className="text-sm">
                        Auto-process after upload
                      </Label>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-periwinkle rounded-lg p-8 text-center">
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileUpload}
                    />
                    <Label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="h-12 w-12 text-ultramarine mb-4" />
                      <p className="text-lg font-medium text-ultramarine mb-1">Drag and drop or click to upload</p>
                      <p className="text-sm text-muted-foreground mb-4">Supports MP4, MOV, MKV up to 10GB</p>
                      <Button className="bg-ultramarine hover:bg-ultramarine/90">Select File</Button>
                    </Label>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Uploading...</p>
                        <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="border-ultramarine text-ultramarine hover:bg-ultramarine/10">
                    Cancel
                  </Button>
                  <Button className="bg-ultramarine hover:bg-ultramarine/90" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Upload Match
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button className="bg-white text-ultramarine hover:bg-periwinkle">
                  <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      className="pl-9 border-periwinkle focus:border-ultramarine"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-[150px] border-periwinkle focus:border-ultramarine">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-banned" checked={showBannedUsers} onCheckedChange={setShowBannedUsers} />
                      <Label htmlFor="show-banned">Show Banned</Label>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-periwinkle">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-periwinkle/20 font-medium text-ultramarine">
                    <div className="col-span-5">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Last Active</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  <ScrollArea className="h-[400px]">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-12 gap-4 p-4 items-center border-t border-periwinkle/30"
                        >
                          <div className="col-span-5 flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-periwinkle">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-ultramarine text-white">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "border-ultramarine text-ultramarine"
                                  : user.role === "editor"
                                    ? "border-violet-blue text-violet-blue"
                                    : "border-slate-blue text-slate-blue"
                              }
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <Badge className={user.status === "active" ? "bg-green-500" : "bg-red-500"}>
                              {user.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-sm">{user.lastActive}</div>
                          <div className="col-span-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "edit")}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "ban")}>
                                  {user.status === "banned" ? (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" /> Unban
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="mr-2 h-4 w-4" /> Ban
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, "delete")}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground">No users found matching your filters.</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged Content Tab */}
        <TabsContent value="flagged">
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <CardTitle>Flagged Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="rounded-md border border-periwinkle">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-periwinkle/20 font-medium text-ultramarine">
                    <div className="col-span-4">Content</div>
                    <div className="col-span-2">Match</div>
                    <div className="col-span-2">Reporter</div>
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  <ScrollArea className="h-[400px]">
                    {flaggedContent.map((content) => (
                      <div
                        key={content.id}
                        className="grid grid-cols-12 gap-4 p-4 items-center border-t border-periwinkle/30"
                      >
                        <div className="col-span-4">
                          <p className="font-medium">{content.title}</p>
                          <p className="text-xs text-muted-foreground">{content.reason}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm">{content.match}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm">{content.reporter}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-sm">{content.date}</p>
                        </div>
                        <div className="col-span-2">
                          <Badge
                            className={
                              content.status === "pending"
                                ? "bg-yellow-500"
                                : content.status === "reviewed"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleFlaggedContentAction(content.id, "review")}>
                                <Flag className="mr-2 h-4 w-4" /> Mark for Review
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFlaggedContentAction(content.id, "resolve")}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Resolve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFlaggedContentAction(content.id, "dismiss")}>
                                <XCircle className="mr-2 h-4 w-4" /> Dismiss
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="logs">
          <Card className="border-periwinkle shadow-md">
            <CardHeader className="bg-ultramarine text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle>System Logs</CardTitle>
                <Button className="bg-white text-ultramarine hover:bg-periwinkle">
                  <Download className="mr-2 h-4 w-4" /> Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-ultramarine text-ultramarine hover:bg-ultramarine/10"
                  >
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </Button>
                </div>

                <div className="rounded-md border border-periwinkle">
                  <ScrollArea className="h-[400px]">
                    {systemLogs.map((log) => (
                      <div key={log.id} className="p-4 border-b border-periwinkle/30 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              log.type === "error"
                                ? "bg-red-100 text-red-600"
                                : log.type === "warning"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : log.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {log.type === "error" ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : log.type === "warning" ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : log.type === "success" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Info className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{log.message}</p>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    log.type === "error"
                                      ? "border-red-600 text-red-600"
                                      : log.type === "warning"
                                        ? "border-yellow-600 text-yellow-600"
                                        : log.type === "success"
                                          ? "border-green-600 text-green-600"
                                          : "border-blue-600 text-blue-600"
                                  }
                                >
                                  {log.type}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {log.timestamp}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Settings */}
      <Card className="border-periwinkle shadow-md mt-8">
        <CardHeader className="bg-ultramarine text-white rounded-t-lg">
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-ultramarine">General Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="text-ultramarine">
                      Maintenance Mode
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Put the site in maintenance mode for all non-admin users
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-highlights" className="text-ultramarine">
                      Auto-generate Highlights
                    </Label>
                    <p className="text-xs text-muted-foreground">Automatically generate highlights for new matches</p>
                  </div>
                  <Switch id="auto-highlights" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-registration" className="text-ultramarine">
                      User Registration
                    </Label>
                    <p className="text-xs text-muted-foreground">Allow new users to register on the platform</p>
                  </div>
                  <Switch id="user-registration" defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-ultramarine">API & Integrations</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-access" className="text-ultramarine">
                      API Access
                    </Label>
                    <p className="text-xs text-muted-foreground">Enable external API access</p>
                  </div>
                  <Switch id="api-access" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-ultramarine">
                    API Key
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      value="sk_live_51NzQjKLkjOiJKLjkLJKLjkLJKLjkLJKLjkLJKLjkLJKL"
                      readOnly
                      className="font-mono text-sm border-periwinkle focus:border-ultramarine"
                    />
                    <Button variant="outline" className="border-ultramarine text-ultramarine hover:bg-ultramarine/10">
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-ultramarine">
                    Webhook URL
                  </Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-domain.com/webhook"
                    className="border-periwinkle focus:border-ultramarine"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button className="bg-ultramarine hover:bg-ultramarine/90">
              <Settings className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
