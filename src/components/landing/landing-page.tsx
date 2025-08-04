import { Header } from './header'
import { HeroSection } from './hero-section'
import { ProblemSolution } from './problem-solution'
import { FeaturesSection } from './features-section'
import { CTASection } from './cta-section'
import { Footer } from './footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSolution />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
