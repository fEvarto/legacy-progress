/**
 * Hero names are rolled once per generation so every life feels like a new
 * character. Names stay short enough to fit the sidebar header comfortably.
 */
const heroNames = [
  'Ada', 'Alaric', 'Ansel', 'Arden', 'Astrid', 'Bastian', 'Brenna', 'Cael',
  'Cassia', 'Cedric', 'Cora', 'Dahlia', 'Darian', 'Delia', 'Edmund', 'Elara',
  'Elias', 'Ember', 'Evren', 'Fenris', 'Fiona', 'Galen', 'Greta', 'Harlow',
  'Ilyra', 'Isolde', 'Jorah', 'Kael', 'Kira', 'Lennox', 'Leona', 'Lucian',
  'Maeve', 'Mira', 'Nadia', 'Nolan', 'Oberon', 'Odessa', 'Orin', 'Piper',
  'Quinn', 'Rhea', 'Ronan', 'Rowan', 'Sabine', 'Selene', 'Soren', 'Sylvia',
  'Talon', 'Tamsin', 'Thalia', 'Theo', 'Una', 'Vale', 'Vera', 'Wren',
  'Yara', 'Yorick', 'Zara', 'Zephyr',
]

/** Pick a random name for a new hero. */
export const generateHeroName = (): string =>
  heroNames[Math.floor(Math.random() * heroNames.length)]
