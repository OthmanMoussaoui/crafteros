"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Video, Globe, Users } from "lucide-react"

// Mock data for stats
const statsData = [
  {
    icon: Video,
    label: "Matches Analyzed",
    value: 1250,
    suffix: "+",
    increment: 10,
  },
  {
    icon: Trophy,
    label: "Goals Clipped",
    value: 3700,
    suffix: "+",
    increment: 25,
  },
  {
    icon: Globe,
    label: "Languages Supported",
    value: 3,
    suffix: "",
    increment: 1,
  },
  {
    icon: Users,
    label: "Active Users",
    value: 25000,
    suffix: "+",
    increment: 100,
  },
]

export function StatsCounter() {
  const [counts, setCounts] = useState(statsData.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Set isVisible to true when component mounts
    setIsVisible(true)

    // Only animate if visible
    if (!isVisible) return

    // Animate the counters
    const intervals = statsData.map((stat, index) => {
      return setInterval(() => {
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts]
          if (newCounts[index] < stat.value) {
            newCounts[index] = Math.min(newCounts[index] + stat.increment, stat.value)
          }
          return newCounts
        })
      }, 50)
    })

    // Clear intervals on unmount
    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [isVisible])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-none bg-secondary/20">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <stat.icon className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-3xl font-bold mb-1">
              {Math.floor(counts[index])}
              {stat.suffix}
            </h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
