const FAQS = [
  {
    q: "Is this just another course?",
    a: "No. Courses teach you syntax. Afstim assumes you can already code and walks you through the parts nobody teaches — deploying, databases, environment variables, DNS — by making you actually do them on a real project.",
  },
  {
    q: "Why do I need this if I have ChatGPT?",
    a: "You don't need it for answers, you already have those. Afstim knows your exact mission, your exact failing check, and what you've already done, so it never makes you re-explain your situation. It also tells you when you're actually done, which a chat window can't.",
  },
  {
    q: "How long does this take?",
    a: "About 12 hours across ten missions, at your own pace. Most people feel the first real payoff, a live URL, by mission four.",
  },
  {
    q: "Do I need to already know how to deploy anything?",
    a: "No. If you did, you wouldn't need this. You do need to already know how to write code, Afstim isn't where you learn programming from scratch.",
  },
  {
    q: "What if I get stuck?",
    a: "Ask the mentor. It knows which mission you're on and what failed, so you're not starting from zero every time you ask a question.",
  },
  {
    q: "Is my code private?",
    a: "Afstim never sees your code. Everything runs in your own editor and your own deploys, we only see the checks you run and the URLs you tell us about.",
  },
];

function Faq() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
        Questions
      </h2>
      <dl className="mt-6 flex flex-col gap-8">
        {FAQS.map((item) => (
          <div key={item.q}>
            <dt className="text-[15px] font-medium text-text">{item.q}</dt>
            <dd className="mt-2 text-[15px] leading-[1.65] text-muted">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export { Faq };
