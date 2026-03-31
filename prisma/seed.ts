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

const houseMoves = [
  'Cross Step',
  'Grapevine',
  'Ball and Chain',
  'Heel and Toe',
  'Side Walk',
  'Farmer',
  'Jack',
  'Stomp',
  'Shuffle',
  'Skate',
  'Butt Spin',
  'Pac Man',
  'Humpty Dance',
  'Butterfly',
  'Fast Foot',
  'Lofting',
  'Jacking',
  'Footwork',
  'Salsa Step',
  'Mambo Step',
  'Latin Step',
  'Hip Roll',
  'Arm Wave',
  'Pop Lock',
  'Moon Walk',
  'Kick Ball Change',
  'Paddle Turn',
  'Box Step',
  'Cha Cha',
  'Rocking',
  'V Step',
  'Vine Step',
  'Charleston',
  'Jazz Square',
  'Pas de Bourrée',
  'Loose Legs',
  'Jack in the Box',
  'Shuffle Step',
  'Toe Taps',
  'Heel Digs',
  'Scissor Step',
  'Step Tap',
  'Triple Step',
  'L-Step',
  'Bounce',
  'Rock',
  'Pulse',
  'Swing Step',
  'Hop Step',
  'Skip Step',
  'Chase',
  'Circle Step',
  'Spin Step',
  'Turn Step',
  'Sweep',
  'Floor Tap',
  'Kick Through',
  'Low Shuffle',
  'Fake-Out',
  'Syncopated Stomp',
  'Heel Spin',
  'Toe Spin',
]

const hiphopMoves = [
  'Running Man',
  'Roger Rabbit',
  'Cabbage Patch',
  'Reebok',
  'Steve Martin',
  'Happy Feet',
  'Smurf',
  'Prep',
  'Biz Markie',
  'Bart Simpson',
  "Kid 'n Play",
  'Wop',
  'Bankhead Bounce',
  'Tone Wop',
  'ATL Stomp',
  'Bounce Rock',
  'Two-Step',
  'Side Bounce',
  'Rock Step',
  'Body Roll',
  'Chest Pop',
  'Shoulder Bounce',
  'Rib Cage Isolation',
  'Groove Walk',
  'Step Touch',
  'Slide Step',
  'Cross Step (Hip-Hop)',
  'Pivot Step',
  'Skate Step',
  'Heel-Toe (Hip-Hop)',
  'Kick Step',
  'Back Step',
  'Diagonal Walk',
  'Step Drag',
  'Shuffle Walk',
  'Hit',
  'Groove Change',
  'Direction Change',
  'Level Change',
  'Pause Freeze',
  'Groove Switch',
  'Tempo Switch',
  'Isolation Combo',
  'Floor Drop',
  'Knee Drop',
  'Spin',
  'Glide',
  'Stomp Variation',
  'Freeze',
]

async function main() {
  console.log('Seeding database with dance moves...')

  let count = 0

  for (const name of houseMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'house' },
      create: { name, slug, style: 'house' },
    })
    console.log(`  ✓ [house] ${name}`)
    count++
  }

  for (const name of hiphopMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'hiphop' },
      create: { name, slug, style: 'hiphop' },
    })
    console.log(`  ✓ [hiphop] ${name}`)
    count++
  }

  console.log(`\nSeeded ${count} dance moves!`)
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
