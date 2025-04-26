"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  
  const plans = [
    {
      name: "Basic",
      description: "Perfect for individuals and small projects.",
      price: isYearly ? 99.99 : 9.99,
      features: [
        "Up to 3 projects",
        "Basic analytics",
        "24-hour support response time",
        "1GB storage"
      ]
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with more needs.",
      price: isYearly ? 299.99 : 29.99,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "4-hour support response time",
        "10GB storage",
        "Custom domain"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex requirements.",
      price: isYearly ? 999.99 : 99.99,
      features: [
        "Unlimited everything",
        "Enterprise-grade security",
        "1-hour support response time",
        "100GB storage",
        "Custom domain",
        "Dedicated account manager"
      ]
    }
  ];
  
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Choose the plan that works best for your needs. All plans include a 14-day free trial.
        </p>
        
        <div className="flex items-center justify-center mb-12">
          <span className={`mr-2 ${!isYearly ? 'font-semibold' : ''}`}>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`ml-2 ${isYearly ? 'font-semibold' : ''}`}>
            Yearly <Badge variant="outline" className="ml-1">Save 15%</Badge>
          </span>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative overflow-hidden flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="m-2 bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                  <span className="text-muted-foreground ml-1">/{isYearly ? 'year' : 'month'}</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/sign-up">
                    Get Started
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}