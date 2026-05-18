/**
 * SparkPlay Illustration Generator
 * =================================
 * Generates all game illustrations using gpt-image-1 (OpenAI's current
 * image model) and saves them as static PNG files under public/illustrations/.
 *
 * Run once:  npm run generate:illustrations
 *
 * Cost: ~$0.04 per medium image (1024×1024).
 * Full set ≈ 64 images ≈ $2.56 one-time.
 *
 * Requires:  OPENAI_API_KEY in your .env.local
 *
 * Note: gpt-image-1 supersedes dall-e-3. It returns base64-encoded PNG
 * data directly in the response (no separate download needed).
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.OPENAI_API_KEY) {
  console.error('❌  OPENAI_API_KEY not found in .env.local')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── Style base ──────────────────────────────────────────────────────────────
// All prompts share this foundation for visual consistency.
const STYLE = [
  'children\'s educational app illustration',
  'cute rounded cartoon character',
  'big expressive friendly eyes',
  'warm cheerful expression',
  'bright vibrant saturated colours',
  'clean white background',
  'Pixar / Disney Junior inspired art style',
  'soft smooth digital illustration',
  'no text, no watermark, no shadows behind',
  'suitable for children ages 2–12',
].join(', ')

const CARD_STYLE = `isolated character portrait showing face and upper chest, ${STYLE}`
const HERO_STYLE = `full character portrait, centred, slightly larger than bust-shot, ${STYLE}`
const CELEBRATION_STYLE = `wide scene illustration, two characters celebrating together with confetti and stars, joyful and energetic, ${STYLE}`

// ─── Generation jobs ──────────────────────────────────────────────────────────

// gpt-image-1 supported sizes (dall-e-3's 1792x1024 is NOT supported)
interface Job {
  outPath: string    // relative to public/
  prompt: string
  size: '1024x1024' | '1536x1024' | '1024x1536'
}

function cardJob(theme: string, subject: string, prompt: string): Job {
  return {
    outPath: `illustrations/${theme}/card-${subject}.png`,
    prompt: `${prompt}, ${CARD_STYLE}`,
    size: '1024x1024',
  }
}

function heroJob(theme: string, prompt: string): Job {
  return {
    outPath: `illustrations/${theme}/hero.png`,
    prompt: `${prompt}, ${HERO_STYLE}`,
    size: '1024x1024',
  }
}

function celebrationJob(theme: string, prompt: string): Job {
  return {
    outPath: `illustrations/${theme}/celebration.png`,
    prompt: `${prompt}, ${CELEBRATION_STYLE}`,
    size: '1536x1024',   // widest size supported by gpt-image-1
  }
}

const JOBS: Job[] = [

  // ── Animals ──────────────────────────────────────────────────────────────
  cardJob('animals', 'dog',      'Cute fluffy golden puppy dog with floppy ears and a wagging tail'),
  cardJob('animals', 'cat',      'Adorable orange tabby kitten with green eyes and tiny whiskers'),
  cardJob('animals', 'lion',     'Cute friendly big cat character with warm golden-orange fur, round friendly face, children\'s cartoon illustration'),
  cardJob('animals', 'bear',     'Round chubby brown teddy bear with a honey pot'),
  cardJob('animals', 'frog',     'Bright green frog with huge round eyes sitting on a lily pad'),
  cardJob('animals', 'duck',     'Fluffy yellow duckling with an orange beak and tiny wings'),
  cardJob('animals', 'fox',      'Clever orange fox with a bushy tail and bright curious eyes'),
  cardJob('animals', 'panda',    'Chubby black-and-white panda eating bamboo shoots'),
  cardJob('animals', 'koala',    'Sleepy grey koala holding a eucalyptus leaf'),
  cardJob('animals', 'tiger',    'Playful orange tiger cub with black stripes'),
  cardJob('animals', 'monkey',   'Cheeky brown monkey with a big smile swinging on a vine'),
  cardJob('animals', 'penguin',  'Round black-and-white penguin waddling in a bow tie'),
  cardJob('animals', 'rabbit',   'Fluffy white rabbit with pink ears and a cotton tail'),
  cardJob('animals', 'hamster',  'Tiny golden hamster with round cheeks full of seeds'),
  cardJob('animals', 'owl',      'Wise spotted owl with big round eyes and a graduation cap'),
  cardJob('animals', 'elephant', 'Baby grey elephant with huge floppy ears and a curled trunk'),
  cardJob('animals', 'giraffe',  'Tall spotted giraffe baby with long eyelashes'),
  cardJob('animals', 'dolphin',  'Smiling grey dolphin leaping happily out of sparkling water'),
  heroJob('animals',      'Cute friendly big golden-furred cat character standing heroically with a warm smile, children\'s cartoon style'),
  celebrationJob('animals', 'A joyful child in colourful clothes hugging a friendly golden cartoon big-cat character, both laughing with confetti raining down'),

  // ── Dinos ────────────────────────────────────────────────────────────────
  cardJob('dinos', 'brachiosaurus',    'Gentle long-necked brachiosaurus with soft spots and a friendly smile'),
  cardJob('dinos', 'trex',             'Excited baby T-Rex with tiny arms and a huge toothy grin'),
  cardJob('dinos', 'triceratops',      'Sturdy triceratops with three bright horns and puppy eyes'),
  cardJob('dinos', 'stegosaurus',      'Spiky stegosaurus with colourful back plates and a sweet expression'),
  cardJob('dinos', 'pterodactyl',      'Swooping pterodactyl with a wide wingspan and adventurous look'),
  cardJob('dinos', 'ankylosaurus',     'Armoured ankylosaurus rolling into a happy ball'),
  cardJob('dinos', 'spinosaurus',      'Cool spinosaurus with a rainbow-coloured sail on its back'),
  cardJob('dinos', 'velociraptor',     'Quick velociraptor with feathers and intelligent curious eyes'),
  cardJob('dinos', 'diplodocus',       'Huge long diplodocus curling its neck into a heart shape'),
  cardJob('dinos', 'parasaurolophus',  'Parasaurolophus with a bright crest playing a musical note'),
  cardJob('dinos', 'pachycephalosaurus','Round-headed pachycephalosaurus with a spotted dome'),
  cardJob('dinos', 'iguanodon',        'Thumbs-up iguanodon with a winning smile'),
  heroJob('dinos',      'Adorable baby T-Rex standing on two legs waving, wearing an explorer hat'),
  celebrationJob('dinos', 'An excited child riding a friendly baby brachiosaurus through a lush prehistoric jungle with flowers'),

  // ── Unicorns ─────────────────────────────────────────────────────────────
  cardJob('unicorns', 'unicorn',       'Pastel rainbow unicorn with a glittering horn and flowing magical mane'),
  cardJob('unicorns', 'fairy',         'Tiny fairy with butterfly wings and a wand that sprinkles gold stars'),
  cardJob('unicorns', 'pegasus',       'White winged horse with cloud-like wings and rose-gold hooves'),
  cardJob('unicorns', 'rainbow-pony',  'Colourful pony with a rainbow-striped mane leaping over a cloud'),
  cardJob('unicorns', 'magic-bunny',   'White bunny with a tiny rainbow horn and sparkling tail'),
  cardJob('unicorns', 'sparkle-cat',   'Silver cat with star-shaped pupils and a shimmering coat'),
  cardJob('unicorns', 'crystal-fox',   'Transparent crystal fox with jewels embedded in its fur'),
  cardJob('unicorns', 'star-deer',     'Midnight blue deer with golden star antlers and glowing eyes'),
  cardJob('unicorns', 'moon-bear',     'Lavender bear with a crescent moon on its forehead'),
  cardJob('unicorns', 'cloud-horse',   'Fluffy white cloud-shaped horse floating in a pastel sky'),
  cardJob('unicorns', 'glitter-owl',   'Purple owl covered in tiny rainbow glitter specks'),
  cardJob('unicorns', 'potion-witch',  'Cute young witch with a pointed star hat and a bubbling potion'),
  heroJob('unicorns',      'Majestic rainbow unicorn rearing up gracefully, horn glowing with golden light and sparkles everywhere'),
  celebrationJob('unicorns', 'A happy child and a magical unicorn jumping together over a giant double rainbow with stars'),

  // ── Ocean ────────────────────────────────────────────────────────────────
  cardJob('ocean', 'clownfish',   'Bright orange clownfish with white stripes peeking from an anemone'),
  cardJob('ocean', 'dolphin',     'Playful blue dolphin leaping through sparkling ocean waves'),
  cardJob('ocean', 'octopus',     'Purple octopus with eight curling arms and a big smile'),
  cardJob('ocean', 'crab',        'Red crab with big claws doing a happy crab dance'),
  cardJob('ocean', 'shark',       'Friendly grey baby shark with a toothy grin and innocent eyes'),
  cardJob('ocean', 'seahorse',    'Elegant yellow seahorse with a glittering crown-like fin'),
  cardJob('ocean', 'jellyfish',   'Glowing pink jellyfish with translucent tentacles and a sweet face'),
  cardJob('ocean', 'turtle',      'Green sea turtle with a mosaic shell pattern swimming gracefully'),
  cardJob('ocean', 'whale',       'Giant blue whale blowing a rainbow water spout'),
  cardJob('ocean', 'starfish',    'Bright orange starfish with five arms and a cheerful smile'),
  cardJob('ocean', 'lobster',     'Red lobster chef wearing a tiny apron and holding a fork'),
  cardJob('ocean', 'seal',        'Grey seal pup clapping flippers together joyfully on an ice floe'),
  cardJob('ocean', 'narwhal',     'Blue narwhal with a spiral gold horn leaping from icy water'),
  cardJob('ocean', 'pufferfish',  'Yellow pufferfish puffed up into a spiky ball with a surprised look'),
  cardJob('ocean', 'manta-ray',   'Graceful manta ray gliding silently with wing-like fins'),
  cardJob('ocean', 'anglerfish',  'Cute deep-sea anglerfish with a glowing lure used as a lantern'),
  heroJob('ocean',      'Cheerful dolphin family jumping through a rainbow waterfall with coral reef backdrop'),
  celebrationJob('ocean', 'A laughing child in a snorkel and flippers swimming with friendly dolphins underwater'),

  // ── Space ────────────────────────────────────────────────────────────────
  cardJob('space', 'astronaut',      'Young girl astronaut in a white spacesuit with a colourful helmet'),
  cardJob('space', 'alien',          'Friendly green alien with antennae and a wide smile waving hello'),
  cardJob('space', 'rocket',         'Red and white toy rocket with stars on the side blasting off'),
  cardJob('space', 'planet-robot',   'Round robot with planet rings for a body and blinking LED eyes'),
  cardJob('space', 'moon-cat',       'White cat wearing an astronaut helmet sitting on the moon'),
  cardJob('space', 'star-dog',       'Golden puppy with star-shaped ears floating in zero gravity'),
  cardJob('space', 'comet-dragon',   'Baby dragon riding a comet tail through a galaxy'),
  cardJob('space', 'saturn-frog',    'Green frog sitting on Saturn\'s ring eating a star-shaped snack'),
  cardJob('space', 'nebula-owl',     'Purple owl with galaxy-coloured wings in deep space'),
  cardJob('space', 'blackhole-bunny','White rabbit disappearing into a friendly swirling black hole'),
  cardJob('space', 'space-whale',    'Enormous whale swimming through a purple nebula like an ocean'),
  cardJob('space', 'meteor-bear',    'Bear in a spacesuit surfing on a meteor shower'),
  heroJob('space',      'Excited young astronaut in a colourful spacesuit with a jetpack, waving from outside a space station'),
  celebrationJob('space', 'A delighted child astronaut high-fiving a friendly alien on the moon with Earth visible behind them'),

  // ── Superheroes ──────────────────────────────────────────────────────────
  cardJob('superheroes', 'cape-kid',     'Young superhero child in a purple cape and mask standing heroically'),
  cardJob('superheroes', 'speedster',    'Yellow kid zooming with lightning bolt speed lines behind them'),
  cardJob('superheroes', 'strongman',    'Strong child flexing muscles with a star on their chest'),
  cardJob('superheroes', 'flying-girl',  'Girl flying through clouds with a red cape flowing behind her'),
  cardJob('superheroes', 'lightning-boy','Boy summoning colourful lightning bolts from his hands'),
  cardJob('superheroes', 'ice-hero',     'Blue-suited hero creating ice crystals and snowflakes'),
  cardJob('superheroes', 'fire-hero',    'Orange hero surrounded by friendly cartoon flames'),
  cardJob('superheroes', 'water-hero',   'Blue hero controlling a swirling orb of sparkling water'),
  cardJob('superheroes', 'earth-hero',   'Green hero with plants and vines growing from their arms'),
  cardJob('superheroes', 'shadow-hero',  'Dark purple hero with shadow wings and glowing eyes'),
  cardJob('superheroes', 'light-hero',   'Golden hero radiating bright sunbeams in all directions'),
  cardJob('superheroes', 'time-hero',    'Silver hero holding a glowing pocket watch controlling time'),
  heroJob('superheroes', 'Triumphant young child superhero in a purple cape landing from flight, fist raised, city skyline behind'),
  celebrationJob('superheroes', 'A group of child superheroes and a kid in a purple cape celebrating a victory over a bright city'),

  // ── Farm ────────────────────────────────────────────────────────────────
  cardJob('farm', 'cow',     'Friendly black-and-white cow with big brown eyes and a flower on its head'),
  cardJob('farm', 'pig',     'Chubby pink pig with curly tail rolling in a flower meadow'),
  cardJob('farm', 'chicken', 'Fluffy yellow chick pecking at seeds with round curious eyes'),
  cardJob('farm', 'horse',   'Chestnut brown horse with a flowing mane trotting happily'),
  cardJob('farm', 'sheep',   'Fluffy white sheep with a woolly coat and pink ears'),
  cardJob('farm', 'goat',    'White goat with small horns standing on top of a hay bale'),
  cardJob('farm', 'duck',    'White farm duck with orange feet splashing in a muddy puddle'),
  cardJob('farm', 'rooster', 'Colourful rooster with a bright red comb crowing at sunrise'),
  cardJob('farm', 'rabbit',  'Brown farm rabbit nibbling a carrot in a vegetable garden'),
  cardJob('farm', 'dog',     'Friendly sheepdog herding small woolly sheep with a proud expression'),
  cardJob('farm', 'cat',     'Tabby barn cat sitting on a hay bale next to a lantern'),
  cardJob('farm', 'donkey',  'Grey donkey wearing a straw hat loaded with colourful flowers'),
  cardJob('farm', 'turkey',  'Proud turkey with a fanned tail of red orange and yellow feathers'),
  cardJob('farm', 'goose',   'White goose with an orange beak waddling along a garden path'),
  heroJob('farm',      'Happy smiling farmer child in overalls and a straw hat holding a basket of fresh vegetables on a sunny farm'),
  celebrationJob('farm', 'A joyful child feeding carrots to a friendly cartoon horse on a golden sunny farm with a red barn'),

  // ── Food ────────────────────────────────────────────────────────────────
  cardJob('food', 'pizza-chef',  'Cheerful pizza slice character wearing a tiny chef hat'),
  cardJob('food', 'ice-cream',   'Melting ice cream cone with sprinkles and a happy face'),
  cardJob('food', 'donut',       'Pink glazed donut with rainbow sprinkles doing a little dance'),
  cardJob('food', 'cupcake',     'Chocolate cupcake with swirly frosting and a cherry on top'),
  cardJob('food', 'taco',        'Smiling taco overflowing with colourful vegetables and cheese'),
  cardJob('food', 'strawberry',  'Giant red strawberry with a face wearing a green leafy crown'),
  cardJob('food', 'cookie',      'Golden chocolate chip cookie with a gooey centre and big smile'),
  cardJob('food', 'cake',        'Towering three-layer birthday cake with candles and confetti'),
  cardJob('food', 'burger',      'Juicy cartoon burger with googly eyes and little arms'),
  cardJob('food', 'candy',       'Rainbow swirly lollipop with sparkles spinning in the air'),
  cardJob('food', 'waffle',      'Square waffle dripping with maple syrup and fresh berries'),
  cardJob('food', 'sushi',       'Round sushi roll wearing a seaweed bow tie and chopstick legs'),
  heroJob('food',      'A giant friendly donut wearing a chef hat waving from inside a candy kingdom with lollipop trees'),
  celebrationJob('food', 'A gleeful child and a giant smiling donut dancing together in a colourful candy kingdom with gummy bears watching'),
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generateOne(job: Job, index: number, total: number): Promise<void> {
  const dest = path.join('public', job.outPath)

  // Skip if already generated (re-run safe)
  if (fs.existsSync(dest)) {
    console.log(`  ⏭  [${index}/${total}] Already exists: ${job.outPath}`)
    return
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true })

  try {
    const isNewModel = ACTIVE_MODEL === 'gpt-image-1'

    // Adjust size for dall-e-2 (only supports square sizes up to 1024x1024)
    const size = ACTIVE_MODEL === 'dall-e-2'
      ? '1024x1024'
      : job.size

    const response = await openai.images.generate({
      model:   ACTIVE_MODEL,
      prompt:  job.prompt,
      size,
      quality: isNewModel ? 'medium' : 'standard',
      n:       1,
      // Request base64 for older models so we don't need to download
      response_format: isNewModel ? undefined : 'b64_json',
    } as Parameters<typeof openai.images.generate>[0])

    const imgResponse = response as { data?: Array<{ b64_json?: string; url?: string }> }
    const b64 = imgResponse.data?.[0]?.b64_json
    const url  = imgResponse.data?.[0]?.url

    if (b64) {
      fs.writeFileSync(dest, Buffer.from(b64, 'base64'))
    } else if (url) {
      // Fallback: download from URL (shouldn't happen with b64_json but just in case)
      const { default: https } = await import('https')
      await new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(dest)
        https.get(url, (res) => { res.pipe(file); file.on('finish', () => file.close(() => resolve())) })
          .on('error', reject)
      })
    } else {
      throw new Error('No image data in response')
    }

    console.log(`  ✓  [${index}/${total}] ${job.outPath}`)
  } catch (err) {
    console.error(`  ✗  [${index}/${total}] FAILED ${job.outPath}:`, (err as Error).message)
  }
}

async function detectImageModel(): Promise<string> {
  // Try in preference order — newest first
  const candidates = ['gpt-image-1', 'dall-e-3', 'dall-e-2']
  console.log('  🔍 Detecting available image model...')
  for (const model of candidates) {
    try {
      // Cheapest possible test: generate a 256×256 image (dall-e-2 only supports that)
      await openai.images.generate({
        model,
        prompt: 'a red circle',
        size:   model === 'dall-e-2' ? '256x256' : '1024x1024',
        n:      1,
        ...(model === 'gpt-image-1' ? { quality: 'low' } : { quality: 'standard' }),
      })
      console.log(`  ✓ Using model: ${model}\n`)
      return model
    } catch (e: unknown) {
      const msg = (e as Error).message ?? ''
      if (msg.includes('does not exist') || msg.includes('not found') || msg.includes('access')) {
        console.log(`  ✗ ${model}: not available`)
      } else {
        // Different error — model exists but something else failed; use it anyway
        console.log(`  ✓ Using model: ${model} (detection error: ${msg.slice(0, 60)})\n`)
        return model
      }
    }
  }
  console.error('\n❌  No image generation model available on this API key.')
  console.error('   Possible fixes:')
  console.error('   1. Add a payment method at https://platform.openai.com/settings/billing')
  console.error('   2. Make sure your API key has "Images" permission enabled')
  console.error('   3. Check usage limits at https://platform.openai.com/usage')
  process.exit(1)
}

// Global model detected at startup
let ACTIVE_MODEL = 'gpt-image-1'

async function main() {
  const args = process.argv.slice(2)
  const themeFilter = args.find((a) => !a.startsWith('--'))
  const dryRun = args.includes('--dry-run')

  const jobs = themeFilter
    ? JOBS.filter((j) => j.outPath.startsWith(`illustrations/${themeFilter}/`))
    : JOBS

  if (dryRun) {
    console.log(`\nDry run — would generate ${jobs.length} images:\n`)
    jobs.forEach((j) => console.log(`  ${j.outPath}`))
    const cost = (jobs.length * 0.04).toFixed(2)
    console.log(`\nEstimated cost: ~$${cost}\n`)
    return
  }

  console.log(`\n🎨 SparkPlay Illustration Generator`)
  console.log(`   API key: ${process.env.OPENAI_API_KEY?.slice(0, 8)}...`)
  ACTIVE_MODEL = await detectImageModel()

  console.log(`   Generating ${jobs.length} images → public/illustrations/`)
  if (themeFilter) console.log(`   Theme filter: ${themeFilter}`)
  console.log(`   Estimated cost: ~$${(jobs.length * 0.04).toFixed(2)}\n`)

  // Throttle to avoid DALL-E rate limits (max 5 images/min on Tier 1)
  for (let i = 0; i < jobs.length; i++) {
    await generateOne(jobs[i], i + 1, jobs.length)
    // 13-second gap keeps us under 5 images/minute
    if (i < jobs.length - 1) await new Promise((r) => setTimeout(r, 13_000))
  }

  console.log('\n✅  Generation complete! Illustrations saved to public/illustrations/')
  console.log('    Run `npm run dev` and refresh the browser to see them.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
