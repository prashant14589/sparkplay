// Story Quest — 5 themes, each with a branching narrative that weaves in the child's name.
// {NAME} is replaced at render time with the child's actual name (or "You" as fallback).

export type StoryScene = {
  id: string
  emoji: string
  title: string
  text: string            // may contain {NAME}
  choices?: {
    label: string
    next: string
    coinsBonus?: number   // optional extra coins for this choice
  }[]
  isEnd?: boolean
  endType?: 'great' | 'good' | 'fun'
}

export type Story = {
  id: string
  title: string          // may contain {NAME}
  emoji: string
  themeEmoji: string
  color: string          // Tailwind gradient
  bg: string             // Tailwind bg
  scenes: Record<string, StoryScene>
  startId: string
}

// ─────────────────────────────────────────────
// STORY 1: Space Adventure
// ─────────────────────────────────────────────
const spaceStory: Story = {
  id: 'space',
  title: '{NAME}\'s Space Adventure',
  emoji: '🚀',
  themeEmoji: '🌌',
  color: 'from-indigo-500 to-violet-600',
  bg: 'bg-indigo-50',
  startId: 's1',
  scenes: {
    s1: {
      id: 's1',
      emoji: '🚀',
      title: 'Blast Off!',
      text: '{NAME} is an astronaut zooming through the galaxy in a shiny silver rocket! 🌟 After flying past three glowing planets, the radar beeps — a mysterious planet appears ahead. It has purple clouds and two landing zones.',
      choices: [
        { label: 'Land on the rocky side', next: 's2a' },
        { label: 'Land near the glowing lake', next: 's2b' },
      ],
    },
    s2a: {
      id: 's2a',
      emoji: '🔭',
      title: 'Crystal Caves',
      text: '{NAME} lands on the rocky side and discovers giant crystals that hum like music! 🎵 A small glowing robot rolls out of a cave and waves. It seems friendly — but it holds two doors: a blue one and a gold one.',
      choices: [
        { label: 'Open the blue door', next: 'e1' },
        { label: 'Open the gold door', next: 'e2' },
      ],
    },
    s2b: {
      id: 's2b',
      emoji: '🌊',
      title: 'The Glowing Lake',
      text: 'The lake glows teal and tiny alien fish jump out, splashing rainbow droplets on {NAME}\'s helmet! 🐟 Then a friendly alien bubble-ship rises from the water. The pilot invites {NAME} to explore — in the sea or in the sky?',
      choices: [
        { label: 'Dive under the lake', next: 'e3' },
        { label: 'Fly above the clouds', next: 'e4' },
      ],
    },
    e1: {
      id: 'e1',
      emoji: '💎',
      title: 'The Star Map!',
      text: 'Behind the blue door is a room full of floating star maps! {NAME} finds one that shows every planet in the galaxy with funny names like "Wobbly World" and "Cheese Moon." 🧀🌙 The robot hands {NAME} the map as a gift. What an amazing discovery!',
      isEnd: true,
      endType: 'great',
    },
    e2: {
      id: 'e2',
      emoji: '👽',
      title: 'New Best Friends!',
      text: 'Behind the gold door is a whole village of tiny glowing aliens having a party! 🎉 They cheer when they see {NAME} and give {NAME} a special friendship bracelet made of crystals. {NAME} dances with the aliens until the twin moons rise. Best. Day. Ever!',
      isEnd: true,
      endType: 'great',
    },
    e3: {
      id: 'e3',
      emoji: '🐙',
      title: 'Undersea Palace!',
      text: 'Under the glowing lake is a whole underwater palace made of coral and starlight! 🏰 {NAME} meets the lake queen — a giant friendly jellyfish who gives {NAME} a special jellyfish crown. {NAME} is now an honorary citizen of the Undersea Kingdom!',
      isEnd: true,
      endType: 'great',
    },
    e4: {
      id: 'e4',
      emoji: '🌈',
      title: 'Cloud Castle!',
      text: 'Above the purple clouds is a floating castle made entirely of fluffy rainbow clouds! ☁️ {NAME} bounces from room to room. Each bounce shoots colourful fireworks into the sky. The whole planet comes out to watch the show {NAME} accidentally put on!',
      isEnd: true,
      endType: 'fun',
    },
  },
}

