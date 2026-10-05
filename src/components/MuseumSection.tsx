import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Museum } from '../types/itinerary';
import { MuseumHighlightCard } from './MuseumHighlightCard';
import { MuseumHighlights, type FavoritesProps } from './MuseumHighlights';
export function MuseumSection({museum,favorites,onToggle}:{museum:Museum}&FavoritesProps) { const [open,setOpen]=useState(false); return <div className={`museum-section ${museum.theme}`}><div className="museum-intro"><span className="eyebrow">Museum Highlights</span><span>{museum.subtitle}</span></div><MuseumHighlightCard primary highlight={museum.mainHighlight} favorite={favorites.includes(museum.mainHighlight.id)} onToggle={onToggle}/><button className="expand-button" aria-expanded={open} aria-controls={`highlights-${museum.id}`} onClick={()=>setOpen(!open)}>{open?'Hide Museum Highlights':'See Museum Highlights'}<ChevronDown size={17} className={open?'rotated':''}/></button><div id={`highlights-${museum.id}`} hidden={!open}><MuseumHighlights museum={museum} favorites={favorites} onToggle={onToggle}/></div></div>; }
