import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              D
            </div>
            <span className="text-xl font-bold text-foreground">Diagrammr</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              3.0
            </Badge>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Link href="/login">
              <Button size="sm">Developer Start</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