// ─────────────────────────────────────────────
// STORY 2: Ocean Explorer
// ─────────────────────────────────────────────
const oceanStory: Story = {
  id: 'ocean',
  title: '{NAME} and the Sunken City',
  emoji: '🤿',
  themeEmoji: '🌊',
  color: 'from-blue-400 to-cyan-500',
  bg: 'bg-cyan-50',
  startId: 'o1',
  scenes: {
    o1: {
      id: 'o1',
      emoji: '🐠',
      title: 'Deep Dive!',
      text: '{NAME} is a deep-sea explorer in a bright yellow submarine! 🟡 Suddenly the submarine lights flicker — a whole city of ancient ruins appears on the ocean floor. Two pathways lead into the city: one lit by lanternfish and one paved with glowing pearls.',
      choices: [
        { label: 'Follow the lanternfish', next: 'o2a' },
        { label: 'Walk the pearl path', next: 'o2b' },
      ],
    },
    o2a: {
      id: 'o2a',
      emoji: '🐡',
      title: 'The Fish Library',
      text: 'The lanternfish lead {NAME} to an enormous library — but all the books are made of seaweed and the pages are written in bubbles! 📚 A wise old octopus librarian hands {NAME} a magical book. It can only be opened with a song or with a rhyme.',
      choices: [
        { label: 'Sing a little song', next: 'oe1', coinsBonus: 5 },
        { label: 'Say a funny rhyme', next: 'oe2' },
      ],
    },
    o2b: {
      id: 'o2b',
      emoji: '🦭',
      title: 'The Pearl Square',
      text: 'The pearl path leads to a grand square where mermaids and sea-lions are having a market! 🛍️ A baby sea-turtle tugs at {NAME}\'s fin-boot and points at two treasure chests: one covered in barnacles and one decorated with seashells.',
      choices: [
        { label: 'Open the barnacle chest', next: 'oe3' },
        { label: 'Open the seashell chest', next: 'oe4' },
      ],
    },
    oe1: {
      id: 'oe1',
      emoji: '📖',
      title: 'The Ocean\'s Secret!',
      text: '{NAME} hums a little tune and the magical book flies open! Inside is the history of the entire ocean written in pictures of fish, coral, and shooting stars. 🌟 The octopus librarian stamps {NAME}\'s explorer card: "Ocean Champion!" What a find!',
      isEnd: true,
      endType: 'great',
    },
    oe2: {
      id: 'oe2',
      emoji: '🎭',
      title: 'Bubble Poetry!',
      text: '{NAME} says, "Fishy fishy in the sea, share your secrets all with me!" 🫧 Suddenly hundreds of bubbles float up, each one containing a tiny scene from the city\'s ancient history. {NAME} watches a whole underwater movie for free. The greatest show under the sea!',
      isEnd: true,
      endType: 'fun',
    },
    oe3: {
      id: 'oe3',
      emoji: '🦀',
      title: 'Crab Dance Party!',
      text: 'Out pop one hundred tiny dancing crabs! 🦀🦀 They pull {NAME} into the middle of a clacking, snapping crab dance party. {NAME} learns all the moves and is crowned the Official Crab Dance Champion of the Deep! The seahorses even make a trophy.',
      isEnd: true,
      endType: 'fun',
    },
    oe4: {
      id: 'oe4',
      emoji: '💫',
      title: 'Treasure Map!',
      text: 'The seashell chest holds a glowing treasure map that leads to the heart of the sunken city — a garden where coral flowers bloom in every colour imaginable! 🌸🌺 {NAME} plants a new seed in the garden and the mermaids promise to water it every day.',
      isEnd: true,
      endType: 'great',
    },
  },
}

