import { tripDetails } from '../data/tripDetails';
import { Check, Backpack } from 'lucide-react';
export function TripDetails() { return <section className="trip-details"><div><span className="eyebrow">A few little details</span><h3>Come as you are.<br/><em>Wear comfy shoes.</em></h3><p>{tripDetails.note}</p></div><div><Backpack size={25} strokeWidth={1}/><h4>For our day out</h4>{tripDetails.essentials.map(e=><p key={e}><Check size={14}/>{e}</p>)}<small>Meet at {tripDetails.meetTime} · Manila local time</small></div></section>; }
