import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-primary/10 text-primary"
          >
            Transform Technical Conversations
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            From Transcripts to{' '}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Professional Diagrams
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            Drop in a technical conversation transcript and receive polished,
            client-ready animated diagrams in minutes. Built specifically for
            Brilliant Noise's sales team.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group">
              Get Started
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button variant="outline" size="lg" className="group">
              <PlayIcon className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            Reduce diagram creation from <strong>hours to minutes</strong> •
            Export as animated GIFs or static PNGs
          </div>
        </div>
      </div>
    </section>
  )
}
