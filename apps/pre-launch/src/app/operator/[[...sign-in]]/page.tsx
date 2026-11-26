import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { OperatorPanel } from "@/components/operator-panel";
import Link from "next/link";

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ "sign-in"?: string[] }>;
}) {
  const enabled =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY &&
    process.env.CLERK_ISSUER &&
    process.env.CLERK_JWT_KEY;
  const route = (await params)["sign-in"];
  if (!enabled)
    return (
      <main className="simple">
        <h1>Operator portal</h1>
        <p>
          Connect the authorized Clerk sandbox to sign in with an invited
          operator account.
        </p>
        <Link href="/">Return to Meduzellar</Link>
      </main>
    );
  return (
    <ClerkProvider>
      <main className="simple">
        <h1>Operator portal</h1>
        {route?.[0] === "sign-in" ? (
          <SignIn
            path="/operator/sign-in"
            routing="path"
            forceRedirectUrl="/operator"
            signUpUrl={undefined}
          />
        ) : (
          <OperatorPanel />
        )}
      </main>
    </ClerkProvider>
  );
}
