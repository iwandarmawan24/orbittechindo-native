"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MovieDetail } from "@/types/movie"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
  ChartBar,
  ChartBarItem,
  ChartPie,
  ChartPieItem,
} from "@/components/ui/chart"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface MovieStatsProps {
  movie: MovieDetail
}

export default function MovieStats({ movie }: MovieStatsProps) {
  const [genreData, setGenreData] = useState<{ name: string; value: number }[]>([])
  const [ratingData, setRatingData] = useState<{ name: string; value: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Process genre data
      if (movie.Genre && movie.Genre !== "N/A") {
        const genres = movie.Genre.split(", ")
        const genreStats = genres.map((genre) => ({
          name: genre,
          value: Math.floor(Math.random() * 50) + 50, // Mock data for visualization
        }))
        setGenreData(genreStats)
      } else {
        setGenreData([])
      }

      // Process rating data
      const ratings = movie.Ratings || []
      if (ratings.length > 0) {
        const ratingStats = ratings.map((rating) => {
          let value = 0

          if (rating.Source === "Internet Movie Database") {
            // Convert "8.5/10" to 85
            const parts = rating.Value.split("/")
            value = parts.length > 1 ? Number.parseFloat(parts[0]) * 10 : 50
          } else if (rating.Source === "Rotten Tomatoes") {
            // Convert "85%" to 85
            value = Number.parseInt(rating.Value.replace("%", "")) || 50
          } else if (rating.Source === "Metacritic") {
            // Convert "75/100" to 75
            const parts = rating.Value.split("/")
            value = parts.length > 1 ? Number.parseInt(parts[0]) : 50
          } else {
            value = 50 // Default value
          }

          return {
            name: rating.Source,
            value,
          }
        })
        setRatingData(ratingStats)
      } else {
        setRatingData([])
      }
    } catch (err) {
      console.error("Error processing movie stats data:", err)
      setError("Could not load statistics data")
    }
  }, [movie])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (error) {
    return (
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (genreData.length === 0 && ratingData.length === 0) {
    return (
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground">No statistics data available for this movie</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <Tabs defaultValue={ratingData.length > 0 ? "ratings" : "genres"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="ratings" disabled={ratingData.length === 0}>
                Ratings
              </TabsTrigger>
              <TabsTrigger value="genres" disabled={genreData.length === 0}>
                Genres
              </TabsTrigger>
            </TabsList>

            {ratingData.length > 0 && (
              <TabsContent value="ratings" className="pt-2">
                <ChartContainer className="h-[350px]">
                  <Chart className="h-full w-full">
                    <ChartBar data={ratingData}>
                      {ratingData.map((entry, index) => (
                        <ChartBarItem
                          key={`bar-${entry.name}`}
                          dataKey="value"
                          name={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                    </ChartBar>
                  </Chart>
                </ChartContainer>
              </TabsContent>
            )}

            {genreData.length > 0 && (
              <TabsContent value="genres" className="pt-2">
                <ChartContainer className="h-[350px]">
                  <Chart className="h-full w-full">
                    <ChartPie data={genreData} dataKey="value" data-namekey="name" cx="50%" cy="50%" outerRadius={100}>
                      {genreData.map((entry, index) => (
                        <ChartPieItem key={`pie-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                    </ChartPie>
                    <ChartLegend layout="vertical" align="right" verticalAlign="middle">
                      {genreData.map((entry, index) => (
                        <ChartLegendItem
                          key={`legend-${entry.name}`}
                          name={entry.name}
                          color={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </ChartLegend>
                  </Chart>
                </ChartContainer>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

