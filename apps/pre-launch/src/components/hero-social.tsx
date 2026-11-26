import styles from "@/app/hero.module.css";

const platforms = [
  {
    name: "Instagram",
    env: "SOCIAL_INSTAGRAM",
    hosts: ["instagram.com", "www.instagram.com"],
    icon: (
      <>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="3.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17" cy="7" r="1" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    env: "SOCIAL_LINKEDIN",
    hosts: ["linkedin.com", "www.linkedin.com"],
    icon: (
      <path d="M4 9h3.4v11H4V9Zm1.7-5A1.9 1.9 0 1 0 5.7 7.8 1.9 1.9 0 0 0 5.7 4ZM10 9h3.3v1.5a3.7 3.7 0 0 1 3.3-1.8c3.5 0 4 2.2 4 5.1V20h-3.4v-5.5c0-1.3-.1-2.8-1.8-2.8-1.8 0-2 1.4-2 2.7V20H10V9Z" />
    ),
  },
  {
    name: "GitHub",
    env: "SOCIAL_GITHUB",
    hosts: ["github.com", "www.github.com"],
    icon: (
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.48.1.66-.2.66-.46v-1.67c-2.67.58-3.24-1.13-3.24-1.13-.44-1.1-1.07-1.39-1.07-1.39-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.47 2.25 1.05 2.8.81.09-.62.33-1.05.6-1.29-2.13-.24-4.38-1.07-4.38-4.75 0-1.05.38-1.91.99-2.58-.1-.24-.43-1.22.1-2.54 0 0 .81-.26 2.64.99A9.2 9.2 0 0 1 12 7.07c.8 0 1.6.11 2.35.32 1.83-1.25 2.64-.99 2.64-.99.53 1.32.2 2.3.1 2.54.61.67.98 1.53.98 2.58 0 3.69-2.25 4.5-4.39 4.74.35.3.66.88.66 1.77v2.51c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z" />
    ),
  },
  {
    name: "YouTube",
    env: "SOCIAL_YOUTUBE",
    hosts: ["youtube.com", "www.youtube.com", "youtu.be"],
    icon: (
      <path
        d="M21.2 7.3a2.5 2.5 0 0 0-1.8-1.8C17.8 5 12 5 12 5s-5.8 0-7.4.5a2.5 2.5 0 0 0-1.8 1.8 27 27 0 0 0 0 9.4 2.5 2.5 0 0 0 1.8 1.8c1.6.5 7.4.5 7.4.5s5.8 0 7.4-.5a2.5 2.5 0 0 0 1.8-1.8 27 27 0 0 0 0-9.4ZM10 15.4V8.6l6 3.4-6 3.4Z"
        fillRule="evenodd"
      />
    ),
  },
  {
    name: "Telegram",
    env: "SOCIAL_TELEGRAM",
    hosts: ["t.me", "telegram.me"],
    icon: (
      <path
        d="M21.4 3.8 2.6 11.2c-.8.3-.8.9-.1 1.1l4.8 1.5 1.9 5.7c.2.6.5.7 1 .2l2.7-2.6 5 3.7c.7.5 1.2.2 1.4-.6l3.2-15.3c.2-.9-.3-1.4-1.1-1.1ZM8.2 13.4l10.4-6.6c.5-.3.6-.1.2.3l-8.3 7.5-.4 3.5-1.9-4.7Z"
        fillRule="evenodd"
      />
    ),
  },
];

function configuredUrl(value: string | undefined, hosts: readonly string[]) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      hosts.includes(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname !== "/"
    )
      return url.href;
  } catch {
    // Omit malformed configuration.
  }
}

export function HeroSocial({ preview }: { preview: boolean }) {
  const items = platforms
    .map(({ env, hosts, ...platform }) => ({
      ...platform,
      href: configuredUrl(process.env[env], hosts),
    }))
    .filter((platform) => platform.href || preview);
  if (!items.length) return null;
  return (
    <nav
      className={styles.social}
      aria-label={preview ? "Social media development preview" : "Social media"}
    >
      <p>Stay up to date</p>
      <ul>
        {items.map(({ name, href, icon }) => {
          const graphic = (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {icon}
            </svg>
          );
          return (
            <li key={name}>
              {href ? (
                <a href={href} aria-label={name}>
                  {graphic}
                </a>
              ) : (
                <span
                  role="img"
                  aria-label={name + " preview"}
                  title={name + " preview"}
                >
                  {graphic}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
