"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    features: string[];
  };
  price: number;
  interval: "month" | "year";
  highlighted?: boolean;
  userId: string;
}

export default function PricingCard({ plan, price, interval, highlighted = false, userId }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleCheckout = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.id,
          plan: plan.name,
          successUrl: `${window.location.origin}/dashboard/billing?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
          interval,
        }),
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={`flex flex-col ${highlighted ? "border-primary shadow-md" : ""}`}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-3xl font-bold">{formatCurrency(price)}</span>
          <span className="text-muted-foreground ml-1">/{interval}</span>
        </div>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <Check className="h-4 w-4 text-success mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={highlighted ? "default" : "outline"}
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Subscribe to ${plan.name}`}
        </Button>
      </CardFooter>
    </Card>
  );
}