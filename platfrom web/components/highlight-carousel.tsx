"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/api-client"

interface HighlightCarouselProps {
  autoPlay?: boolean
}

export default function HighlightCarousel({ autoPlay = false }: HighlightCarouselProps) {
  // Mock data for highlights with project images
  const highlights = [
    {
      id: "1",
      title: "Amazing Goal by Player 10",
      type: "goal",
      match: "Barcelona vs Real Madrid",
      thumbnail: getImageUrl("images (1).jpeg"),
      views: 1542,
      duration: "0:35",
    },
    {
      id: "2",
      title: "Header from a Corner",
      type: "goal",
      match: "Barcelona vs Real Madrid",
      thumbnail: getImageUrl("greatest-soccer-matches_dmty.jpg"),
      views: 1203,
      duration: "0:28",
    },
    {
      id: "3",
      title: "Spectacular Save",
      type: "save",
      match: "Manchester United vs Liverpool",
      thumbnail: getImageUrl("images (5).jpeg"),
      views: 892,
      duration: "0:22",
    },
    {
      id: "4",
      title: "Team Goal After 15 Passes",
      type: "goal",
      match: "Manchester United vs Liverpool",
      thumbnail: getImageUrl("istockphoto-647672126-612x612.jpg"),
      views: 1105,
      duration: "0:45",
    }
  ]

  // Auto-play logic
  const [api, setApi] = React.useState<any>()
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (autoPlay && api) {
      intervalRef.current = setInterval(() => {
        api.scrollNext()
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [api, autoPlay])

  return (
    <Carousel 
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
      setApi={setApi}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {highlights.map((highlight) => (
          <CarouselItem key={highlight.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <Link href={`/highlight/${highlight.id}`}>
              <Card className="overflow-hidden group cursor-pointer">
                <div className="relative aspect-video">
                  <Image
                    src={highlight.thumbnail}
                    alt={highlight.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-ultramarine/90 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {highlight.duration}
                  </div>
                  
                  {/* Highlight type badge */}
                  <div className="absolute top-3 left-3 bg-ultramarine text-white text-xs px-2 py-1 rounded uppercase">
                    {highlight.type}
                  </div>
                  
                  {/* Highlight info */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-bold text-sm md:text-base line-clamp-1">{highlight.title}</h3>
                    <p className="text-xs text-white/80">{highlight.match}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs">{highlight.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-end gap-2 mt-4">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}
