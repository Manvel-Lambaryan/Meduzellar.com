import Link from "next/link";
export default function Privacy() {
  const contact = process.env.LOCAL_PRIVACY_CONTACT;
  return (
    <main className="simple">
      <Link href="/">Meduzellar</Link>
      <h1>Waitlist privacy notice</h1>
      <p>
        This local preview is for synthetic addresses. The waitlist stores an
        encrypted email address, consent and mail delivery records for one
        official launch announcement. It also stores short-lived abuse counters.
        Your email is used to confirm your subscription and, if you give and
        retain consent, to notify you once about the launch.
      </p>
      <p>
        Unsubscribe using the link in your email or paste your code on the{" "}
        <Link href="/unsubscribe">unsubscribe page</Link>. Pending enrollments
        expire after 14 days. Once unsubscribed, contact data is scheduled for
        removal after 30 days.
      </p>
      <p>
        {contact ? (
          <>
            For waitlist support or a deletion request, contact{" "}
            <a href={`mailto:${contact}`}>{contact}</a>.
          </>
        ) : (
          "For local support or a deletion request, contact the person operating this preview."
        )}{" "}
        Confirm a deletion request on the{" "}
        <Link href="/verify-deletion">privacy verification page</Link>.
      </p>
    </main>
  );
}
