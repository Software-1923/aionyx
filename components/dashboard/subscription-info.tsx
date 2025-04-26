import { getUserSubscription } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface SubscriptionInfoProps {
  userId: string;
}

export default async function SubscriptionInfo({ userId }: SubscriptionInfoProps) {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return (
      <div className="text-center p-6 space-y-4">
        <Badge variant="outline" className="mb-2">Free Plan</Badge>
        <h3 className="text-xl font-semibold">You don't have an active subscription</h3>
        <p className="text-muted-foreground mb-4">
          Upgrade to a paid plan to unlock all the features and benefits.
        </p>
        <Button asChild>
          <Link href="#plans">
            Explore Plans <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }
  
  const isActive = subscription.status === "active";
  const isPastDue = subscription.status === "past_due";
  const isTrialing = subscription.status === "trialing";
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge 
            variant={isActive ? "default" : "outline"}
            className={isActive ? "bg-success" : isPastDue ? "bg-warning text-warning-foreground" : ""}
          >
            {subscription.plan} Plan
          </Badge>
          <span className="ml-2 text-sm text-muted-foreground">
            ({subscription.status})
          </span>
        </div>
        {isActive && (
          <div className="flex items-center text-success">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span className="text-sm">Active</span>
          </div>
        )}
        {isPastDue && (
          <div className="flex items-center text-warning">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">Payment Required</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Current period ends</span>
          <span>
            {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Subscription ID</span>
          <span className="text-sm font-mono">{subscription.stripeSubscriptionId.substring(0, 14)}...</span>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Plan</span>
          <span>{subscription.plan}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild variant="outline">
          <Link href="https://billing.stripe.com/p/login/test" target="_blank" rel="noopener noreferrer">
            Manage Billing
          </Link>
        </Button>
        
        {isPastDue && (
          <Button asChild>
            <Link href="/dashboard/billing?update-payment=true">
              Update Payment Method
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}