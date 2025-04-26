import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from "@/components/stripe/pricing-card";
import { getUserSubscription } from "@/lib/db";
import SubscriptionInfo from "@/components/dashboard/subscription-info";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default async function BillingPage() {
  const user = await currentUser();
  
  const plans = [
    {
      id: "price_basic",
      name: "Basic",
      description: "Perfect for individuals and small projects.",
      price: 9.99,
      features: [
        "Up to 3 projects",
        "Basic analytics",
        "24-hour support response time",
        "1GB storage"
      ],
      monthlyPrice: 9.99,
      yearlyPrice: 99.99
    },
    {
      id: "price_pro",
      name: "Professional",
      description: "Ideal for growing businesses with more needs.",
      price: 29.99,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "4-hour support response time",
        "10GB storage",
        "Custom domain"
      ],
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      highlighted: true
    },
    {
      id: "price_enterprise",
      name: "Enterprise",
      description: "For large organizations with complex requirements.",
      price: 99.99,
      features: [
        "Unlimited everything",
        "Enterprise-grade security",
        "1-hour support response time",
        "100GB storage",
        "Custom domain",
        "Dedicated account manager"
      ],
      monthlyPrice: 99.99,
      yearlyPrice: 999.99
    }
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>
      
      <Tabs defaultValue="subscription" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscription">Current Subscription</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                View and manage your current subscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <SubscriptionInfo userId={user?.id || ""} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose the plan that's right for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly" className="w-full mb-8">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (Save 15%)</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                      <PricingCard 
                        key={plan.id} 
                        plan={plan}
                        price={plan.monthlyPrice}
                        interval="month"
                        highlighted={plan.highlighted}
                        userId={user?.id || ""}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="yearly">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                      <PricingCard 
                        key={plan.id} 
                        plan={plan}
                        price={plan.yearlyPrice}
                        interval="year"
                        highlighted={plan.highlighted}
                        userId={user?.id || ""}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                All plans include a 14-day free trial. No credit card required until the trial ends.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}