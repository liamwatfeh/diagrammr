import {
  DocumentTextIcon,
  CpuChipIcon,
  PencilIcon,
  PresentationChartLineIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Transcript Processing',
    description:
      'Paste technical conversation transcripts and let AI understand your system architecture.',
    badge: 'Smart Input',
  },
  {
    icon: CpuChipIcon,
    title: 'AI Diagram Generation',
    description:
      'Automatically generate branded, animated diagrams that fit your specific product.',
    badge: 'AI Powered',
  },
  {
    icon: PencilIcon,
    title: 'Manual Editing',
    description:
      'Refine AI-generated diagrams with intuitive editing tools. Add, change, or remove elements.',
    badge: 'Full Control',
  },
  {
    icon: PresentationChartLineIcon,
    title: 'Presentation Mode',
    description:
      'Full-screen presentation mode optimized for live client calls and screen sharing.',
    badge: 'Client Ready',
  },
  {
    icon: ArrowDownTrayIcon,
    title: 'Export Options',
    description:
      'Export as animated GIFs for presentations or static PNGs for documentation.',
    badge: 'Versatile Output',
  },
  {
    icon: SparklesIcon,
    title: 'Brilliant Noise Branding',
    description:
      'Every diagram reflects your professional brand standards and technical expertise.',
    badge: 'Branded',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything Your Sales Team Needs
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Built specifically for technical sales presentations with up to 25
            nodes per diagram
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-md transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <Badge
            variant="outline"
            className="bg-accent/10 text-accent-foreground"
          >
            Optimized for laptop screens and video conferencing
          </Badge>
        </div>
      </div>
    </section>
  )
}
