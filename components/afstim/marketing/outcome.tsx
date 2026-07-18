const OUTCOMES = [
  "A live URL",
  "HTTPS",
  "A real database",
  "Environment variables in production",
  "A deploy pipeline",
  "A repo you can show someone",
];

function Outcome() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
        What you&rsquo;ll have at the end
      </h2>
      <ul className="mt-6 flex flex-col gap-3 font-mono text-[15px] text-text">
        {OUTCOMES.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-subtle" aria-hidden="true">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export { Outcome };
