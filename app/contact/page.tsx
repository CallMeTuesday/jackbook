export const metadata = { title: 'Contact — Jackbook' }

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Get in Touch</h1>
        <p className="text-zinc-400 leading-relaxed">We're a small project and we read everything.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">General questions</h2>
        <p className="text-zinc-300 leading-relaxed">
          For anything not covered in the{' '}
          <a href="/faq" className="text-violet-400 hover:text-violet-300 transition-colors">FAQ</a>{' '}
          —{' '}
          <a href="mailto:contact@jackbook.app" className="text-violet-400 hover:text-violet-300 transition-colors">
            contact [at] jackbook.app
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Submitting historical or originator information</h2>
        <p className="text-zinc-300 leading-relaxed">
          If you have knowledge about a move's history, origin, or regional name that isn't reflected on the site, we want to hear from you. Accuracy is the whole point.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Legacy contributor pathway</h2>
        <p className="text-zinc-300 leading-relaxed">
          If you're a trusted community member looking to submit on behalf of an originator or elder who isn't online, reach out and let's talk through it. We're building this pathway deliberately — not as a workaround, but as a real part of how the archive works.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Corrections and disputes</h2>
        <p className="text-zinc-300 leading-relaxed">
          If something is wrong — a misattribution, an incorrect name, disputed history — contact us. We'll look into it and get back to you.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Everything else</h2>
        <p className="text-zinc-300 leading-relaxed">
          <a href="mailto:contact@jackbook.app" className="text-violet-400 hover:text-violet-300 transition-colors">
            contact [at] jackbook.app
          </a>
        </p>
        <p className="text-zinc-500 text-sm">We're not a big organization. Response times vary, but we're here.</p>
      </section>
    </main>
  )
}