// ─────────────────────────────────────────────
// STORY 3: Jungle Quest
// ─────────────────────────────────────────────
const jungleStory: Story = {
  id: 'jungle',
  title: '{NAME}\'s Jungle Quest',
  emoji: '🌿',
  themeEmoji: '🦜',
  color: 'from-green-400 to-emerald-600',
  bg: 'bg-emerald-50',
  startId: 'j1',
  scenes: {
    j1: {
      id: 'j1',
      emoji: '🦜',
      title: 'Into the Jungle!',
      text: '{NAME} swings through the treetops on a vine! 🌴 A colourful parrot named Pepper flies up and drops a crumpled map. It shows a legendary treasure hidden in the jungle — guarded by two ancient stone statues. Left statue or right statue?',
      choices: [
        { label: 'Go to the left statue', next: 'j2a' },
        { label: 'Go to the right statue', next: 'j2b' },
      ],
    },
    j2a: {
      id: 'j2a',
      emoji: '🐒',
      title: 'Monkey Village',
      text: 'The left statue is covered in monkeys playing drums! 🥁 Their chief — a big monkey with a flower crown — points at {NAME} and says (in monkey language) that {NAME} must complete a challenge to pass. Dance or drum?',
      choices: [
        { label: 'Show off some dance moves', next: 'je1', coinsBonus: 5 },
        { label: 'Try to play the drums', next: 'je2' },
      ],
    },
    j2b: {
      id: 'j2b',
      emoji: '🌸',
      title: 'The Flower Temple',
      text: 'The right statue is wrapped in giant flowers that glow at night! ✨ Inside the temple, a friendly wise owl sits on a perch. "Answer my question," it hoots, "and the treasure is yours." The owl asks: what is bigger — a kindness or a coin?',
      choices: [
        { label: 'A kindness!', next: 'je3', coinsBonus: 10 },
        { label: 'A coin!', next: 'je4' },
      ],
    },
    je1: {
      id: 'je1',
      emoji: '🎊',
      title: 'Dance Champion!',
      text: '{NAME} does an amazing dance — spinning, jumping and wiggling! 🕺 The monkeys go wild, hooting and clapping! The chief puts the flower crown on {NAME}\'s head and leads the way to the treasure: a chest full of jungle jewels and golden bananas. Legend!',
      isEnd: true,
      endType: 'fun',
    },
    je2: {
      id: 'je2',
      emoji: '🥁',
      title: 'Jungle Rhythm!',
      text: '{NAME} bangs the drums and accidentally plays the secret treasure rhythm! 🎶 The ground shakes and a stone door opens in the statue\'s belly. Inside: the legendary golden vine necklace that grants the wearer the power to talk to animals for one whole day!',
      isEnd: true,
      endType: 'great',
    },
    je3: {
      id: 'je3',
      emoji: '🦁',
      title: 'A True Friend!',
      text: '"Correct!" hoots the owl. "Kindness is the greatest treasure." A door behind the owl swings open and out walks a baby lion who has been lonely for years! 🦁 The lion chooses {NAME} as its best friend. They walk out of the jungle together, side by side.',
      isEnd: true,
      endType: 'great',
    },
    je4: {
      id: 'je4',
      emoji: '🦉',
      title: 'The Real Treasure!',
      text: '"Hmm!" hoots the owl with a wink. "Gold is shiny — but watch!" The owl drops a coin and gives {NAME} a hug. The hug makes {NAME} feel warm all the way to their toes. "THAT," says the owl, "is bigger." {NAME} laughs and the owl gives {NAME} the treasure anyway.',
      isEnd: true,
      endType: 'great',
    },
  },
}

