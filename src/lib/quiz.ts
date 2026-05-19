// Quiz game content — 5 levels × 5 questions per theme
// {NAME} is replaced at render time

export type QuizQuestion = {
  id: string
  question: string       // may contain {NAME}
  illustration: string   // large emoji shown as the "character art"
  answers: string[]      // exactly 4
  correct: number        // index 0-3
  level: 1 | 2 | 3 | 4 | 5
}

export const QUIZ_THEMES = [
  'animals', 'dinos', 'unicorns', 'ocean',
  'space', 'superheroes', 'farm', 'food',
] as const

export type QuizThemeId = typeof QUIZ_THEMES[number]

// ─── Content ──────────────────────────────────────────────────────────────────

const QUESTIONS: Record<string, QuizQuestion[]> = {
  animals: [
    // Level 1 — visual / sound
    { id: 'a1-1', level: 1, illustration: '🐶', question: 'Which animal says WOOF?',           answers: ['Dog', 'Cat', 'Duck', 'Cow'],            correct: 0 },
    { id: 'a1-2', level: 1, illustration: '🐱', question: 'Which animal says MEOW?',           answers: ['Dog', 'Cat', 'Bird', 'Frog'],           correct: 1 },
    { id: 'a1-3', level: 1, illustration: '🐸', question: 'Which animal can jump really high and lives near ponds?', answers: ['Cat', 'Horse', 'Frog', 'Bear'], correct: 2 },
    { id: 'a1-4', level: 1, illustration: '🦁', question: 'Which animal is called the King of the Jungle?', answers: ['Tiger', 'Elephant', 'Giraffe', 'Lion'], correct: 3 },
    { id: 'a1-5', level: 1, illustration: '🐘', question: 'Which animal has the LONGEST nose?', answers: ['Giraffe', 'Hippo', 'Elephant', 'Rhino'],  correct: 2 },
    // Level 2
    { id: 'a2-1', level: 2, illustration: '🦒', question: 'Which animal has the TALLEST neck?', answers: ['Camel', 'Giraffe', 'Horse', 'Zebra'],    correct: 1 },
    { id: 'a2-2', level: 2, illustration: '🐧', question: 'Which bird cannot fly but swims great?', answers: ['Eagle', 'Penguin', 'Parrot', 'Owl'],  correct: 1 },
    { id: 'a2-3', level: 2, illustration: '🦊', question: 'What colour is a fox?', answers: ['Blue', 'Green', 'Orange-red', 'Purple'],              correct: 2 },
    { id: 'a2-4', level: 2, illustration: '🐼', question: 'Pandas are famous for eating which plant?', answers: ['Grass', 'Bamboo', 'Cactus', 'Leaves'], correct: 1 },
    { id: 'a2-5', level: 2, illustration: '🐢', question: 'Which animal carries its home on its back?', answers: ['Snail', 'Turtle', 'Both!', 'Crab'], correct: 2 },
    // Level 3
    { id: 'a3-1', level: 3, illustration: '🦅', question: '{NAME}, which bird has the best eyesight?', answers: ['Parrot', 'Penguin', 'Eagle', 'Pigeon'], correct: 2 },
    { id: 'a3-2', level: 3, illustration: '🐬', question: 'Dolphins communicate using?',        answers: ['Roars', 'Clicks & whistles', 'Barks', 'Silence'], correct: 1 },
    { id: 'a3-3', level: 3, illustration: '🦋', question: 'What does a caterpillar turn into?', answers: ['Moth', 'Bee', 'Butterfly', 'Dragonfly'],  correct: 2 },
    { id: 'a3-4', level: 3, illustration: '🦓', question: 'Every zebra has a unique pattern of?', answers: ['Spots', 'Stripes', 'Dots', 'Patches'],  correct: 1 },
    { id: 'a3-5', level: 3, illustration: '🦜', question: 'Which bird can mimic human speech?', answers: ['Toucan', 'Penguin', 'Parrot', 'Flamingo'], correct: 2 },
    // Level 4
    { id: 'a4-1', level: 4, illustration: '🦈', question: 'Sharks must keep swimming or they will?', answers: ['Float up', 'Sink & die', 'Explode', 'Sleep'],    correct: 1 },
    { id: 'a4-2', level: 4, illustration: '🐙', question: 'How many hearts does an octopus have?', answers: ['One', 'Two', 'Three', 'Four'],         correct: 2 },
    { id: 'a4-3', level: 4, illustration: '🦒', question: 'A giraffe\'s tongue is what unusual colour?', answers: ['Pink', 'Red', 'Blue-black', 'Orange'], correct: 2 },
    { id: 'a4-4', level: 4, illustration: '🐝', question: 'A honeybee visits how many flowers to make one jar of honey?', answers: ['100', '1,000', '2 million', '500'], correct: 2 },
    { id: 'a4-5', level: 4, illustration: '🦜', question: '{NAME} — what is a group of owls called?', answers: ['Flock', 'Parliament', 'Gaggle', 'Pack'], correct: 1 },
    // Level 5
    { id: 'a5-1', level: 5, illustration: '🐋', question: 'The blue whale is the largest animal ever — how long can it get?', answers: ['10m', '20m', '30m', '40m'], correct: 2 },
    { id: 'a5-2', level: 5, illustration: '🦎', question: 'Which lizard can change colour to blend in?', answers: ['Gecko', 'Monitor', 'Chameleon', 'Iguana'], correct: 2 },
    { id: 'a5-3', level: 5, illustration: '🐬', question: 'Dolphins sleep with one eye open because?', answers: ['They are scared', 'Half their brain stays awake', 'They see in dark', 'Fun fact'], correct: 1 },
    { id: 'a5-4', level: 5, illustration: '🦁', question: 'Female lions (lionesses) do most of the?', answers: ['Sleeping', 'Roaring', 'Hunting', 'Grooming'], correct: 2 },
    { id: 'a5-5', level: 5, illustration: '🐘', question: 'An elephant\'s pregnancy lasts how long?', answers: ['3 months', '9 months', '2 years', '22 months'], correct: 3 },
  ],

  dinos: [
    { id: 'd1-1', level: 1, illustration: '🦕', question: 'Which dinosaur had the LONG neck?',   answers: ['T-Rex', 'Brachiosaurus', 'Raptor', 'Stegosaurus'], correct: 1 },
    { id: 'd1-2', level: 1, illustration: '🦖', question: 'T-Rex had tiny?',                     answers: ['Eyes', 'Arms', 'Legs', 'Tail'],           correct: 1 },
    { id: 'd1-3', level: 1, illustration: '🥚', question: 'Baby dinosaurs hatched from?',         answers: ['Pouches', 'Eggs', 'Burrows', 'Trees'],    correct: 1 },
    { id: 'd1-4', level: 1, illustration: '🌋', question: 'Dinosaurs lived a LONG time ago — how many million years?', answers: ['1', '10', '65+', '5'], correct: 2 },
    { id: 'd1-5', level: 1, illustration: '🦴', question: 'Scientists learn about dinosaurs by studying their?', answers: ['Photos', 'Fossils', 'Books', 'Videos'], correct: 1 },
    { id: 'd2-1', level: 2, illustration: '🦕', question: 'Which was the BIGGEST plant-eating dinosaur?', answers: ['T-Rex', 'Raptor', 'Brachiosaurus', 'Ankylosaurus'], correct: 2 },
    { id: 'd2-2', level: 2, illustration: '🦖', question: 'Velociraptor means?',                 answers: ['Fast bird', 'Swift thief', 'Big claw', 'Sky hunter'], correct: 1 },
    { id: 'd2-3', level: 2, illustration: '🦴', question: 'The Stegosaurus had plates on its?',   answers: ['Head', 'Belly', 'Back', 'Tail'],          correct: 2 },
    { id: 'd2-4', level: 2, illustration: '🥚', question: 'Which flying reptile lived at the same time as dinosaurs?', answers: ['Bat', 'Pterodactyl', 'Eagle', 'Dragonfly'], correct: 1 },
    { id: 'd2-5', level: 2, illustration: '🌿', question: 'Plant-eating dinosaurs are called?',   answers: ['Carnivores', 'Omnivores', 'Herbivores', 'Dino-vores'], correct: 2 },
    { id: 'd3-1', level: 3, illustration: '🦖', question: '{NAME}, what does "carnivore" mean?',  answers: ['Plant eater', 'Meat eater', 'Rock eater', 'All eater'], correct: 1 },
    { id: 'd3-2', level: 3, illustration: '🦕', question: 'Diplodocus could be as long as?',      answers: ['5 metres', '10 metres', '27 metres', '50 metres'], correct: 2 },
    { id: 'd3-3', level: 3, illustration: '🦴', question: 'Which dino had a club on its tail?',   answers: ['T-Rex', 'Triceratops', 'Ankylosaurus', 'Raptor'], correct: 2 },
    { id: 'd3-4', level: 3, illustration: '🌋', question: 'Why did dinosaurs die out?',           answers: ['Too cold', 'Asteroid impact', 'Floods', 'Humans'], correct: 1 },
    { id: 'd3-5', level: 3, illustration: '🥚', question: 'Triceratops had how many horns?',      answers: ['One', 'Two', 'Three', 'Four'],            correct: 2 },
    { id: 'd4-1', level: 4, illustration: '🦖', question: 'T-Rex could bite with a force of?',   answers: ['100 kg', '500 kg', '3,600 kg', '100 kg'], correct: 2 },
    { id: 'd4-2', level: 4, illustration: '🦕', question: 'Modern birds evolved from which type?', answers: ['Marine dinos', 'Theropod dinos', 'Sauropods', 'Pterosaurs'], correct: 1 },
    { id: 'd4-3', level: 4, illustration: '🌿', question: 'Spinosaurus was longer than T-Rex and lived near?', answers: ['Deserts', 'Mountains', 'Water', 'Forests'], correct: 2 },
    { id: 'd4-4', level: 4, illustration: '🦴', question: 'Fossil means rock-preserved remains — the word comes from?', answers: ['French', 'Latin "fossus"', 'Greek', 'English'], correct: 1 },
    { id: 'd4-5', level: 4, illustration: '🦖', question: '{NAME} — Raptors hunted in?',         answers: ['Solo', 'Pairs', 'Packs', 'Hundreds'],    correct: 2 },
    { id: 'd5-1', level: 5, illustration: '🦕', question: 'The tallest dinosaur could reach the height of a?', answers: ['Bus', 'House', 'Six-story building', 'Tree'], correct: 2 },
    { id: 'd5-2', level: 5, illustration: '🌋', question: 'The extinction event that killed dinosaurs happened how long ago?', answers: ['6 million yrs', '66 million yrs', '166 million yrs', '600 yrs'], correct: 1 },
    { id: 'd5-3', level: 5, illustration: '🦖', question: 'Giganotosaurus was T-Rex\'s rival from?', answers: ['North America', 'South America', 'Africa', 'Asia'], correct: 1 },
    { id: 'd5-4', level: 5, illustration: '🥚', question: 'The fastest dinosaur scientists know was?', answers: ['T-Rex', 'Gallimimus', 'Compsognathus', 'Ornithomimus'], correct: 3 },
    { id: 'd5-5', level: 5, illustration: '🦴', question: 'Which dino had the thickest skull (dome-headed)?', answers: ['Triceratops', 'Pachycephalosaurus', 'Stegosaurus', 'Raptor'], correct: 1 },
  ],

  unicorns: [
    { id: 'u1-1', level: 1, illustration: '🦄', question: 'What is special about a unicorn?',   answers: ['Wings', 'Magic horn', 'Long tail', 'Golden hooves'], correct: 1 },
    { id: 'u1-2', level: 1, illustration: '🌈', question: 'How many colours are in a rainbow?',  answers: ['5', '6', '7', '8'],                      correct: 2 },
    { id: 'u1-3', level: 1, illustration: '⭐', question: 'Stars appear in the?',                answers: ['Ocean', 'Sky', 'Forest', 'Garden'],       correct: 1 },
    { id: 'u1-4', level: 1, illustration: '✨', question: 'A fairy godmother grants?',           answers: ['Candy', 'Wishes', 'Books', 'Games'],      correct: 1 },
    { id: 'u1-5', level: 1, illustration: '🎀', question: 'A bow tied in hair is called a?',    answers: ['Ribbon', 'Knot', 'Crown', 'Band'],        correct: 0 },
    { id: 'u2-1', level: 2, illustration: '🌸', question: 'Cherry blossoms are which colour?',  answers: ['Blue', 'Green', 'Pink', 'Orange'],        correct: 2 },
    { id: 'u2-2', level: 2, illustration: '💎', question: 'The hardest gemstone is a?',         answers: ['Ruby', 'Emerald', 'Sapphire', 'Diamond'], correct: 3 },
    { id: 'u2-3', level: 2, illustration: '🌙', question: 'What shape is the moon when it\'s full?', answers: ['Half circle', 'Crescent', 'Full circle', 'Star'], correct: 2 },
    { id: 'u2-4', level: 2, illustration: '🦋', question: 'Butterflies taste with their?',     answers: ['Tongue', 'Wings', 'Feet', 'Eyes'],         correct: 2 },
    { id: 'u2-5', level: 2, illustration: '🌷', question: '{NAME}, tulips grow from?',         answers: ['Seeds', 'Bulbs', 'Cuttings', 'Water'],     correct: 1 },
    { id: 'u3-1', level: 3, illustration: '🌈', question: 'What causes a rainbow?',            answers: ['Wind & sun', 'Rain & sunlight', 'Clouds', 'Magic'], correct: 1 },
    { id: 'u3-2', level: 3, illustration: '🧚', question: 'A fairy\'s home is often in a?',    answers: ['City', 'Cave', 'Toadstool/flowers', 'Sea'], correct: 2 },
    { id: 'u3-3', level: 3, illustration: '⭐', question: 'The North Star helps people find which direction?', answers: ['South', 'East', 'West', 'North'], correct: 3 },
    { id: 'u3-4', level: 3, illustration: '🦄', question: 'In mythology, unicorn horns were believed to?', answers: ['Give flight', 'Purify water', 'Grant wishes', 'Glow'], correct: 1 },
    { id: 'u3-5', level: 3, illustration: '💫', question: 'A shooting star is really a?',       answers: ['Fallen angel', 'Meteor', 'Broken planet', 'Firefly'], correct: 1 },
    { id: 'u4-1', level: 4, illustration: '🌙', question: 'The moon controls Earth\'s?',        answers: ['Weather', 'Tides', 'Wind', 'Temperature'], correct: 1 },
    { id: 'u4-2', level: 4, illustration: '🌸', question: 'Japan celebrates cherry blossoms in a festival called?', answers: ['Diwali', 'Hanami', 'Carnival', 'Sakura-run'], correct: 1 },
    { id: 'u4-3', level: 4, illustration: '💎', question: 'Diamonds form under intense pressure for how long?', answers: ['Days', 'Years', 'Centuries', 'Billions of years'], correct: 3 },
    { id: 'u4-4', level: 4, illustration: '🌈', question: 'The colours of the rainbow in order are?', answers: ['Red to Violet', 'Blue to Red', 'Green to Orange', 'Yellow first'], correct: 0 },
    { id: 'u4-5', level: 4, illustration: '✨', question: '{NAME} — bioluminescent creatures glow by?', answers: ['Eating stars', 'Chemical reaction', 'Absorbing sun', 'Magic'], correct: 1 },
    { id: 'u5-1', level: 5, illustration: '🦄', question: 'The unicorn is the national animal of?', answers: ['Ireland', 'Wales', 'Scotland', 'England'], correct: 2 },
    { id: 'u5-2', level: 5, illustration: '💎', question: 'Hope Diamond is famous for its unusual?', answers: ['Size only', 'Deep blue colour', 'Red glow', 'Floating power'], correct: 1 },
    { id: 'u5-3', level: 5, illustration: '⭐', question: 'Stars are made mostly of?',          answers: ['Ice & rock', 'Hydrogen & helium', 'Iron & gold', 'Fire & air'], correct: 1 },
    { id: 'u5-4', level: 5, illustration: '🌈', question: 'A double rainbow appears when light is reflected how many times inside a raindrop?', answers: ['Once', 'Twice', 'Three times', 'Four'], correct: 1 },
    { id: 'u5-5', level: 5, illustration: '🧚', question: 'The Tooth Fairy legend is most popular in which countries?', answers: ['Asia', 'Africa', 'Western countries', 'Antarctica'], correct: 2 },
  ],

  ocean: [
    { id: 'o1-1', level: 1, illustration: '🐠', question: 'Fish breathe using?',               answers: ['Lungs', 'Gills', 'Nose', 'Skin'],          correct: 1 },
    { id: 'o1-2', level: 1, illustration: '🦀', question: 'Crabs walk?',                        answers: ['Forwards', 'Backwards', 'Sideways', 'Spinning'], correct: 2 },
    { id: 'o1-3', level: 1, illustration: '🐙', question: 'How many arms does an octopus have?', answers: ['4', '6', '8', '10'],                      correct: 2 },
    { id: 'o1-4', level: 1, illustration: '🌊', question: 'The ocean is mostly which colour?',   answers: ['Green', 'Blue', 'Purple', 'Clear'],        correct: 1 },
    { id: 'o1-5', level: 1, illustration: '🐚', question: 'You can hear the ocean in a?',        answers: ['Rock', 'Shell', 'Jar', 'Cup'],             correct: 1 },
    { id: 'o2-1', level: 2, illustration: '🦈', question: 'Sharks have skeletons made of?',      answers: ['Bone', 'Cartilage', 'Metal', 'Plastic'],   correct: 1 },
    { id: 'o2-2', level: 2, illustration: '🐬', question: 'Dolphins are?',                       answers: ['Fish', 'Reptiles', 'Mammals', 'Birds'],    correct: 2 },
    { id: 'o2-3', level: 2, illustration: '🐙', question: 'Octopuses change colour to?',         answers: ['Look pretty', 'Camouflage & communicate', 'Stay warm', 'Attract mates'], correct: 1 },
    { id: 'o2-4', level: 2, illustration: '🦞', question: 'A lobster\'s blood is which colour?', answers: ['Red', 'White', 'Blue', 'Green'],           correct: 2 },
    { id: 'o2-5', level: 2, illustration: '🌊', question: '{NAME} — what percentage of Earth is covered by ocean?', answers: ['30%', '50%', '71%', '90%'], correct: 2 },
    { id: 'o3-1', level: 3, illustration: '🐠', question: 'Clownfish live in?',                 answers: ['Coral', 'Sea anemones', 'Seaweed', 'Sand'], correct: 1 },
    { id: 'o3-2', level: 3, illustration: '🦭', question: 'Seals and sea lions are related to?', answers: ['Dogs', 'Bears', 'Weasels', 'All three!'], correct: 2 },
    { id: 'o3-3', level: 3, illustration: '🐋', question: 'Blue whale songs can travel how far?', answers: ['1 km', '10 km', '100 km', '1,600+ km'], correct: 3 },
    { id: 'o3-4', level: 3, illustration: '🦑', question: 'Giant squid eyes are the size of a?', answers: ['Golf ball', 'Tennis ball', 'Basketball', 'Dinner plate'], correct: 3 },
    { id: 'o3-5', level: 3, illustration: '🐚', question: 'Coral reefs are made by tiny animals called?', answers: ['Coral fish', 'Coral polyps', 'Sea worms', 'Plankton'], correct: 1 },
    { id: 'o4-1', level: 4, illustration: '🦈', question: 'Great white sharks can detect blood from?', answers: ['1m away', '100m away', '1 km away', '5 km away'], correct: 2 },
    { id: 'o4-2', level: 4, illustration: '🐙', question: 'Mimic octopus can copy the appearance of how many animals?', answers: ['3', '8', '15+', '100'], correct: 2 },
    { id: 'o4-3', level: 4, illustration: '🌊', question: 'The deepest ocean point is Mariana Trench at?', answers: ['3 km', '6 km', '11 km', '20 km'], correct: 2 },
    { id: 'o4-4', level: 4, illustration: '🐬', question: 'Dolphins have a sense called echolocation. They use it to?', answers: ['See colour', 'Navigate & hunt by sound', 'Taste food', 'Sleep'], correct: 1 },
    { id: 'o4-5', level: 4, illustration: '🦐', question: '{NAME} — a mantis shrimp can punch with the force of a?', answers: ['Finger flick', 'Strong punch', '.22 calibre bullet', 'Hammer'], correct: 2 },
    { id: 'o5-1', level: 5, illustration: '🐋', question: 'How long can sperm whales hold their breath?', answers: ['5 min', '20 min', '90 min', '24 hrs'], correct: 2 },
    { id: 'o5-2', level: 5, illustration: '🦑', question: 'Bioluminescent creatures produce light through a?', answers: ['Battery organ', 'Chemical reaction (luciferin)', 'Solar cell', 'Diet of stars'], correct: 1 },
    { id: 'o5-3', level: 5, illustration: '🦈', question: 'Sharks pre-date dinosaurs — they have existed for?', answers: ['100M years', '200M years', '450M years', '1B years'], correct: 2 },
    { id: 'o5-4', level: 5, illustration: '🐙', question: 'Octopuses have THREE hearts; two pump blood to gills, one pumps to?', answers: ['Brain', 'Arms', 'Body', 'Eggs'], correct: 2 },
    { id: 'o5-5', level: 5, illustration: '🌊', question: 'Ocean acidification is caused by oceans absorbing?', answers: ['Heat', 'CO₂', 'Salt', 'Plastic'], correct: 1 },
  ],

  space: [
    { id: 's1-1', level: 1, illustration: '🚀', question: 'Astronauts travel to space in a?',    answers: ['Plane', 'Rocket', 'Car', 'Submarine'],     correct: 1 },
    { id: 's1-2', level: 1, illustration: '🌙', question: 'The Moon orbits the?',                answers: ['Sun', 'Mars', 'Earth', 'Jupiter'],          correct: 2 },
    { id: 's1-3', level: 1, illustration: '⭐', question: 'The Sun is a giant?',                  answers: ['Planet', 'Moon', 'Star', 'Comet'],          correct: 2 },
    { id: 's1-4', level: 1, illustration: '🌍', question: 'Earth is the planet we live on. It is number from the Sun?', answers: ['1st', '2nd', '3rd', '4th'], correct: 2 },
    { id: 's1-5', level: 1, illustration: '🪐', question: 'Which planet has beautiful rings?',    answers: ['Mars', 'Jupiter', 'Saturn', 'Venus'],       correct: 2 },
    { id: 's2-1', level: 2, illustration: '🌙', question: 'Humans first landed on the Moon in?', answers: ['1955', '1969', '1985', '2000'],             correct: 1 },
    { id: 's2-2', level: 2, illustration: '🪐', question: 'The biggest planet in our solar system is?', answers: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'], correct: 2 },
    { id: 's2-3', level: 2, illustration: '☄️', question: 'A comet is made of?',               answers: ['Lava', 'Ice & dust', 'Metal', 'Fire'],       correct: 1 },
    { id: 's2-4', level: 2, illustration: '🌍', question: '{NAME}, how long does Earth take to go around the Sun?', answers: ['24 hours', '7 days', '365 days', '100 days'], correct: 2 },
    { id: 's2-5', level: 2, illustration: '🛸', question: 'A "light-year" measures?',             answers: ['Time', 'Weight', 'Distance', 'Speed'],      correct: 2 },
    { id: 's3-1', level: 3, illustration: '🌟', question: 'Our galaxy is called the?',            answers: ['Andromeda', 'Milky Way', 'Cosmos', 'Star Stream'], correct: 1 },
    { id: 's3-2', level: 3, illustration: '🚀', question: 'The International Space Station orbits Earth every?', answers: ['24 hours', '92 minutes', '7 days', '30 days'], correct: 1 },
    { id: 's3-3', level: 3, illustration: '🌍', question: 'The ozone layer protects Earth from?', answers: ['Asteroids', 'UV radiation', 'Aliens', 'Gravity'], correct: 1 },
    { id: 's3-4', level: 3, illustration: '⭐', question: 'What is a neutron star?',              answers: ['A cold star', 'Collapsed massive star', 'Baby star', 'Dying sun'], correct: 1 },
    { id: 's3-5', level: 3, illustration: '🪐', question: 'How many moons does Jupiter have?',   answers: ['4', '16', '27', '95+'],                     correct: 3 },
    { id: 's4-1', level: 4, illustration: '🌌', question: 'A black hole is an area where gravity is so strong that?', answers: ['Stars form', 'Nothing escapes', 'Time freezes', 'Aliens live'], correct: 1 },
    { id: 's4-2', level: 4, illustration: '🚀', question: 'Speed of light is approximately?',     answers: ['1,000 km/s', '300,000 km/s', '10,000 km/s', '1M km/s'], correct: 1 },
    { id: 's4-3', level: 4, illustration: '🌙', question: 'The dark side of the Moon always faces?', answers: ['Earth', 'Sun', 'Away from Earth', 'Saturn'], correct: 2 },
    { id: 's4-4', level: 4, illustration: '🌍', question: 'Earth\'s core is made of?',           answers: ['Lava', 'Iron & nickel', 'Crystal', 'Water'], correct: 1 },
    { id: 's4-5', level: 4, illustration: '☄️', question: '{NAME} — the Chicxulub asteroid wiped out the dinosaurs approximately?', answers: ['1M years ago', '66M years ago', '200M years ago', '500 years ago'], correct: 1 },
    { id: 's5-1', level: 5, illustration: '🌌', question: 'Observable universe is approximately?', answers: ['1M light-years', '93 billion light-years', '1 billion ly', '100 trillion ly'], correct: 1 },
    { id: 's5-2', level: 5, illustration: '⭐', question: 'Quasars are the most luminous objects — powered by?', answers: ['Supernovae', 'Supermassive black holes', 'Giant stars', 'Dark matter'], correct: 1 },
    { id: 's5-3', level: 5, illustration: '🪐', question: 'Uranus rotates on its side because of?', answers: ['Solar winds', 'Ancient collision', 'Magnetic force', 'Gravity of Neptune'], correct: 1 },
    { id: 's5-4', level: 5, illustration: '🚀', question: 'The Voyager 1 probe launched in 1977 and is now in?', answers: ['Mars orbit', 'Asteroid belt', 'Interstellar space', 'Jupiter\'s moons'], correct: 2 },
    { id: 's5-5', level: 5, illustration: '🌙', question: 'Dark matter makes up approximately what % of the universe?', answers: ['5%', '27%', '68%', '95%'], correct: 1 },
  ],

  superheroes: [
    { id: 'sh1-1', level: 1, illustration: '⚡', question: 'Superheroes wear a?',               answers: ['Suit', 'Cape', 'Mask', 'All of these!'],   correct: 3 },
    { id: 'sh1-2', level: 1, illustration: '🦸', question: 'What do superheroes do?',            answers: ['Sleep all day', 'Help people', 'Cause problems', 'Hide'], correct: 1 },
    { id: 'sh1-3', level: 1, illustration: '💪', question: 'Which body part do strong superheroes show off?', answers: ['Knees', 'Elbows', 'Muscles', 'Ears'], correct: 2 },
    { id: 'sh1-4', level: 1, illustration: '🛡️', question: 'A shield is used for?',             answers: ['Eating', 'Sleeping', 'Protection', 'Cooking'], correct: 2 },
    { id: 'sh1-5', level: 1, illustration: '🔥', question: 'A hero who controls fire is called?', answers: ['Aquaman', 'Pyrokinetic', 'Frostbite', 'Windwalker'], correct: 1 },
    { id: 'sh2-1', level: 2, illustration: '🕷️', question: 'Spider-Man\'s power comes from?',   answers: ['Magic', 'A spider bite', 'Training', 'A suit'], correct: 1 },
    { id: 'sh2-2', level: 2, illustration: '🦇', question: 'Batman\'s symbol is a?',             answers: ['Spider', 'Bat', 'Eagle', 'Wolf'],           correct: 1 },
    { id: 'sh2-3', level: 2, illustration: '⚡', question: 'The Flash\'s superpower is extreme?', answers: ['Strength', 'Speed', 'Intelligence', 'Invisibility'], correct: 1 },
    { id: 'sh2-4', level: 2, illustration: '🌊', question: '{NAME} — Aquaman rules the?',        answers: ['Sky', 'Land', 'Ocean', 'Space'],            correct: 2 },
    { id: 'sh2-5', level: 2, illustration: '💥', question: 'Iron Man\'s suit is made of?',       answers: ['Wood', 'Plastic', 'Iron/titanium alloy', 'Gold'], correct: 2 },
    { id: 'sh3-1', level: 3, illustration: '🦸', question: 'Clark Kent is the secret identity of?', answers: ['Batman', 'Thor', 'Superman', 'Iron Man'], correct: 2 },
    { id: 'sh3-2', level: 3, illustration: '🛡️', question: 'Captain America\'s shield is made of?', answers: ['Steel', 'Vibranium', 'Adamantium', 'Titanium'], correct: 1 },
    { id: 'sh3-3', level: 3, illustration: '⚡', question: 'Thor is the god of?',                answers: ['Fire', 'War', 'Thunder', 'Wind'],           correct: 2 },
    { id: 'sh3-4', level: 3, illustration: '💜', question: 'The Incredible Hulk turns green when he\'s?', answers: ['Happy', 'Angry', 'Scared', 'Sleepy'], correct: 1 },
    { id: 'sh3-5', level: 3, illustration: '🕷️', question: 'Spider-Man\'s web is shot from his?', answers: ['Mouth', 'Eyes', 'Wrists', 'Fingers'],     correct: 2 },
    { id: 'sh4-1', level: 4, illustration: '🌀', question: 'Doctor Strange protects Earth as a?', answers: ['Wizard', 'Sorcerer Supreme', 'Time lord', 'Mystic guardian'], correct: 1 },
    { id: 'sh4-2', level: 4, illustration: '🦸', question: 'Wonder Woman is a princess from which island?', answers: ['Paradise Island', 'Themyscira', 'Asgard', 'Wakanda'], correct: 1 },
    { id: 'sh4-3', level: 4, illustration: '💥', question: 'Thanos wielded the?',               answers: ['Infinity Gauntlet', 'Power Ring', 'Time Stone', 'Mind Stone'], correct: 0 },
    { id: 'sh4-4', level: 4, illustration: '⚡', question: 'Black Panther rules which African country?', answers: ['Narnia', 'Wakanda', 'Zamunda', 'Asgard'], correct: 1 },
    { id: 'sh4-5', level: 4, illustration: '🛡️', question: '{NAME} — Kryptonite weakens which hero?', answers: ['Batman', 'Iron Man', 'Superman', 'Thor'], correct: 2 },
    { id: 'sh5-1', level: 5, illustration: '🌌', question: 'The Avengers was first assembled in the comics in?', answers: ['1943', '1963', '1979', '1985'], correct: 1 },
    { id: 'sh5-2', level: 5, illustration: '🦸', question: 'X-Men mutation is caused by the?',  answers: ['X-Gene', 'Mutant gene', 'M-Gene', 'Hero DNA'], correct: 0 },
    { id: 'sh5-3', level: 5, illustration: '🔮', question: 'Wanda Maximoff\'s power is?',        answers: ['Speed', 'Reality manipulation', 'Time travel', 'Telepathy only'], correct: 1 },
    { id: 'sh5-4', level: 5, illustration: '🕷️', question: 'Miles Morales got his powers from a genetically enhanced spider from which universe?', answers: ['Earth-616', 'Earth-1610', 'Earth-199999', 'Earth-001'], correct: 1 },
    { id: 'sh5-5', level: 5, illustration: '💥', question: 'Vision\'s body is made from?',       answers: ['Steel & circuits', 'Synthezoid (synthetic human)', 'Nanobots', 'Vibranium'], correct: 1 },
  ],

  farm: [
    { id: 'f1-1', level: 1, illustration: '🐄', question: 'Milk comes from a?',                 answers: ['Horse', 'Cow', 'Pig', 'Sheep'],             correct: 1 },
    { id: 'f1-2', level: 1, illustration: '🥚', question: 'Eggs come from a?',                  answers: ['Cow', 'Pig', 'Hen', 'Horse'],               correct: 2 },
    { id: 'f1-3', level: 1, illustration: '🐑', question: 'Wool for jumpers comes from a?',     answers: ['Goat', 'Sheep', 'Rabbit', 'Cow'],           correct: 1 },
    { id: 'f1-4', level: 1, illustration: '🌽', question: 'Corn grows on a?',                   answers: ['Tree', 'Bush', 'Stalk', 'Vine'],            correct: 2 },
    { id: 'f1-5', level: 1, illustration: '🚜', question: 'A farmer drives a big?',              answers: ['Train', 'Tractor', 'Boat', 'Bus'],          correct: 1 },
    { id: 'f2-1', level: 2, illustration: '🐖', question: 'Piglets are baby?',                  answers: ['Cows', 'Sheep', 'Pigs', 'Horses'],          correct: 2 },
    { id: 'f2-2', level: 2, illustration: '🥕', question: 'Carrots grow?',                      answers: ['On trees', 'Underground', 'On vines', 'On bushes'], correct: 1 },
    { id: 'f2-3', level: 2, illustration: '🍎', question: 'Apple trees bloom with which colour flowers?', answers: ['Yellow', 'Red', 'White-pink', 'Blue'], correct: 2 },
    { id: 'f2-4', level: 2, illustration: '🌻', question: '{NAME} — a sunflower tracks the?',   answers: ['Moon', 'Sun', 'Rain', 'Wind'],              correct: 1 },
    { id: 'f2-5', level: 2, illustration: '🐔', question: 'A rooster crows at?',                answers: ['Midnight', 'Dawn', 'Noon', 'Sunset'],       correct: 1 },
    { id: 'f3-1', level: 3, illustration: '🐄', question: 'A cow has how many stomachs?',       answers: ['1', '2', '4', '6'],                         correct: 2 },
    { id: 'f3-2', level: 3, illustration: '🍯', question: 'Beeswax is used to make?',           answers: ['Jam', 'Candles & lip balm', 'Bread', 'Cheese'], correct: 1 },
    { id: 'f3-3', level: 3, illustration: '🌾', question: 'Wheat is ground into?',              answers: ['Sugar', 'Salt', 'Flour', 'Oil'],             correct: 2 },
    { id: 'f3-4', level: 3, illustration: '🐑', question: 'Sheep are sheared (wool cut) in?',   answers: ['Winter', 'Spring/summer', 'Autumn', 'Every day'], correct: 1 },
    { id: 'f3-5', level: 3, illustration: '🥛', question: 'Which process makes milk safe to drink?', answers: ['Boiling only', 'Pasteurisation', 'Freezing', 'Adding salt'], correct: 1 },
    { id: 'f4-1', level: 4, illustration: '🚜', question: 'Crop rotation helps soil by?',       answers: ['Adding water', 'Preventing nutrient depletion', 'Killing pests with fire', 'Keeping it wet'], correct: 1 },
    { id: 'f4-2', level: 4, illustration: '🍎', question: 'The UK\'s most planted apple variety is?', answers: ['Granny Smith', 'Cox\'s Orange Pippin', 'Bramley', 'Gala'], correct: 2 },
    { id: 'f4-3', level: 4, illustration: '🌽', question: 'One corn plant produces roughly how many ears?', answers: ['1', '2-3', '10', '20'],              correct: 0 },
    { id: 'f4-4', level: 4, illustration: '🐝', question: 'A bee colony has one queen and how many workers?', answers: ['100', '1,000', '20,000-80,000', 'Millions'], correct: 2 },
    { id: 'f4-5', level: 4, illustration: '🐄', question: '{NAME} — what does organic farming mean?', answers: ['Growing underground', 'No synthetic chemicals', 'Only at night', 'In water'], correct: 1 },
    { id: 'f5-1', level: 5, illustration: '🌱', question: 'Permaculture is a farming philosophy that mimics?', answers: ['Industrial methods', 'Natural ecosystems', 'City planning', 'Ancient Egypt'], correct: 1 },
    { id: 'f5-2', level: 5, illustration: '🌾', question: 'The Green Revolution of the 1960s increased food production through?', answers: ['Prayer', 'High-yield crop varieties & irrigation', 'Bigger farms only', 'Robots'], correct: 1 },
    { id: 'f5-3', level: 5, illustration: '🐄', question: 'Methane from cattle contributes to?', answers: ['Better soil', 'Climate change', 'Crop growth', 'Water purity'], correct: 1 },
    { id: 'f5-4', level: 5, illustration: '🍯', question: 'Colony Collapse Disorder affects which crucial farm helper?', answers: ['Earthworms', 'Honeybees', 'Ladybirds', 'Butterflies'], correct: 1 },
    { id: 'f5-5', level: 5, illustration: '🌿', question: 'Vertical farming grows crops?',      answers: ['In oceans', 'In stacked indoor layers', 'Underground only', 'On rooftops only'], correct: 1 },
  ],

  food: [
    { id: 'fd1-1', level: 1, illustration: '🍕', question: 'Pizza originally comes from?',      answers: ['USA', 'France', 'Italy', 'Spain'],          correct: 2 },
    { id: 'fd1-2', level: 1, illustration: '🍦', question: 'Ice cream is kept cold in a?',      answers: ['Oven', 'Freezer', 'Fridge door', 'Bag'],    correct: 1 },
    { id: 'fd1-3', level: 1, illustration: '🍓', question: 'Strawberries are which colour when ripe?', answers: ['Green', 'Yellow', 'Red', 'Blue'],      correct: 2 },
    { id: 'fd1-4', level: 1, illustration: '🥞', question: 'Pancakes are cooked in a?',          answers: ['Oven', 'Frying pan', 'Pot', 'Toaster'],     correct: 1 },
    { id: 'fd1-5', level: 1, illustration: '🍭', question: 'Lollipops are a type of?',           answers: ['Cake', 'Sweet', 'Fruit', 'Bread'],          correct: 1 },
    { id: 'fd2-1', level: 2, illustration: '🍫', question: 'Chocolate is made from?',            answers: ['Vanilla beans', 'Cacao beans', 'Coffee beans', 'Sugar cane'], correct: 1 },
    { id: 'fd2-2', level: 2, illustration: '🧁', question: 'The difference between a cupcake and a muffin is?', answers: ['Size', 'Icing/frosting', 'Ingredients', 'Colour'], correct: 1 },
    { id: 'fd2-3', level: 2, illustration: '🌮', question: 'Tacos come from which country?',     answers: ['Spain', 'USA', 'Mexico', 'Brazil'],         correct: 2 },
    { id: 'fd2-4', level: 2, illustration: '🍎', question: '{NAME} — how many apples make one litre of apple juice?', answers: ['1-2', '3-5', '10-14', '20'], correct: 2 },
    { id: 'fd2-5', level: 2, illustration: '🍕', question: 'New York-style pizza has a?',        answers: ['Thick crust', 'Thin, foldable crust', 'Stuffed crust', 'No crust'], correct: 1 },
    { id: 'fd3-1', level: 3, illustration: '🍣', question: 'Sushi originally comes from?',       answers: ['China', 'Korea', 'Japan', 'Thailand'],      correct: 2 },
    { id: 'fd3-2', level: 3, illustration: '🧀', question: 'Cheese is made by fermenting?',      answers: ['Water', 'Milk', 'Cream', 'Butter'],         correct: 1 },
    { id: 'fd3-3', level: 3, illustration: '🍞', question: 'Sourdough bread uses which leavening?', answers: ['Yeast packets', 'Wild yeast & bacteria starter', 'Baking soda', 'Eggs'], correct: 1 },
    { id: 'fd3-4', level: 3, illustration: '🍫', question: 'White chocolate contains no actual?', answers: ['Sugar', 'Milk', 'Cocoa solids', 'Fat'],      correct: 2 },
    { id: 'fd3-5', level: 3, illustration: '🥑', question: 'Avocados are technically a?',        answers: ['Vegetable', 'Nut', 'Berry/fruit', 'Fungus'], correct: 2 },
    { id: 'fd4-1', level: 4, illustration: '🌶️', question: 'Capsaicin is the compound that makes chillies?', answers: ['Sweet', 'Sour', 'Hot', 'Bitter'], correct: 2 },
    { id: 'fd4-2', level: 4, illustration: '🍕', question: 'Mozzarella is traditionally made from which milk?', answers: ['Cow', 'Goat', 'Buffalo', 'Sheep'], correct: 2 },
    { id: 'fd4-3', level: 4, illustration: '🧁', question: 'The Maillard reaction makes baked food?', answers: ['Rise', 'Brown & flavourful', 'Moist', 'Sweet'], correct: 1 },
    { id: 'fd4-4', level: 4, illustration: '🍫', question: 'Tempering chocolate involves controlling?', answers: ['Sugar content', 'Temperature to align crystals', 'Mixing speed', 'Colour'], correct: 1 },
    { id: 'fd4-5', level: 4, illustration: '🥩', question: '{NAME} — umami is the fifth basic taste. The word means?', answers: ['Savoury', 'Delicious taste (Japanese)', 'Spicy', 'Rich'], correct: 1 },
    { id: 'fd5-1', level: 5, illustration: '🍷', question: 'Fermentation converts sugar into alcohol using?', answers: ['Heat only', 'Yeast', 'Salt', 'Pressure'], correct: 1 },
    { id: 'fd5-2', level: 5, illustration: '🌶️', question: 'The Scoville scale measures?',     answers: ['Flavour depth', 'Chilli heat level', 'Food freshness', 'Sugar content'], correct: 1 },
    { id: 'fd5-3', level: 5, illustration: '🧀', question: 'Casu marzu cheese from Sardinia is controversial because it contains live?', answers: ['Mould', 'Maggots', 'Bacteria', 'Algae'], correct: 1 },
    { id: 'fd5-4', level: 5, illustration: '🍣', question: 'Umami-rich glutamate was isolated and named by?', answers: ['A French chef', 'Kikunae Ikeda (Japanese chemist)', 'An Italian scientist', 'Harvard research'], correct: 1 },
    { id: 'fd5-5', level: 5, illustration: '🍕', question: 'The world\'s most expensive pizza uses which ingredient?', answers: ['Gold leaf & lobster', 'Truffle & caviar', 'Diamond dust', 'All of these have existed!'], correct: 3 },
  ],
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getQuestionsForTheme(theme: string): QuizQuestion[] {
  return QUESTIONS[theme] ?? []
}

export function getQuestionsForLevel(theme: string, level: number): QuizQuestion[] {
  return (QUESTIONS[theme] ?? []).filter((q) => q.level === level)
}

export function interpolateQuestion(text: string, name?: string): string {
  const displayName = name?.trim() || 'you'
  return text.replaceAll('{NAME}', displayName)
}

export function pickQuestionsForGame(
  theme: string,
  level: number,
  count = 5,
): QuizQuestion[] {
  const pool = getQuestionsForLevel(theme, level)
  if (pool.length <= count) return [...pool]
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count)
}

// Age → max question level. A 5-year-old should never see level-5 trivia.
const MAX_LEVEL_FOR_AGE: Record<string, number> = {
  '2-4':  1,
  '4-6':  2,
  '6-8':  4,
  '8-12': 5,
}

export function getMaxLevelForAge(ageGroup: string): number {
  return MAX_LEVEL_FOR_AGE[ageGroup] ?? 5
}

// Age-aware question picker — caps difficulty to the age group's ceiling
export function pickQuestionsForAge(
  theme: string,
  ageGroup: string,
  targetLevel: number,
  count = 5,
): QuizQuestion[] {
  const maxLevel = getMaxLevelForAge(ageGroup)
  const level = Math.min(targetLevel, maxLevel)
  return pickQuestionsForGame(theme, level, count)
}
