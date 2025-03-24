import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, Award, Star, Film, Globe, Users } from "lucide-react"
import type { MovieDetail } from "@/types/movie"

interface MovieDetailsProps {
  movie: MovieDetail
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  // Safely access nested properties with fallbacks
  const ratings = movie.Ratings || []
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg?height=600&width=400"

  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <div className="relative h-[200px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${poster})`,
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center px-4">{movie.Title || "Movie Details"}</h1>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="relative h-[450px] w-[300px] mx-auto lg:mx-0 flex-shrink-0">
            {poster ? (
              <div className="relative h-full w-full rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={poster || "/placeholder.svg"}
                  alt={movie.Title || "Movie poster"}
                  fill
                  className="object-cover"
                  sizes="300px"
                  priority
                />
              </div>
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center rounded-lg">
                <Film className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.Year && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">{movie.Year}</span>
                </div>
              )}

              {movie.Runtime && movie.Runtime !== "N/A" && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">{movie.Runtime}</span>
                </div>
              )}

              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{movie.imdbRating}/10</span>
                </div>
              )}

              {movie.Rated && movie.Rated !== "N/A" && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <span className="text-sm font-medium">{movie.Rated}</span>
                </div>
              )}
            </div>

            {movie.Genre && movie.Genre !== "N/A" && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(", ").map((genre) => (
                    <Badge key={genre} variant="secondary" className="px-3 py-1 text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {movie.Plot && movie.Plot !== "N/A" && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Plot</h2>
                <p className="text-muted-foreground leading-relaxed">{movie.Plot}</p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.Director && movie.Director !== "N/A" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Director</h3>
                  </div>
                  <p className="text-muted-foreground pl-6">{movie.Director}</p>
                </div>
              )}

              {movie.Writer && movie.Writer !== "N/A" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Writer</h3>
                  </div>
                  <p className="text-muted-foreground pl-6">{movie.Writer}</p>
                </div>
              )}

              {movie.Actors && movie.Actors !== "N/A" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Actors</h3>
                  </div>
                  <p className="text-muted-foreground pl-6">{movie.Actors}</p>
                </div>
              )}

              {movie.Language && movie.Language !== "N/A" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Language</h3>
                  </div>
                  <p className="text-muted-foreground pl-6">{movie.Language}</p>
                </div>
              )}
            </div>

            {ratings.length > 0 && (
              <>
                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Ratings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <h4 className="font-medium text-sm mb-1">{rating.Source}</h4>
                        <p className="text-lg font-bold text-primary">{rating.Value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

