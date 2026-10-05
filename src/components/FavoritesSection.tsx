import { Heart } from 'lucide-react';
import { allHighlights } from '../data/museums';
import { MuseumHighlightCard } from './MuseumHighlightCard';
import type { FavoritesProps } from './MuseumHighlights';
export function FavoritesSection({favorites,onToggle}:FavoritesProps) { const selected=allHighlights.filter(h=>favorites.includes(h.id)); return <section className="section favorites-section" id="favorites"><div className="section-title"><h2>Our <em>Favorites</em></h2><p>Little moments worth keeping.</p></div>{selected.length?<div className="highlight-grid">{selected.map(h=><MuseumHighlightCard key={h.id} highlight={h} favorite onToggle={onToggle}/>)}</div>:<div className="empty-favorites"><Heart size={30} strokeWidth={1}/><p>Our collection starts with a little heart.</p><small>Tap the heart on any museum highlight to keep it here.</small></div>}</section>; }
