import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/landing/feature-card";
import { CheckCircle2, ShieldCheck, Zap, Wallet } from "lucide-react";
import PricingSection from "@/components/landing/pricing-section";
import Footer from "@/components/landing/footer";
import AuthNav from "@/components/auth/auth-nav";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center font-bold text-xl">
              <Zap className="h-6 w-6 mr-2 text-primary" />
              Aionyx
            </Link>
          </div>
          <AuthNav />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animated-gradient">
            Supercharge Your Business
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The ultimate platform for building and scaling your business operations. Powerful tools, simplified.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features for Modern Businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Lightning Fast"
              description="Built with performance in mind to provide instant results and a seamless user experience."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-success" />}
              title="Enterprise Security"
              description="Bank-grade security with end-to-end encryption and compliance with international standards."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="h-8 w-8 text-accent" />}
              title="Easy Integration"
              description="Connects seamlessly with your existing tools and workflows with minimal setup time."
            />
            <FeatureCard 
              icon={<Wallet className="h-8 w-8 text-warning" />}
              title="Cost Effective"
              description="Pay only for what you use with plans that scale with your business needs."
            />
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