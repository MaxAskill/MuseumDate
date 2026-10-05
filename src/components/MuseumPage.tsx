import { Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { Museum, Stop } from '../types/itinerary';
import { MuseumHighlightCard } from './MuseumHighlightCard';
import { HighlightGallery } from './HighlightGallery';
import { MuseumVisitDetails } from './MuseumVisitDetails';
import { MemoryGallery } from './MemoryGallery';
import type { FavoritesProps } from './MuseumHighlights';
export function MuseumPage({ museum, stop, favorites, onToggle }: { museum: Museum; stop: Stop } & FavoritesProps) {
  const [tab, setTab] = useState('top');
  const tabs = [{ id: 'top', label: 'Top Highlight' }, { id: 'highlights', label: 'Highlights' }, { id: 'details', label: 'Photo & Mission' }, { id: 'memories', label: 'Our Photos' }];
  return <section className={`museum-chapter ${museum.theme}`}><div className="museum-page-intro"><span className="eyebrow">{museum.subtitle}</span><h2>{museum.name}</h2><p>{stop.description}</p><div className="museum-page-meta"><span><Clock size={14}/>{stop.time} · {museum.duration}</span><a className="map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.location)}`} target="_blank" rel="noreferrer"><MapPin size={14}/>Open location ↗</a></div></div><div className="museum-view-tabs" role="group" aria-label="Museum views">{tabs.map(item => <button key={item.id} onClick={() => setTab(item.id)} aria-pressed={tab === item.id} aria-controls={`museum-view-${museum.id}`} className={tab === item.id ? 'active' : ''}>{item.label}</button>)}</div><div id={`museum-view-${museum.id}`} className="museum-view-panel">
    {tab === 'top' && <><MuseumHighlightCard primary highlight={museum.mainHighlight} favorite={favorites.includes(museum.mainHighlight.id)} onToggle={onToggle}/><button className="expand-button" onClick={() => setTab('highlights')}>See Museum Highlights →</button></>}
    {tab === 'highlights' && <HighlightGallery highlights={museum.highlights} label={museum.name} favorites={favorites} onToggle={onToggle}/>}
    {tab === 'details' && <MuseumVisitDetails museum={museum}/>}
    {tab === 'memories' && <MemoryGallery key={museum.id} museum={museum}/>}
  </div></section>;
}
