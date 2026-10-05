import { ArrowRight, Clock, Heart, MapPin } from 'lucide-react';
import { itinerary } from '../data/itinerary';
import { tripDetails } from '../data/tripDetails';

export function ItineraryOverview({ onNavigate }: { onNavigate: (id: string) => void }) {
  return <section className="itinerary-overview">
    <div className="plan-invitation"><span className="eyebrow">You’re Invited · {tripDetails.date}</span><h2>A Day Around <em>Manila</em><Heart size={25} strokeWidth={1}/></h2><p>National Museum + Intramuros. A little culture, a little walking, and a lot of memories.</p></div>
    <div className="plan-meetup"><MapPin size={20}/><div><strong>We start at your condo.</strong><p>{tripDetails.start} · Suggested meetup {tripDetails.meetTime}</p></div></div>
    <div className="plan-list-title"><h2>Our day, together.</h2><span>Tap a stop to open its page</span></div>
    <ol className="plan-stop-list">{itinerary.map((stop, index) => <li key={stop.id}><button onClick={() => onNavigate(['meet', 'transit'].includes(stop.id) ? 'journey' : stop.id)}><span className="plan-stop-number">{String(index + 1).padStart(2, '0')}</span><time>{stop.time}</time><span className="plan-stop-copy"><strong>{stop.title}</strong><small><Clock size={11}/>{stop.duration}</small></span><ArrowRight size={17}/></button></li>)}</ol>
    <p className="plan-note">Suggested times in Manila. We can adjust for traffic, train queues, and a little extra wandering.</p>
    <button className="button" onClick={() => onNavigate('journey')}>Let’s start our day <ArrowRight size={16}/></button>
  </section>;
}
