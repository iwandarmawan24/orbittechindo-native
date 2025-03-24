import { Suspense } from "react"
import MovieCarousel from "@/components/movie-carousel"
import MovieMasonry from "@/components/movie-masonry"
import SearchBar from "@/components/search-bar"
import FilterSection from "@/components/filter-section"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Movie Explorer
        </h1>

        <div className="mb-12">
          <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
            <MovieCarousel />
          </Suspense>
        </div>

        <div className="mb-8 max-w-3xl mx-auto">
          <SearchBar />
        </div>

        <div className="mb-12 max-w-4xl mx-auto">
          <FilterSection />
        </div>

        <div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-[350px] rounded-xl" />
                  ))}
              </div>
            }
          >
            <MovieMasonry />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

