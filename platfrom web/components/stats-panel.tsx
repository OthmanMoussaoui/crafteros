import { Card, CardContent } from "@/components/ui/card"

interface StatsPanelProps {
  matchId: string
}

export default function StatsPanel({ matchId }: StatsPanelProps) {
  // Mock stats data
  const stats = {
    possession: {
      home: 58,
      away: 42,
    },
    shots: {
      home: 15,
      away: 8,
    },
    shotsOnTarget: {
      home: 7,
      away: 3,
    },
    corners: {
      home: 6,
      away: 2,
    },
    fouls: {
      home: 10,
      away: 14,
    },
    yellowCards: {
      home: 2,
      away: 3,
    },
    redCards: {
      home: 0,
      away: 1,
    },
    offsides: {
      home: 3,
      away: 2,
    },
    passes: {
      home: 423,
      away: 287,
    },
    passAccuracy: {
      home: 87,
      away: 79,
    },
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Match Stats</h2>

          <div className="space-y-6">
            <StatItem
              label="Possession"
              homeValue={`${stats.possession.home}%`}
              awayValue={`${stats.possession.away}%`}
              homePercentage={stats.possession.home}
            />

            <StatItem
              label="Shots"
              homeValue={stats.shots.home}
              awayValue={stats.shots.away}
              homePercentage={Math.round((stats.shots.home / (stats.shots.home + stats.shots.away)) * 100)}
            />

            <StatItem
              label="Shots on Target"
              homeValue={stats.shotsOnTarget.home}
              awayValue={stats.shotsOnTarget.away}
              homePercentage={Math.round(
                (stats.shotsOnTarget.home / (stats.shotsOnTarget.home + stats.shotsOnTarget.away)) * 100,
              )}
            />

            <StatItem
              label="Corners"
              homeValue={stats.corners.home}
              awayValue={stats.corners.away}
              homePercentage={Math.round((stats.corners.home / (stats.corners.home + stats.corners.away)) * 100)}
            />

            <StatItem
              label="Fouls"
              homeValue={stats.fouls.home}
              awayValue={stats.fouls.away}
              homePercentage={Math.round((stats.fouls.home / (stats.fouls.home + stats.fouls.away)) * 100)}
              invertColors={true}
            />

            <StatItem
              label="Yellow Cards"
              homeValue={stats.yellowCards.home}
              awayValue={stats.yellowCards.away}
              homePercentage={Math.round(
                (stats.yellowCards.home / (stats.yellowCards.home + stats.yellowCards.away)) * 100,
              )}
              invertColors={true}
            />

            <StatItem
              label="Pass Accuracy"
              homeValue={`${stats.passAccuracy.home}%`}
              awayValue={`${stats.passAccuracy.away}%`}
              homePercentage={stats.passAccuracy.home}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Player Stats</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Top Passers</h3>
              <div className="space-y-2">
                <PlayerStat name="Mohamed Ibrahim" team="Al Ahly" stat="87 passes" />
                <PlayerStat name="Ahmed Hassan" team="Al Ahly" stat="76 passes" />
                <PlayerStat name="Mahmoud Kahraba" team="Zamalek" stat="65 passes" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Top Shooters</h3>
              <div className="space-y-2">
                <PlayerStat name="Hussein El Shahat" team="Al Ahly" stat="4 shots" />
                <PlayerStat name="Mostafa Mohamed" team="Zamalek" stat="3 shots" />
                <PlayerStat name="Percy Tau" team="Al Ahly" stat="3 shots" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatItemProps {
  label: string
  homeValue: number | string
  awayValue: number | string
  homePercentage: number
  invertColors?: boolean
}

function StatItem({ label, homeValue, awayValue, homePercentage, invertColors = false }: StatItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{homeValue}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{awayValue}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${invertColors ? "bg-destructive/70" : "bg-primary"}`}
            style={{ width: `${homePercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

interface PlayerStatProps {
  name: string
  team: string
  stat: string
}

function PlayerStat({ name, team, stat }: PlayerStatProps) {
  return (
    <div className="flex justify-between items-center p-2 rounded-md bg-secondary/20">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{team}</p>
      </div>
      <p className="text-sm">{stat}</p>
    </div>
  )
}
