import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowUpRight, Activity, CreditCard, Clock } from "lucide-react";
import { currentUser } from "@clerk/nextjs";
import { getUserSubscription } from "@/lib/db";
import { formatCurrency } from "@/utils/format-currency";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PaymentHistory from "@/components/dashboard/payment-history";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/dashboard/billing">
              Manage Subscription
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <SubscriptionStatusCard userId={user?.id} />
            </Suspense>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-sm text-success">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>+8% from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Data Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">240MB <span className="text-sm text-muted-foreground font-normal">/ 5GB</span></div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "5%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{formatCurrency(29)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Due in 15 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View all your past transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentHistory userId={user?.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SubscriptionStatusCard({ userId }: { userId: string | undefined }) {
  if (!userId) return null;
  
  const subscription = await getUserSubscription(userId);
  
  let status = "Free Plan";
  let statusColor = "text-muted-foreground";
  let icon = <Activity className="h-4 w-4 mr-1 text-muted-foreground" />;
  
  if (subscription) {
    status = subscription.status === "active" 
      ? `${subscription.plan} Plan` 
      : `${subscription.plan} (${subscription.status})`;
    
    if (subscription.status === "active") {
      statusColor = "text-success";
      icon = <CheckCircle2 className="h-4 w-4 mr-1 text-success" />;
    } else if (subscription.status === "past_due") {
      statusColor = "text-warning";
      icon = <CreditCard className="h-4 w-4 mr-1 text-warning" />;
    }
  }
  
  return (
    <>
      <div className="text-2xl font-bold">{status}</div>
      <div className={`flex items-center text-sm ${statusColor} mt-2`}>
        {icon}
        {subscription && subscription.currentPeriodEnd 
          ? `Renews ${new Date(Number(subscription.currentPeriodEnd)).toLocaleDateString()}` 
          : "Upgrade for more features"}
      </div>
    </>
  );
}