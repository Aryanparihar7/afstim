import type { Metadata } from "next";

import { Faq } from "@/components/afstim/marketing/faq";
import { Hero } from "@/components/afstim/marketing/hero";
import { HowItWorks } from "@/components/afstim/marketing/how-it-works";
import { Missions } from "@/components/afstim/marketing/missions";
import { Outcome } from "@/components/afstim/marketing/outcome";
import { SignatureTerminal } from "@/components/afstim/marketing/signature-terminal";
import { WhoItsFor } from "@/components/afstim/marketing/who-its-for";

export const metadata: Metadata = {
  title: "Afstim — You can code. You've never shipped.",
  description:
    "Ten missions. Your own editor. A live URL with your name on it.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <SignatureTerminal />
      <Outcome />
      <Missions />
      <HowItWorks />
      <WhoItsFor />
      <Faq />
    </>
  );
}
