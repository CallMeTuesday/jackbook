export const metadata = { title: 'Terms of Use — Jackbook' }

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Terms of Use</h1>
        <p className="text-sm text-zinc-500">Last updated: 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Using Jackbook</h2>
        <p className="text-zinc-300 leading-relaxed">
          Jackbook is a free community resource. By using this site you agree to engage with it respectfully and in good faith. That means: don't submit content you don't have the right to submit, don't attempt to manipulate the archive, and don't use the platform to harass, misrepresent, or claim ownership over cultural material that belongs to a community.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Submitting videos</h2>
        <p className="text-zinc-300 leading-relaxed">When you submit a video link, you confirm that:</p>
        <ul className="list-disc list-inside space-y-1 text-zinc-300 leading-relaxed">
          <li>The video is publicly available on YouTube</li>
          <li>The content is relevant to the move you're submitting it under</li>
          <li>You're not submitting material to deceive, spam, or harm</li>
        </ul>
        <p className="text-zinc-300 leading-relaxed">
          You are not claiming ownership of the move, the style, or the cultural knowledge it represents by submitting a video. All submissions are contributions to a communal archive.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          Submitted videos go through human review. We reserve the right to decline or remove any submission at our discretion, particularly if it's found to be inappropriate, misleading, or disrespectful of the culture.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Attribution and credit</h2>
        <p className="text-zinc-300 leading-relaxed">
          We make a good-faith effort to accurately document the origins of moves and credit contributors. If you believe something is misattributed or historically inaccurate, contact us. We will investigate and correct errors.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          We do not allow anyone — including site administrators — to use Jackbook to claim personal ownership over house dance moves, terminology, or cultural practices.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Your account</h2>
        <p className="text-zinc-300 leading-relaxed">
          You are responsible for activity under your account. Don't share your login. If you believe your account has been compromised, contact us immediately.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          We may suspend or remove accounts that are used to abuse the submission system, spread misinformation, or otherwise act against the spirit of this project.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Intellectual property</h2>
        <p className="text-zinc-300 leading-relaxed">
          Jackbook does not host video content — we link to videos hosted on YouTube. Rights to those videos remain with their respective owners. If you believe a video linked on this site violates your rights, contact us and we will review the situation.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          The Jackbook name, logo, and original written content on this site are our own. Move names, terminology, and the cultural knowledge documented here belong to the community they come from.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Changes to these terms</h2>
        <p className="text-zinc-300 leading-relaxed">
          We may update these terms as the platform evolves. We'll note the date of the last update at the top of this page. Continued use of the site means you're okay with the current terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Questions</h2>
        <p className="text-zinc-300 leading-relaxed">
          Contact us at{' '}
          <a href="mailto:contact@jackbook.app" className="text-violet-400 hover:text-violet-300 transition-colors">
            contact [at] jackbook.app
          </a>
          .
        </p>
      </section>
    </main>
  )
}
