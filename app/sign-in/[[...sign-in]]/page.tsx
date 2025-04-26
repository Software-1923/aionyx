export const dynamic = 'force-dynamic';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <SignIn />
    </div>
  );
}