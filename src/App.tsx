import { Loader } from "./components/Loader";
import { CursorSpotlight } from "./components/CursorSpotlight";
import { ScrollProgress } from "./components/ScrollProgress";
import { AmbientCalls } from "./components/AmbientCalls";
import { CallerSandbox } from "./components/CallerSandbox";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { LiveCounter } from "./components/LiveCounter";
import { PrivacyWedge } from "./components/PrivacyWedge";
import { CallStudio } from "./components/CallStudio";
import { Features } from "./components/Features";
import { PinnedPhone } from "./components/PinnedPhone";
import { LanguagePlayground } from "./components/LanguagePlayground";
import { LiveFeed } from "./components/LiveFeed";
import { Metrics } from "./components/Metrics";
import { Comparison } from "./components/Comparison";
import { RulesBuilder } from "./components/RulesBuilder";
import { WhyEqual } from "./components/WhyEqual";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { Waitlist } from "./components/Waitlist";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="grain relative min-h-[100dvh]">
      <Loader />
      <CursorSpotlight />
      <ScrollProgress />
      {/* the page answers the phone while you read it */}
      <AmbientCalls />
      <Nav />
      <main className="relative z-10">
        {/* split hero */}
        <Hero />
        {/* thin band */}
        <LiveCounter />
        {/* tinted chapter */}
        <PrivacyWedge />
        {/* tabbed scenario player: watch it */}
        <CallStudio />
        {/* the input becomes the demo: now try it */}
        <CallerSandbox />
        {/* bento */}
        <Features />
        {/* sticky phone */}
        <PinnedPhone />
        {/* playground */}
        <LanguagePlayground />
        {/* centered stream */}
        <LiveFeed />
        {/* hairline metric grid */}
        <Metrics />
        {/* bar chart + three columns */}
        <Comparison />
        {/* playground */}
        <RulesBuilder />
        {/* sticky index */}
        <WhyEqual />
        {/* card grid, tinted chapter */}
        <Testimonials />
        {/* split */}
        <Pricing />
        {/* accordion */}
        <FAQ />
        {/* centered close */}
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
