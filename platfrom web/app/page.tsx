import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Globe, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import FeaturedMatch from "@/components/featured-match"
import HighlightCarousel from "@/components/highlight-carousel"
import { LanguageSwitcher } from "@/components/language-switcher"
import { StatsCounter } from "@/components/stats-counter"
import { LoginButton } from "@/components/login-button"
import ApiStatus from "@/components/api-status"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Featured Match */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display text-ultramarine">Featured Match</h2>
            <Button variant="ghost" size="sm" className="text-ultramarine hover:text-ultramarine/80" asChild>
              <Link href="/matches" className="flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <FeaturedMatch />
        </section>

        {/* Top Highlights - Auto-playing carousel */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display text-ultramarine">Top Highlights</h2>
            <Button variant="ghost" size="sm" className="text-ultramarine hover:text-ultramarine/80" asChild>
              <Link href="/highlights" className="flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <HighlightCarousel autoPlay={true} />
        </section>

        {/* Stats Counter */}
        <section className="mb-12">
          <StatsCounter />
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="card-hover-effect border-periwinkle">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-periwinkle flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ultramarine"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-ultramarine">Smart Highlights</h3>
              <p className="text-muted-foreground">
                AI-generated highlights of key moments, goals, and plays from every match.
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover-effect border-periwinkle">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-periwinkle flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ultramarine"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-ultramarine">Tactical Analysis</h3>
              <p className="text-muted-foreground">
                In-depth reports with heatmaps, pass networks, and player performance data.
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover-effect border-periwinkle">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-periwinkle flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ultramarine"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-ultramarine">AI Commentary</h3>
              <p className="text-muted-foreground">
                Real-time intelligent commentary in multiple languages for an enhanced viewing experience.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
