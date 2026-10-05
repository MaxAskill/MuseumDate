import { itinerary } from './itinerary';
export const chapters = [
  { id: 'plan', title: 'Our itinerary', shortTitle: 'The plan', kicker: 'You’re Invited' },
  { id: 'journey', title: 'From Ortigas, together', shortTitle: 'Getting there', kicker: 'Our starting point' },
  ...itinerary.filter(stop => !['meet', 'transit'].includes(stop.id)).map(stop => ({ id: stop.id, title: stop.title, shortTitle: ({ natural: 'Natural History', anthropology: 'Anthropology', arts: 'Fine Arts', lunch: 'Lunch', church: 'San Agustin', casa: 'Casa Manila', fort: 'Fort Santiago', golden: 'Golden hour', dinner: 'Dinner & dessert' } as Record<string, string>)[stop.id], kicker: `${stop.time} · ${stop.museumId ? 'Museum stop' : 'Intramuros'}` })),
  { id: 'favorites', title: 'Our Favorites', shortTitle: 'Favorites', kicker: 'Little moments worth keeping' },
  { id: 'pass', title: 'Our Manila Day Pass', shortTitle: 'Day pass', kicker: 'A keepsake for two' },
  { id: 'rsvp', title: 'So… are you coming?', shortTitle: 'RSVP', kicker: 'One last little question' },
];
export type ChapterId = string;
export function chapterFromHash() {
  const id = window.location.hash.slice(1);
  const aliases: Record<string, string> = { itinerary: 'plan', top: 'plan', food: 'lunch' };
  const resolved = aliases[id] ?? id;
  return chapters.some(chapter => chapter.id === resolved) ? resolved : 'plan';
}
