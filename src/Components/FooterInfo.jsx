import { Logo } from "./Logo";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com", icon: "gh" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "X / Twitter", href: "https://x.com", icon: "x" },
  { label: "YouTube", href: "https://youtube.com", icon: "yt" },
];

const ICONS = {
  gh: (
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.75c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.9-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .28.18.6.69.5A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
  ),
  in: (
    <path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.4c0-3.57 4.6-3.86 4.6 0V21H21v-7.36c0-5.78-6.32-5.57-7.68-2.72V8.48z" />
  ),
  x: (
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6.3L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
  ),
  yt: (
    <path d="M23 12s0-3.5-.45-5.15a3 3 0 0 0-2.1-2.1C18.8 4.3 12 4.3 12 4.3s-6.8 0-8.45.45a3 3 0 0 0-2.1 2.1C1 8.5 1 12 1 12s0 3.5.45 5.15a3 3 0 0 0 2.1 2.1C5.2 19.7 12 19.7 12 19.7s6.8 0 8.45-.45a3 3 0 0 0 2.1-2.1C23 15.5 23 12 23 12zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  ),
};

export function FooterInfo() {
  return (
    <div className="tc-footer-info">
      <Logo variant="white" size="md" />
      <p className="tc-footer-info__tagline">
        Aprende a programar con cursos prácticos, guías escritas por
        desarrolladores reales y una comunidad que sigue el ritmo de la
        industria.
      </p>

      <div className="tc-footer-info__socials">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="tc-footer-info__social-btn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              {ICONS[s.icon]}
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
