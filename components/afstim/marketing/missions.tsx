const MISSIONS = [
  { title: "Set up your machine", detail: "Tools that a real deploy needs." },
  { title: "Create and commit", detail: "Git is a safety net, not a chore." },
  { title: "Push to GitHub", detail: "Your code lives somewhere that isn't you." },
  { title: "Deploy to Vercel", detail: "A public URL exists." },
  { title: "Add a database", detail: "Real data, not a JSON file." },
  { title: "Env vars in production", detail: "Secrets don't live in code." },
  { title: "Build a real feature", detail: "Form → database → list, in production." },
  { title: "Protect a route", detail: "Not everything is public." },
  { title: "Ship a change", detail: "Push → live in 2 minutes." },
  { title: "Custom domain", detail: "DNS and HTTPS aren't magic. Optional." },
];

function Missions() {
  return (
    <section id="missions" className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
        The ten missions
      </h2>
      <ol className="mt-6 flex flex-col gap-4 font-mono text-[15px]">
        {MISSIONS.map((mission, index) => (
          <li key={mission.title} className="flex gap-4">
            <span className="text-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-text">{mission.title}</p>
              <p className="text-muted">{mission.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export { Missions };