// ─────────────────────────────────────────────
// STORY 4: Magic Kingdom
// ─────────────────────────────────────────────
const magicStory: Story = {
  id: 'magic',
  title: '{NAME} and the Magic Kingdom',
  emoji: '🪄',
  themeEmoji: '✨',
  color: 'from-pink-400 to-purple-500',
  bg: 'bg-pink-50',
  startId: 'm1',
  scenes: {
    m1: {
      id: 'm1',
      emoji: '🏰',
      title: 'The Kingdom Needs Help!',
      text: '{NAME} is a young wizard who just got their first magic wand! 🪄 But today the Kingdom\'s Magic Rainbow has gone grey. Without the rainbow, nothing grows and everyone is sad. The royal map shows two possible paths to fix it: the Wishing Well and the Crystal Mountain.',
      choices: [
        { label: 'Visit the Wishing Well', next: 'm2a' },
        { label: 'Climb Crystal Mountain', next: 'm2b' },
      ],
    },
    m2a: {
      id: 'm2a',
      emoji: '💧',
      title: 'The Wishing Well',
      text: 'The Wishing Well glows silver in the moonlight. A tiny fairy pops out — she lost her colour-bag and all the rainbow\'s colours leaked out! 🎨 She needs help mixing the colours back. She asks {NAME}: should we start with happy colours or magical colours?',
      choices: [
        { label: 'Mix the happy colours first', next: 'me1', coinsBonus: 5 },
        { label: 'Mix the magical colours first', next: 'me2' },
      ],
    },
    m2b: {
      id: 'm2b',
      emoji: '🔮',
      title: 'Crystal Mountain',
      text: 'Crystal Mountain shines even without colour! At the top lives an old dragon called Ember who collects broken rainbows. 🐉 Ember tells {NAME} that only a special spell can restart the rainbow. The spell needs either a brave word or a kind word. Which does {NAME} choose?',
      choices: [
        { label: 'Shout a brave word', next: 'me3' },
        { label: 'Whisper a kind word', next: 'me4' },
      ],
    },
    me1: {
      id: 'me1',
      emoji: '🌈',
      title: 'Rainbow Restored!',
      text: '{NAME} mixes yellow, orange and pink — the happiest colours! ☀️ With a wave of {NAME}\'s wand, the colours zoom into the sky and the Magic Rainbow bursts back in full glory! Flowers bloom instantly, birds sing again, and the whole Kingdom cheers {NAME}\'s name!',
      isEnd: true,
      endType: 'great',
    },
    me2: {
      id: 'me2',
      emoji: '✨',
      title: 'Sparkle Everywhere!',
      text: '{NAME} mixes purple, teal and gold — magical colours! The fairy sprinkles them into the air and they turn into sparkles that drift across the whole Kingdom. 🌟 Every house, tree and flower gets a sparkle dot. It\'s the most beautiful thing anyone has ever seen!',
      isEnd: true,
      endType: 'great',
    },
    me3: {
      id: 'me3',
      emoji: '⚡',
      title: 'Thunder Spell!',
      text: '{NAME} shouts "COLOUR!" as loudly as possible! ⚡ Thunder crackles, lightning flashes rainbow colours, and the sky fills with the biggest, brightest rainbow anyone has seen in 500 years! Ember dances a happy dragon dance (very wiggly). The Kingdom is saved!',
      isEnd: true,
      endType: 'fun',
    },
    me4: {
      id: 'me4',
      emoji: '🌸',
      title: 'The Kindness Rainbow!',
      text: '{NAME} closes their eyes and whispers, "Please come back, little rainbow. Everyone misses you." 🌸 A soft glow spreads from {NAME}\'s heart. Ember gasps — this is the legendary Kindness Rainbow, twice as bright and three times as long as any before it. Perfect!',
      isEnd: true,
      endType: 'great',
    },
  },
}

