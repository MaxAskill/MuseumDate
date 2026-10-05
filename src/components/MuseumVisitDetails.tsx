import { Camera, Clock, Lightbulb } from 'lucide-react';
import type { Museum } from '../types/itinerary';
import { MuseumMission } from './MuseumMission';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function MuseumVisitDetails({ museum }: { museum: Museum }) {
  const [duration, setDuration] = useLocalStorage(`museumdate:duration:${museum.id}`, museum.duration, (v): v is string => typeof v === 'string' && v.length < 120);
  return <div className="visit-details"><div className="museum-notes"><div><Camera size={19}/><span><strong>Best Photo Spot · {museum.photoSpot}</strong><p>{museum.photoSuggestion}</p></span></div><div><Clock size={19}/><label htmlFor={`duration-${museum.id}`}><strong>Estimated Visit · editable</strong><input id={`duration-${museum.id}`} value={duration} maxLength={119} onChange={event => setDuration(event.target.value)}/><small>Planning estimate; itinerary times stay as suggested.</small></label></div><div><Lightbulb size={19}/><span><strong>A little thing to know</strong><p>{museum.fact}</p></span></div></div><MuseumMission id={museum.id} text={museum.mission}/><a className="source-link" href={museum.source} target="_blank" rel="noreferrer">Museum information ↗</a><p className="tiny">Gallery access may change. Check with staff on arrival.</p></div>;
}
