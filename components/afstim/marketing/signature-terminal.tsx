"use client";

import * as React from "react";

import { CheckRow } from "@/components/afstim/check-row";
import { Terminal, TerminalLine } from "@/components/afstim/terminal";

const CHECKS = [
  "Your app builds without errors",
  "Your URL responds from the public internet",
  "HTTPS is working with a valid certificate",
];

const STAGGER_MS = 200;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function SignatureTerminal() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasTriggered = React.useRef(false);
  const [scrollResolvedCount, setScrollResolvedCount] = React.useState(0);
  const [scrollVerified, setScrollVerified] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const node = containerRef.current;
    if (!node) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTriggered.current) return;
        hasTriggered.current = true;
        observer.disconnect();

        CHECKS.forEach((_, index) => {
          timeouts.push(
            setTimeout(() => {
              setScrollResolvedCount(index + 1);
              if (index === CHECKS.length - 1) {
                timeouts.push(
                  setTimeout(() => setScrollVerified(true), STAGGER_MS)
                );
              }
            }, index * STAGGER_MS)
          );
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReducedMotion]);

  const resolvedCount = prefersReducedMotion ? CHECKS.length : scrollResolvedCount;
  const verified = prefersReducedMotion ? true : scrollVerified;

  return (
    <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <div ref={containerRef}>
        <Terminal>
          <TerminalLine>npx afstim check</TerminalLine>
          <div className="mt-3 flex flex-col gap-2">
            <p>▸ Mission 4 — Deploy to Vercel</p>
            <div className="flex flex-col gap-1 pl-4">
              {CHECKS.map((label, index) => (
                <CheckRow
                  key={label}
                  state={index < resolvedCount ? "pass" : "pending"}
                  label={label}
                />
              ))}
            </div>
            {verified ? <p className="pl-4">Mission verified.</p> : null}
          </div>
        </Terminal>
      </div>
    </section>
  );
}

export { SignatureTerminal };
