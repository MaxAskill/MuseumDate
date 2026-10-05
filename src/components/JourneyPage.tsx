import { Car, Footprints, Heart, MapPin, TrainFront } from 'lucide-react';
import { tripDetails } from '../data/tripDetails';
import { useLocalStorage } from '../hooks/useLocalStorage';
const mapLink = (place: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export function JourneyPage() {
  const [station, setStation] = useLocalStorage('museumdate:station', 'Ortigas', (v): v is string => v === 'Ortigas' || v === 'Shaw Boulevard');
  const steps = [
    { Icon: Heart, title: 'I’ll meet you at your condo', text: `${tripDetails.start}. Suggested meetup: ${tripDetails.meetTime}.`, location: tripDetails.startLocation },
    { Icon: Car, title: `Ride to MRT ${station}`, text: `Leave around ${tripDetails.departureTime}. Choose the station that works best for our ride on the day.`, location: `${station} MRT Station, Metro Manila` },
    { Icon: TrainFront, title: 'MRT-3 southbound → Taft Avenue', text: `Board at ${station} and stay on the train until Taft Avenue, the southern end of MRT-3.`, location: 'Taft Avenue MRT Station, Pasay' },
    { Icon: Footprints, title: 'Transfer to LRT-1 EDSA', text: 'Walk to the connecting LRT-1 EDSA station. Follow the signs for the northbound platform.', location: 'EDSA LRT Station, Pasay' },
    { Icon: TrainFront, title: 'LRT-1 northbound → United Nations', text: 'Get off at United Nations. This is our arrival station in Manila, after the meetup in Ortigas.', location: 'United Nations LRT Station, Manila' },
    { Icon: Footprints, title: 'Walk to Natural History', text: `Aim to arrive around ${tripDetails.arrivalTime}. Allow extra time for traffic, tickets, transfers, and the walk.`, location: 'National Museum of Natural History, Manila' },
  ];
  return <section className="journey-page"><div className="journey-heading"><span className="eyebrow">Two people. One little adventure.</span><h2>From your doorstep<br/><em>to the museum doors.</em></h2><p>Exchange Regency → MRT → LRT-1 → our first museum.</p></div><div className="station-picker"><strong>Where should we board?</strong><div role="group" aria-label="MRT boarding station">{['Ortigas', 'Shaw Boulevard'].map(name => <button key={name} aria-pressed={station === name} className={station === name ? 'selected' : ''} onClick={() => setStation(name)}>MRT {name}</button>)}</div><small>Choice saved on this device. Travel times are planning estimates.</small></div><ol className="journey-steps">{steps.map(({ Icon, title, text, location }, index) => <li key={title}><span className="journey-icon"><Icon size={20} strokeWidth={1.4}/></span><div><span className="eyebrow">Step {index + 1}</span><h3>{title}</h3><p>{text}</p><a className="map-link" href={mapLink(location)} target="_blank" rel="noreferrer"><MapPin size={14}/>Open location ↗</a></div></li>)}</ol><div className="journey-sources"><p>Check train service announcements before our Saturday trip.</p><a href="https://www.dotrmrt3.gov.ph/station-map.pdf" target="_blank" rel="noreferrer">MRT-3 route map ↗</a><a href="https://lrmc.ph/our-business/train-route/" target="_blank" rel="noreferrer">LRT-1 route information ↗</a></div></section>;
}
