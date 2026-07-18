import Link from "next/link";

const LINKS = [
  { href: "/feedback", label: "Feedback" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-4 px-4 py-12 sm:flex-row sm:justify-between sm:px-6">
        <span className="font-mono text-[11px] text-subtle">Afstim</span>
        <nav aria-label="Footer" className="flex gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export { Footer };
