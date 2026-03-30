import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const moves = [
  // Original set
  'Cross Step',
  'Grapevine',
  'Ball and Chain',
  'Cabbage Patch',
  'Running Man',
  'Roger Rabbit',
  'Heel and Toe',
  'Side Walk',
  'Farmer',
  'Jack',
  'Stomp',
  'Shuffle',
  'Skate',
  'Prep',
  'Wop',
  'Butt Spin',
  'Reebok',
  "Kid 'N Play",
  'Pac Man',
  'Humpty Dance',
  'Butterfly',
  'Biz Markie',
  'Fast Foot',
  'Lofting',
  'Jacking',
  'Footwork',
  'Salsa Step',
  'Mambo Step',
  'Latin Step',
  'Hip Roll',
  'Body Roll',
  'Arm Wave',
  'Pop Lock',
  'Glide',
  'Moon Walk',
  'Pivot',
  'Spin',
  'Kick Ball Change',
  'Kick Step',
  'Paddle Turn',
  'Box Step',
  'Cha Cha',
  'Rocking',
  'Step Touch',
  'V Step',
  'Vine Step',
  'Charleston',
  'Jazz Square',
  'Pivot Step',
  // New additions
  'Pas de Bourrée',
  'Loose Legs',
  'Jack in the Box',
  'Shuffle Step',
  'Toe Taps',
  'Heel Digs',
  'Slide Step',
  'Scissor Step',
  'Back Step',
  'Step Tap',
  'Triple Step',
  'L-Step',
  'Bounce',
  'Rock',
  'Pulse',
  'Groove Walk',
  'Swing Step',
  'Hop Step',
  'Skip Step',
  'Chase',
  'Diagonal Walk',
  'Circle Step',
  'Spin Step',
  'Turn Step',
  'Slide Glide',
  'Sweep',
  'Knee Drop',
  'Floor Tap',
  'Kick Through',
  'Low Shuffle',
  'Fake-Out',
  'Syncopated Stomp',
  'Heel Spin',
  'Toe Spin',
  'Freeze',
]

async function main() {
  console.log('Seeding database with dance moves...')

  // Deduplicate by slug
  const uniqueMoves = new Map<string, string>()
  for (const move of moves) {
    const slug = generateSlug(move)
    if (!uniqueMoves.has(slug)) {
      uniqueMoves.set(slug, move)
    }
  }

  for (const [slug, name] of Array.from(uniqueMoves.entries())) {
    await prisma.move.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    })
    console.log(`  ✓ ${name} (${slug})`)
  }

  console.log(`\nSeeded ${uniqueMoves.size} dance moves!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
