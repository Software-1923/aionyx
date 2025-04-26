'use client';

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthNav() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  );
}