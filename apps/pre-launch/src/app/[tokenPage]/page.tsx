import { notFound } from "next/navigation";
import Link from "next/link";
import { TokenAction } from "@/components/token-action";

export default async function TokenPage({
  params,
}: {
  params: Promise<{ tokenPage: string }>;
}) {
  const { tokenPage } = await params;
  if (
    tokenPage !== "verify" &&
    tokenPage !== "unsubscribe" &&
    tokenPage !== "verify-deletion"
  )
    notFound();
  const heading = {
    verify: "Confirm your email",
    unsubscribe: "Unsubscribe from Meduzellar",
    "verify-deletion": "Confirm your deletion request",
  }[tokenPage];
  return (
    <main className="simple">
      <h1>{heading}</h1>
      <p>Use the code included in your email to confirm this request.</p>
      <TokenAction action={tokenPage} />
      <Link href="/privacy">Waitlist privacy and support</Link>
    </main>
  );
}
