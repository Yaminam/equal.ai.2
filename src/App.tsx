import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Atmosphere } from "./components/Atmosphere";
import { useSmoothScroll } from "./lib/useSmoothScroll";

import { Stage } from "./components/Stage";
import { Idea } from "./components/Idea";
import { Category } from "./components/Category";
import { Aspire } from "./components/Aspire";
import { Proof } from "./components/Proof";
import { Greeting } from "./components/Greeting";
import { Voices } from "./components/Voices";
import { Creed } from "./components/Creed";
import { Invitation } from "./components/Invitation";
import { Footer } from "./components/Footer";

/*
  One idea, executed once.

  A phone pins to the screen and never leaves. Your scroll moves the story
  across it, and the story is about a person, not a product:

    Your phone belongs to strangers. It was never meant to. Once, only the
    powerful had someone to answer for them. Now something answers in your
    name, it reports only to you, and when your mother calls, your phone rings.

  Then the page names the category by what it refuses to be, hands the reader
  the privilege in the present tense, proves it with one number, lets them hear
  the assistant speak, shows them who else is inside, states its terms, and
  opens the door.

  There is nothing here to operate. No demo to drive, no chips to click, no
  toasts. A visitor should finish this page wanting in, not understanding a
  feature list. If a thing on this page can be *used*, it does not belong.

  Grounds alternate deliberately: the Stage resolves to canvas, Category holds
  it, the dark chapter (Aspire -> Proof) is the aspiration, Greeting warms back
  up on sand, and Creed goes dark one last time so the door opens into light.
*/
export default function App() {
  useSmoothScroll();

  return (
    <div className="grain relative min-h-[100dvh]">
      <Loader />
      {/* the one thing alive while you sit still */}
      <Atmosphere />
      <Nav />

      <main className="relative z-10">
        {/* the story. six beats, one object. nothing to operate. */}
        <Stage />

        {/* the whole product in one picture: noise in, silence out, she gets through */}
        <Idea />

        {/* what it is, said by what it is not */}
        <Category />

        {/* the dark chapter: why you want in, and the number that proves it */}
        <Aspire />
        <Proof />

        {/* the assistant, in its own voice */}
        <Greeting />

        {/* the people you would be joining */}
        <Voices />

        {/* the terms, then the door */}
        <Creed />
        <Invitation />
      </main>

      <Footer />
    </div>
  );
}