// ─────────────────────────────────────────────
// STORY 5: Dino Discovery
// ─────────────────────────────────────────────
const dinoStory: Story = {
  id: 'dinos',
  title: '{NAME}\'s Dino Discovery',
  emoji: '🦕',
  themeEmoji: '🌋',
  color: 'from-lime-400 to-green-600',
  bg: 'bg-lime-50',
  startId: 'd1',
  scenes: {
    d1: {
      id: 'd1',
      emoji: '⏰',
      title: 'Time Travel!',
      text: '{NAME} steps into a bright blue time machine and WHOOSH — lands 65 million years in the past! 🌿 Outside the window: dinosaurs everywhere! A friendly brontosaurus pokes its head in and sneezes confetti. A T-Rex pup and a triceratops pup are waiting to play. Who does {NAME} visit first?',
      choices: [
        { label: 'Play with the T-Rex pup', next: 'd2a' },
        { label: 'Play with the triceratops pup', next: 'd2b' },
      ],
    },
    d2a: {
      id: 'd2a',
      emoji: '🦖',
      title: 'T-Rex Trouble!',
      text: 'The T-Rex pup is tiny — about the size of a dog — but VERY bouncy! 🐾 It keeps jumping on {NAME} and licking {NAME}\'s face. Then it steals {NAME}\'s explorer hat and runs away! {NAME} can either chase it through the fern forest or climb the volcano to watch from above.',
      choices: [
        { label: 'Chase through the fern forest', next: 'de1' },
        { label: 'Watch from the volcano', next: 'de2' },
      ],
    },
    d2b: {
      id: 'd2b',
      emoji: '🦏',
      title: 'Triceratops Games!',
      text: 'The triceratops pup challenges {NAME} to a game! 🎮 First it points at a mud puddle (splashing contest?), then it points at a pile of giant leaves (building contest?). {NAME} gets to pick.',
      choices: [
        { label: 'Have a mud-splashing contest', next: 'de3', coinsBonus: 5 },
        { label: 'Build a leaf fort together', next: 'de4' },
      ],
    },
    de1: {
      id: 'de1',
      emoji: '🌿',
      title: 'Hat Found!',
      text: '{NAME} chases the T-Rex through ferns taller than houses! 🌿 At last the pup stops in a clearing — inside the hat it has been building a tiny nest! It stares up at {NAME} with big puppy eyes. {NAME} lets the T-Rex keep the hat and makes a new explorer crown from jungle flowers instead.',
      isEnd: true,
      endType: 'fun',
    },
    de2: {
      id: 'de2',
      emoji: '🌋',
      title: 'Volcano View!',
      text: '{NAME} climbs to the volcano\'s edge and spots the T-Rex pup from way up high — it is sitting next to the time machine looking confused! 🏔️ {NAME} slides all the way down (super fast!), retrieves the hat, and gives the pup a big hug. They watch the sunset over a prehistoric world together.',
      isEnd: true,
      endType: 'great',
    },
    de3: {
      id: 'de3',
      emoji: '💦',
      title: 'Mud Champion!',
      text: 'SPLASH! {NAME} and the triceratops both jump into the mud puddle at the exact same time! 💦🦏 Mud flies EVERYWHERE — even onto a nearby stegosaurus who starts laughing. Soon every dino nearby is splashing and {NAME} is crowned the Prehistoric Mud Champion. A title held for 65 million years!',
      isEnd: true,
      endType: 'fun',
    },
    de4: {
      id: 'de4',
      emoji: '🏡',
      title: 'The Leaf Fort!',
      text: '{NAME} and the triceratops stack giant leaves into the most magnificent fort! 🍃 When it\'s done it has three rooms and a look-out tower. A family of pterodactyls ask if they can rent the top room. {NAME} says yes. The triceratops brings in a comfy moss chair. Home sweet prehistoric home!',
      isEnd: true,
      endType: 'great',
    },
  },
}

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────
export const STORIES: Story[] = [spaceStory, oceanStory, jungleStory, magicStory, dinoStory]

export function getStoryById(id: string): Story {
  return STORIES.find((s) => s.id === id) ?? STORIES[0]
}

export function interpolate(text: string, name?: string): string {
  const displayName = name?.trim() || 'You'
  return text.replaceAll('{NAME}', displayName)
}
