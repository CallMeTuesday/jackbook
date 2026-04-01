export const metadata = { title: 'About — Jackbook' }

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-2xl font-semibold">About Jackbook</h1>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">What this is</h2>
        <p className="text-zinc-300 leading-relaxed">
          Jackbook is a living dictionary and video archive for house dance — a place to look up moves, learn their names, trace their roots, and watch them done right.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          House dance was born in the clubs of Chicago and New York in the late 1970s and 80s. The moves that define it were created by real people in real rooms, passed down through cyphers, classes, and late nights on the floor. A lot of that knowledge lives in people, not on the internet. Jackbook exists to help change that — carefully, and on the community's terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">What we're trying to do</h2>
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Name things correctly.</strong> The same move might be called something different in New York than in Chicago than in London. We document those regional differences rather than flatten them. Where origins are known, we note them. Where they're disputed or unclear, we say so honestly.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Keep the archive open.</strong> Every submitted video is accepted into the archive. What gets featured on a move's main page is a separate question — that's handled by trusted community curators, not algorithms.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Make sure originators aren't left behind.</strong> Not everyone who created the vocabulary of house dance is active online. We're building pathways for verified community members to contribute on behalf of elders and originators who might not submit themselves. If that's you, <a href="/contact" className="text-violet-400 hover:text-violet-300 transition-colors">reach out</a>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">What we're not</h2>
        <p className="text-zinc-300 leading-relaxed">
          We're not a social media platform. There are no follower counts, no likes, no engagement scores on move pages. Contributors are credited the way liner notes credit musicians — present, acknowledged, not ranked.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          We're not a place for anyone to claim ownership of a move. The moves belong to the community. Full stop.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Who maintains this</h2>
        <p className="text-zinc-300 leading-relaxed">
          Jackbook is an independent project. It runs on minimal infrastructure and a strong commitment to keeping the core dictionary permanently free. We're funded by optional community support, not advertising.
        </p>
      </section>
    </main>
  )
}
