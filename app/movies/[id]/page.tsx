import { notFound } from "next/navigation"
import MovieDetails from "@/components/movie-details"
import { getMovieByIdWithFallback } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthCheck from "@/components/auth-check"

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movieId = params.id

  try {
    // Use the fallback function to ensure we always get data
    const movie = await getMovieByIdWithFallback(movieId)

    if (!movie || movie.Response === "False") {
      return notFound()
    }

    return (
      <AuthCheck>
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-block mb-6">
              <Button variant="ghost" className="group flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Search
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MovieDetails movie={movie} />
              </div>
              {/* can't get this to work because of the limit of api provider */}
              {/* <div>
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Movie Statistics
                </h2>
                <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                  <MovieStats movie={movie} />
                </Suspense>
              </div> */}
            </div>
          </div>
        </main>
      </AuthCheck>
    )
  } catch (error) {
    console.error("Error in movie page:", error)
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" className="group flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Search
            </Button>
          </Link>

          <div className="max-w-md mx-auto bg-card p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Error Loading Movie</h2>
            <p className="mb-6 text-muted-foreground">
              We encountered an error while trying to load this movie. Please try again later.
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }
}

