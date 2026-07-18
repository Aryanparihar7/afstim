const COLUMNS = [
  {
    title: "Your editor",
    detail: "You write code in VS Code, on your own machine, like a real job.",
  },
  {
    title: "Our checks",
    detail:
      "A CLI verifies what you built actually works, not that it looks like it does.",
  },
  {
    title: "A mentor who knows the mission",
    detail:
      "It already knows which mission you're on and what failed, so you never re-explain.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
        How it works
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="font-mono text-[13px] text-text">{column.title}</p>
            <p className="mt-2 text-[15px] leading-[1.65] text-muted">
              {column.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export { HowItWorks };
