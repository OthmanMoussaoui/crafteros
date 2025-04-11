import { cn } from "@/lib/utils"
import { getImageUrl } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Clock, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FeaturedMatchProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function FeaturedMatch({ className, ...props }: FeaturedMatchProps) {
  return (
    <div className={cn("", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
          {/* Match Preview Image */}
          <div className="relative h-[300px] md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image
              src={getImageUrl("images (6).jpeg")}
              alt="Barcelona vs Real Madrid"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <Badge variant="outline" className="border-ultramarine bg-black/50 text-white mb-2">
                LIVE NOW
              </Badge>
              <h3 className="text-2xl font-bold text-white">Barcelona vs Real Madrid</h3>
              <p className="text-white/80 flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" /> 65:24
              </p>
            </div>
          </div>

          {/* Match Details */}
          <div className="p-6 flex flex-col">
            <div className="flex mb-4 justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">La Liga</h4>
                <p className="text-muted-foreground text-sm">Camp Nou, Barcelona</p>
              </div>
              <Badge className="bg-red-500">LIVE</Badge>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <Image
                    src="/placeholder-logo.png"
                    alt="Barcelona"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-lg">FCB</span>
              </div>

              <div className="text-center px-4">
                <div className="text-3xl font-bold">2 - 1</div>
                <p className="text-xs text-muted-foreground mt-1">65' MIN</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <Image
                    src="/placeholder-logo.png"
                    alt="Real Madrid"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-lg">RMA</span>
              </div>
            </div>

            <div className="border rounded-md p-3 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Possession</span>
                <span className="text-sm font-medium">65% - 35%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div className="bg-ultramarine h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm">Shots</span>
                <span className="text-sm font-medium">14 - 8</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-ultramarine h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              <Button className="flex-1 gap-2" asChild>
                <Link href="/match/live-1234">
                  <Play className="h-4 w-4" /> Watch Now
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center gap-1" asChild>
                <Link href="/match/live-1234/report">
                  Stats <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
