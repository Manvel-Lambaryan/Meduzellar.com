import Link from "next/link";
import { accepted } from "@/lib/content";
export default function Result() {
  return (
    <main className="simple">
      <h1>Waitlist request received</h1>
      <p>{accepted}</p>
      <Link href="/">Return to Meduzellar</Link>
    </main>
  );
}
