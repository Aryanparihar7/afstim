const REASONS = [
  "You've finished courses but never shipped.",
  "You have projects on GitHub that nobody can open.",
  "You've never bought a domain, and you're not sure what DNS is.",
];

function WhoItsFor() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
        This is for you if
      </h2>
      <ul className="mt-6 flex flex-col gap-3 text-[15px] leading-[1.65] text-text">
        {REASONS.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </section>
  );
}

export { WhoItsFor };
