import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Zap, Wallet } from "lucide-react";
import PricingSection from "@/components/landing/pricing-section";
import Footer from "@/components/landing/footer";
import AuthNav from "@/components/auth/auth-nav";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Aionyx</span>
          </Link>
          <AuthNav />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animated-gradient">
              Supercharge Your Business
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              The ultimate platform for building and scaling your business operations. Powerful tools, simplified.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="/sign-up">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 sm:py-32">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Lightning Fast</h3>
            <p className="mt-2 text-muted-foreground">
              Built with performance in mind to provide instant results and a seamless user experience.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <ShieldCheck className="h-6 w-6 text-success" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Enterprise Security</h3>
            <p className="mt-2 text-muted-foreground">
              Bank-grade security with end-to-end encryption and compliance with international standards.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Easy Integration</h3>
            <p className="mt-2 text-muted-foreground">
              Connects seamlessly with your existing tools and workflows with minimal setup time.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}