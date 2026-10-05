import { Clock, MapPin, Camera, Heart, Footprints, Landmark, Utensils } from 'lucide-react';
import type { Stop } from '../types/itinerary';
const experiences: Record<string, { caption: string; prompts: string[] }> = {
  church: { caption: 'A quiet moment in old Manila.', prompts: ['Notice the façade and architectural details.', 'Visit respectfully around church services.', 'Explore the museum if time and admission allow.'] },
  casa: { caption: 'Courtyards, textures, and little details.', prompts: ['Wander around Plaza San Luis.', 'Look for carved wood, stone, and courtyard details.', 'Take a photo together where photography is allowed.'] },
  fort: { caption: 'History, open air, and a little wandering.', prompts: ['Explore the historic fort grounds.', 'Pause at the riverside views.', 'Leave time for a photo and a water break.'] },
  golden: { caption: 'No rush. Just us and the evening light.', prompts: ['Find a comfortable route through Intramuros.', 'Take a few photos if the light is lovely.', 'The walk time is flexible; weather and sunset light may vary.'] },
  dinner: { caption: 'A sweet ending to our day.', prompts: ['Choose a nearby spot that feels right.', 'Save room for dessert.', 'Tell each other our favorite moment of the day.'] },
};
export function StopPage({ stop }: { stop: Stop }) {
  const experience = experiences[stop.id];
  const Icon = stop.id === 'dinner' ? Utensils : stop.id === 'golden' ? Footprints : Landmark;
  return <section className="destination-page"><div className="destination-illustration"><Icon size={60} strokeWidth={.9}/><span className="eyebrow">{stop.time} · Intramuros</span><h2>{stop.title}</h2><p>{experience?.caption}</p></div><div className="destination-details"><p>{stop.description}</p><span className="destination-duration"><Clock size={15}/>{stop.duration}</span><h3>Our little plan</h3><ul>{experience?.prompts.map((prompt, index) => <li key={prompt}>{index === 2 ? <Heart size={16}/> : <Camera size={16}/>}<span>{prompt}</span></li>)}</ul><a className="button secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.location)}`} target="_blank" rel="noreferrer"><MapPin size={16}/>Open this stop’s location ↗</a><small>Confirm access and any admission on arrival.</small></div></section>;
}
