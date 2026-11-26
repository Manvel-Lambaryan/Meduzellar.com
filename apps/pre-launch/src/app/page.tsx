import { headers } from "next/headers";
import { WaitlistForm } from "@/components/waitlist";
import { MascotMarks, Monogram, TitleOrbit } from "@/components/meduzellar-art";
import { HeroSocial } from "@/components/hero-social";
import { WheelZoomGuard } from "@/components/wheel-zoom-guard";
import styles from "./hero.module.css";

const cards = [
  { name: "Marketplace", icon: "marketplace" },
  { name: "Jobs", icon: "jobs" },
  { name: "Communication", icon: "communication" },
] as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ "social-preview"?: string | string[] }>;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const preview =
    process.env.NODE_ENV === "development" &&
    (await searchParams)["social-preview"] === "1";
  return (
    <WheelZoomGuard className={styles.hero}>
      <div className={styles.scene} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/art/stage.webp"
          loading="lazy"
          alt=""
          fetchPriority="high"
          width="1672"
          height="941"
        />
        <MascotMarks className={styles.marks} />
      </div>
      <div className={styles.content}>
        <header className={styles.brand}>
          <Monogram className={styles.mark} />
          <span className={styles.wordmark}>
            <span>Meduzellar</span>
            <small>Technology Ecosystem</small>
          </span>
        </header>
        <div className={styles.intro}>
          <h1 className={styles.title}>
            <TitleOrbit className={styles.orbit} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.titleArt}
              src="/art/coming-soon.webp"
              srcSet="/art/coming-soon-compact.webp 560w, /art/coming-soon.webp 1112w"
              sizes="(max-width: 580px) 75vw, (max-width: 900px) 390px, 31vw"
              alt=""
              aria-hidden="true"
              width="1112"
              height="550"
              fetchPriority="high"
            />
            <span className={styles.titleText}>Coming Soon</span>
          </h1>
          <p className={styles.description}>
            <span>A next-generation technology ecosystem</span>{" "}
            <span>that connects people, talent, businesses, and ideas.</span>
          </p>
        </div>
        <div className={styles.mascot} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/art/meduza.webp"
            loading="lazy"
            alt=""
            width="660"
            height="709"
          />
          <MascotMarks className={styles.marks} portrait />
        </div>
        <WaitlistForm
          className={styles.signup}
          siteKey={process.env.TURNSTILE_SITE_KEY ?? ""}
          nonce={nonce}
        />
        <ul className={styles.cards} aria-label="Coming capabilities">
          {cards.map(({ name, icon }) => (
            <li key={name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cardIcon}
                src={`/art/features/${icon}.webp`}
                alt=""
                width={144}
                height={144}
              />
              <span>{name}</span>
            </li>
          ))}
        </ul>
        <HeroSocial preview={preview} />
      </div>
    </WheelZoomGuard>
  );
}
