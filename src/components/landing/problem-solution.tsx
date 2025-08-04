import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ProblemSolution() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Stop Struggling with Manual Diagram Creation
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your sales team deserves better than hours in Canva or low-quality
            AI diagrams
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Problem */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XMarkIcon className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">
                  Before Diagrammr
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Hours spent</strong> manually creating diagrams in
                    Canva
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Low-quality</strong> AI-generated Mermaid diagrams
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Unprofessional assets</strong> that don't reflect
                    technical expertise
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Difficulty explaining</strong> complex systems to
                    non-technical clients
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-primary">After Diagrammr</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Minutes</strong> to generate professional diagrams
                    from transcripts
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Branded, animated</strong> diagrams ready for client
                    presentations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Professional quality</strong> that showcases
                    Brilliant Noise's expertise
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Clear communication</strong> of technical concepts
                    to any audience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Designed specifically for technical sales presentations
          </Badge>
        </div>
      </div>
    </section>
  )
}
