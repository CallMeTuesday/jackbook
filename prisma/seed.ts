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

const vogueMoves = [
  'Catwalk (Vogue)',
  'Duckwalk',
  'Hands Performance',
  'Floor Performance',
  'Spins & Dips',
  'Dip (Shablam)',
  'Death Drop',
  'Old Way Pose',
  'New Way Lines',
  'Vogue Femme Performance',
  'Runway Walk',
  'Soft & Cunt',
  'Dramatic Dip',
  'Fake Dip',
  'Kick & Dip',
  'Spin & Dip',
  'Hand Roll',
  'Finger Tut (Vogue)',
  'Arm Control',
  'Box Arms',
  'Angular Lines',
  'Clicks',
  'Pose (Vogue)',
  'Freeze (Vogue)',
  'Snap & Pose',
  'Walk & Pose (Vogue)',
  'Turn & Pose',
  'Floor Spin',
  'Leg Sweep',
  'Backbend',
  'Drop to Floor',
  'Crawl',
  'Knee Walk',
  'Kick & Walk',
  'Shoulder Roll (Vogue)',
  'Head Roll',
  'Eye Contact Play',
  'Face Performance',
  'Hair Whip',
  'Spin Sequence',
  'Dip Fake-Out',
  'Runway Turn',
  'Hand Performance Combo',
  'Floor Combo',
  'Duckwalk Variation',
  'Catwalk Variation',
  'Pose Sequence',
  'Freeze Hit',
  'Musical Hit (Vogue)',
  'Performance Exit',
]

const waackingMoves = [
  'Pose',
  'Strike',
  'Line',
  'Extension',
  'Arm Throw',
  'Overhead Throw',
  'Underarm Throw',
  'Circular Arm',
  'Figure Eight Arms',
  'Elbow Hit',
  'Wrist Flick',
  'Arm Roll',
  'Double Arm Swing',
  'Single Arm Swing',
  'Reverse Swing',
  'Behind-the-Back Throw',
  'Cross-Body Throw',
  'Point (Waacking)',
  'Finger Snap',
  'Walk & Pose',
  'Catwalk',
  'Pivot Turn',
  'Spin (Waacking)',
  'Double Spin',
  'Dip (Waacking)',
  'Dramatic Pause',
  'Head Whip',
  'Shoulder Roll',
  'Chest Lift',
  'Back Arch',
  'Groove Step',
  'Step Touch (Waacking)',
  'Side Walk (Waacking)',
  'Diagonal Walk (Waacking)',
  'Kick Ball Change (Waacking)',
  'Pas de Bourrée (Waacking)',
  'Drop & Pose',
  'Floor Pose',
  'Arm Combo',
  'Fast Arms',
  'Slow Motion Arms',
  'Musical Hit',
  'Freeze (Waacking)',
  'Pose Transition',
  'Spin & Pose',
  'Walk Walk Pose',
  'Arm Spiral',
  'Wrist Roll (Waacking)',
  'Over-the-Head Loop',
  'Performance Face',
]

const breakingMoves = [
  'Toprock',
  'Indian Step',
  'Cross Step (Breaking)',
  'Side Step',
  'Salsa Step (Toprock)',
  'Brooklyn Rock',
  'Bronx Step',
  'Kick Step (Breaking)',
  'Shuffle Rock',
  'CCs',
  'Six-Step',
  'Three-Step',
  'Two-Step (Breaking)',
  'Five-Step',
  'Seven-Step',
  'Eight-Step',
  'Coffee Grinder',
  'Sweep (Breaking)',
  'Kick Through (Breaking)',
  'Zulu Spin',
  'Baby Freeze',
  'Chair Freeze',
  'Airbaby',
  'Turtle Freeze',
  'Headstand Freeze',
  'Elbow Freeze',
  'Hollowback',
  'Handstand Freeze',
  'Shoulder Freeze',
  'Windmill',
  'Baby Windmill',
  'Backspin',
  'Headspin',
  'Halo',
  'Flare',
  'Airflare',
  'Swipe',
  '1990',
  '2000',
  'Jackhammer',
  'Cricket',
  'UFO',
  'Turtle',
  'Track',
  'Rollback',
  'Kip-Up',
  'Suicide',
  'Freeze Drop',
  'Power Combo',
  'Blowup',
]

