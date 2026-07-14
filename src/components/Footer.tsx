import { Logo } from "./Logo";

/*
  Everything rational lives down here, out of the story's way: the entity, the
  law, the links. Indian buyers scan a footer for exactly this.
*/
export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-green">
          <Logo className="h-[19px] w-auto" />
          {/*
            The DPDP citation lives here, not in the trust section.

            A statute is a fact about paperwork, and nobody ever trusted a
            company because of paperwork — so the trust section closes on the
            promise instead. But the Act should not vanish: almost no Indian
            consumer app names it, and naming it reads as confidence. A footer is
            exactly where a legal citation belongs, and Indian buyers scan one
            for precisely this.
          */}
          <p className="mt-5 max-w-[34ch] text-[12.5px] leading-relaxed text-ink/35">
            A consumer product by Equal Identity Private Limited, Hyderabad.
            Personal data handled under the DPDP Act, 2023.
          </p>
        </div>

        {/* -my-3 keeps the visual rhythm while the hit area reaches 44px */}
        <div className="-my-3 flex flex-wrap gap-x-5 gap-y-0">
          {["Privacy", "Terms", "Security", "Pricing", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-[13px] text-ink/40 transition-colors hover:text-green"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
