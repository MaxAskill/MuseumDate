import { HighlightGallery } from './HighlightGallery';
import { MuseumVisitDetails } from './MuseumVisitDetails';
import type { Museum } from '../types/itinerary';
export type FavoritesProps = { favorites: string[]; onToggle: (id: string) => void };
export function MuseumHighlights({ museum, favorites, onToggle }: { museum: Museum } & FavoritesProps) {
  return <div className="museum-expanded"><h4 className="section-label">What We Should See</h4><HighlightGallery highlights={museum.highlights} label={museum.name} favorites={favorites} onToggle={onToggle}/><MuseumVisitDetails museum={museum}/></div>;
}