const poppingMoves = [
  'Fresno',
  'Hit',
  'Dime Stop',
  'Wave',
  'Arm Wave',
  'Body Wave',
  'Tick',
  'Twist-O-Flex',
  'Neck-O-Flex',
  'Puppet',
  'Robot',
  'Old Man',
  'Scarecrow',
  'Walkout',
  'Glide',
  'Moonwalk',
  'Backslide',
  'Side Glide',
  'Air Walk',
  'Float',
  'Strobing',
  'Slow Motion',
  'King Tut',
  'Finger Tutting',
  'Cobra',
  'Snaking',
  'Boogaloo',
  'Master Flex',
  'Crazy Legs',
  'Knee Roll',
  'Leg Wave',
  'Toyman',
  'Waving Combo',
  'Animation',
  'Pop Walk',
  'Glide Turn',
  'Pivot Glide',
  'Puppet Walk',
  'Robot Turn',
  'Tick Walk',
  'Dime Stop Turn',
  'Wave Turn',
  'Air Dime',
  'Float Glide',
  'Slide Glide',
  'Boogaloo Roll',
  'Twist Walk',
  'Flex Turn',
  'Neck Tick',
  'Pop Freeze',
]

const lockingMoves = [
  'Lock',
  'Points',
  'Wrist Roll',
  'Scooby Doo',
  'Scooby Walk',
  'Stop & Go',
  'Which-A-Way',
  'Funky Guitar',
  'Lock Walk',
  'Leo Walk',
  'Skeeter Rabbit',
  'Scootbot',
  'Muscle Man',
  'Pimp Walk',
  'Funky Penguin',
  'Uncle Sam Points',
  'Double Lock',
  'Lock Turn',
  'Knee Drop Lock',
  'Jump Split',
  'Split Lock',
  'Scooby Pivot',
  'Lock Kick',
  'Heel Toe Lock Step',
  'Slide Lock',
  'Wrist Roll Turn',
  'Lock Hop',
  'Lock Freeze',
  'Point Turn',
  'Lock Bounce',
  'Wrist Roll Drop',
  'Scooby Spin',
  'Lock Run',
  'Knee Lift Lock',
  'Lock Groove',
  'Wrist Roll Combo',
  'Lock & Point Combo',
  'Lock Step Back',
  'Lock Step Forward',
  'Scooby Shuffle',
  'Lock Slide Turn',
  'Lock Kick Turn',
  'Lock Pause',
  'Lock Reach',
  'Lock Swing',
  'Lock Groove Walk',
  'Lock Hit',
  'Lock Dip',
  'Lock Reset',
  'Lock Break',
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

  for (const name of vogueMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'vogue' },
      create: { name, slug, style: 'vogue' },
    })
    console.log(`  ✓ [vogue] ${name}`)
    count++
  }

  for (const name of waackingMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'waacking' },
      create: { name, slug, style: 'waacking' },
    })
    console.log(`  ✓ [waacking] ${name}`)
    count++
  }

  for (const name of breakingMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'breaking' },
      create: { name, slug, style: 'breaking' },
    })
    console.log(`  ✓ [breaking] ${name}`)
    count++
  }

  for (const name of poppingMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'popping' },
      create: { name, slug, style: 'popping' },
    })
    console.log(`  ✓ [popping] ${name}`)
    count++
  }

  for (const name of lockingMoves) {
    const slug = generateSlug(name)
    await prisma.move.upsert({
      where: { slug },
      update: { name, style: 'locking' },
      create: { name, slug, style: 'locking' },
    })
    console.log(`  ✓ [locking] ${name}`)
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
