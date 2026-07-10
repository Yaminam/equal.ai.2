import { Logo } from "./Logo";

/*
  Indian users are trained to scan a footer for the legal entity and the
  regulator. Zerodha prints its SEBI numbers; Jupiter names RBI and DICGC in
  plain sentences. So we name the entity, the city, and the data law.
*/

const GROUPS = [
  { title: "Product", links: ["How it works", "Languages", "Pricing", "Security"] },
  { title: "Company", links: ["About Equal", "Press", "Careers", "Contact"] },
  { title: "Legal", links: ["Privacy policy", "Terms", "Grievance redressal", "Withdraw consent"] },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper/60">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center text-green">
              <Logo className="h-[19px] w-auto" />
            </div>
            <p className="mt-4 max-w-[32ch] text-[14px] leading-relaxed text-ink/45">
              An AI call assistant for India's busiest. It answers, so you do not
              have to.
            </p>
            <p className="mt-6 text-[12.5px] leading-relaxed text-ink/35">
              A consumer product by Equal Identity Private Limited, Hyderabad.
            </p>
          </div>

          {GROUPS.map((g) => (
            <div key={g.title}>
              <h4 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/35">
                {g.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[14px] text-ink/60 transition-colors hover:text-green">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[13px] text-ink/40">
            © 2026 Equal Identity Private Limited. Handled under the DPDP Act, 2023.
          </p>
          <p className="text-[13px] text-ink/40">
            Made with <span className="text-green">♥</span> in Hyderabad, India
          </p>
        </div>
      </div>
    </footer>
  );
}
