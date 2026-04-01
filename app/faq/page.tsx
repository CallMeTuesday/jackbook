export const metadata = { title: 'FAQ — Jackbook' }

const faqs = [
  {
    q: 'How do I submit a video?',
    a: "You'll need an account. Once you're logged in, go to any move page and use the submission form. We accept YouTube links only — paste the URL of a video that shows the move clearly. All submissions go through a review process before appearing on the site.",
  },
  {
    q: 'Why only YouTube links?',
    a: "It keeps the archive stable. We don't host video ourselves, and YouTube links are verifiable — we can check that the video actually exists, is public, and loads. Other platforms come and go, and we want submissions to last.",
  },
  {
    q: 'Who reviews submissions?',
    a: "Every submitted video is held for human review before it goes live. Our reviewers are trusted community members, not a moderation algorithm. They're looking for content that's appropriate, relevant, and respectful of the culture.",
  },
  {
    q: "My video was accepted, but it's not showing on the move page. Why?",
    a: "Acceptance and visibility are two different things on Jackbook. All approved videos enter the full archive for that move. What appears on the move's main page is a curated subset, chosen by trusted community curators. You can browse the full archive from any move page. Think of the main page as the \u201cfeatured\u201d section — getting into the archive is the goal, and you're in it.",
  },
  {
    q: "I know the originator of a move, or I am one. How do I make sure that's reflected?",
    a: "This matters a lot to us. Move pages have a lineage and origin section where we document this kind of information. If you have knowledge about a move's history or origin that isn't reflected, contact us — we want to get it right. If you're a trusted community member looking to submit on behalf of an originator who isn't online, we have a pathway for that. Reach out directly and we'll talk through it.",
  },
  {
    q: "Can I add a new move that isn't in the dictionary yet?",
    a: "Yes, eventually — that feature is in development. For now, if you believe a move is missing, contact us with the name, any regional variations you know of, and as much context as you can provide. We'll review it for addition.",
  },
  {
    q: 'What gets a video rejected during review?',
    a: "Content that is inappropriate, unrelated to the move, or violates basic community standards. We're not strict about production quality — a phone video from a cypher is just as valid as a studio clip. We're strict about relevance and respect.",
  },
  {
    q: 'Is Jackbook free?',
    a: 'Yes. The core dictionary and archive are permanently free to use. There are optional ways to support the project if you want to help keep it running.',
  },
  {
    q: 'Who runs this?',
    a: "Jackbook is an independent project built by and for the house dance community. We're a small operation — not a startup, not a media company.",
  },
]

export default function FAQPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
      <ul className="space-y-8">
        {faqs.map(({ q, a }) => (
          <li key={q} className="space-y-2">
            <h2 className="text-zinc-100 font-medium">{q}</h2>
            <p className="text-zinc-400 leading-relaxed">{a}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
