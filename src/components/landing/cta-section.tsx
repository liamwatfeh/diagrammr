import {
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent-foreground/90" />

          <CardContent className="relative px-6 py-16 sm:px-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Transform Your Sales Presentations?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
                Join Brilliant Noise's sales team in creating professional,
                client-ready diagrams in minutes instead of hours.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Start Creating Diagrams
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  View Demo
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/90">
                  <ClockIcon className="h-4 w-4" />
                  <span>Setup in minutes</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/90">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>No training required</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/90">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Client-ready output</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
