export const dynamic = 'force-dynamic';

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <SignUp />
    </div>
  );
}