import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  User, 
  Menu,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-3" />,
      href: "/dashboard",
      active: true,
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-5 w-5 mr-3" />,
      href: "/dashboard/billing",
      active: false,
    },
    {
      label: "Profile",
      icon: <User className="h-5 w-5 mr-3" />,
      href: "/dashboard/profile",
      active: false,
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5 mr-3" />,
      href: "/dashboard/settings",
      active: false,
    },
  ];
  
  return (
    <div className="relative min-h-screen">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 right-4 z-50">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="pt-4 h-full flex flex-col">
            <div className="flex items-center pl-2 mb-6">
              <Zap className="h-6 w-6 mr-2 text-primary" />
              <span className="font-bold text-xl">Aionyx</span>
            </div>
            
            <div className="flex flex-col space-y-2">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={route.href === '/dashboard' ? "secondary" : "ghost"}
                  className="justify-start"
                  asChild
                >
                  <Link href={route.href}>
                    {route.icon}
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex min-w-[280px] fixed left-0 min-h-screen bg-muted/20 border-r">
        <div className="flex flex-col w-full pt-6">
          <div className="flex items-center pl-6 mb-6">
            <Zap className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold text-xl">Aionyx</span>
          </div>
          
          <div className="flex flex-col space-y-2 px-3">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === '/dashboard' ? "secondary" : "ghost"}
                className="justify-start"
                asChild
              >
                <Link href={route.href}>
                  {route.icon}
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
          
          <div className="mt-auto px-6 py-4 border-t">
            <div className="flex items-center mb-3">
              <UserButton />
              <div className="ml-4">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-[280px]">
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}