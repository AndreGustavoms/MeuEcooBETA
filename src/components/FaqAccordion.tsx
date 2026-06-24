import { useState } from 'react';
import { faqs } from '../data/content';
import EmailCTA from './EmailCTA';

/** Lista de perguntas frequentes em accordion, com um CTA repetido ao final. */
export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-b-8 border-black/60 bg-ink-900 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-3xl font-bold sm:text-5xl">
          Perguntas frequentes
        </h2>

        <ul className="mt-10 space-y-2">
          {faqs.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <li key={faq.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between bg-ink-700 px-6 py-5 text-left text-lg font-medium transition hover:bg-ink-800 sm:text-xl"
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 text-2xl text-ecoo-400">{isOpen ? '×' : '+'}</span>
                </button>
                <div
                  className={`grid overflow-hidden bg-ink-700/60 transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0">
                    <p className="px-6 py-5 text-base text-white/80 sm:text-lg">{faq.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-12 max-w-xl text-center">
          <EmailCTA />
        </div>
      </div>
    </section>
  );
}
