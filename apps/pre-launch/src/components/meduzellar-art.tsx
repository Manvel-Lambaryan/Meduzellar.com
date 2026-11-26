const logo = "/art/nr-logo.webp";

export function Monogram({ className }: { className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={logo} alt="" width={512} height={243} />
  );
}

export function MascotMarks({
  className,
  portrait = false,
}: {
  className: string;
  portrait?: boolean;
}) {
  const prefix = portrait ? "portrait" : "stage";
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox={portrait ? "25 94 735 790" : "0 0 1672 941"}
      preserveAspectRatio={portrait ? "none" : "xMidYMid slice"}
    >
      <defs>
        <linearGradient
          id={prefix + "-badge-rim"}
          x1="0"
          x2="85%"
          y1="0"
          y2="100%"
        >
          <stop stopColor="#ccf7ff" />
          <stop offset=".3" stopColor="#2474dd" />
          <stop offset=".66" stopColor="#0d2360" />
          <stop offset=".89" stopColor="#b8efff" />
          <stop offset="1" stopColor="#8471f6" />
        </linearGradient>
        <radialGradient id={prefix + "-badge-face"} cx=".35" cy=".26" r=".79">
          <stop stopColor="#146fb0" />
          <stop offset=".56" stopColor="#0a3167" />
          <stop offset="1" stopColor="#080f36" />
        </radialGradient>
        <filter
          id={prefix + "-badge-light"}
          x="-25%"
          y="-50%"
          width="150%"
          height="200%"
        >
          <feComponentTransfer>
            <feFuncR type="linear" slope="1" intercept=".12" />
            <feFuncG type="linear" slope="1.12" intercept=".12" />
            <feFuncB type="linear" slope="1.06" intercept=".07" />
          </feComponentTransfer>
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="2.5"
            floodColor="#32ceff"
            floodOpacity=".76"
          />
        </filter>
      </defs>
      <g transform="translate(211 354) rotate(-13) skewY(-9)">
        <image
          href={logo}
          x="-25"
          y="-12"
          width="50"
          height="24"
          filter={`url(#${prefix}-badge-light)`}
        />
      </g>
      <g transform="translate(474 449) rotate(-12) skewX(-7)">
        <rect
          x="-30"
          y="-27"
          width="63"
          height="58"
          rx="20"
          fill="#050b31"
          opacity=".68"
        />
        <rect
          x="-30"
          y="-28"
          width="60"
          height="55"
          rx="20"
          fill={`url(#${prefix}-badge-rim)`}
        />
        <rect
          x="-27"
          y="-25"
          width="54"
          height="49"
          rx="17"
          fill={`url(#${prefix}-badge-face)`}
        />
        <path
          d="M-24-10Q-25-23-10-23H10"
          fill="none"
          stroke="#81e7ff"
          strokeOpacity=".55"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <image
          href={logo}
          x="-21"
          y="-10"
          width="42"
          height="20"
          filter={`url(#${prefix}-badge-light)`}
        />
      </g>
    </svg>
  );
}

export function TitleOrbit({ className }: { className: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 680 256"
      fill="none"
    >
      <defs>
        <linearGradient
          id="orbit-back"
          x1="36"
          x2="650"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#408cff" />
          <stop offset=".33" stopColor="#182e9e" stopOpacity=".34" />
          <stop offset=".69" stopColor="#2c55ff" stopOpacity=".8" />
          <stop offset=".9" stopColor="#65cfff" />
          <stop offset="1" stopColor="#aabaff" />
        </linearGradient>
        <linearGradient
          id="orbit-front"
          x1="20"
          x2="660"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f5fdff" />
          <stop offset=".13" stopColor="#4596ff" />
          <stop offset=".42" stopColor="#1c59ea" stopOpacity=".43" />
          <stop offset=".71" stopColor="#336efb" stopOpacity=".77" />
          <stop offset=".9" stopColor="#597bff" />
          <stop offset="1" stopColor="#fff2ff" />
        </linearGradient>
        <filter id="orbit-bloom" x="-10%" y="-80%" width="120%" height="260%">
          <feGaussianBlur stdDeviation="4.6" />
        </filter>
        <path
          id="orbit-back-shape"
          d="M19 117C18 80 169 49 343 47C518 45 654 61 661 97"
        />
        <path
          id="orbit-front-shape"
          d="M19 117C23 151 174 171 344 169C521 166 666 132 661 97"
        />
      </defs>
      <g transform="rotate(-4 340 106)">
        <g filter="url(#orbit-bloom)" strokeWidth="6.6" opacity=".92">
          <use href="#orbit-back-shape" stroke="url(#orbit-back)" />
          <use href="#orbit-front-shape" stroke="url(#orbit-front)" />
        </g>
        <use
          href="#orbit-back-shape"
          stroke="url(#orbit-back)"
          strokeWidth="1.65"
        />
        <use
          href="#orbit-front-shape"
          stroke="url(#orbit-front)"
          strokeWidth="2.15"
        />
        <path
          d="M20 110Q13 127 56 139M628 71Q671 85 659 104M602 132Q616 127 627 121"
          stroke="#b7d8ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M30 128l14 6M649 83l9 8M610 129l10-4"
          stroke="#fff"
          strokeWidth="3.1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
