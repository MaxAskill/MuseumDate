import { useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MuseumHighlightCard } from './MuseumHighlightCard';
import type { Highlight } from '../types/itinerary';
import type { FavoritesProps } from './MuseumHighlights';

export function HighlightGallery({ highlights, label, favorites, onToggle }: { highlights: Highlight[]; label: string } & FavoritesProps) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const goTo = (index: number) => {
    const container = track.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollTo({ left: slide.offsetLeft - (container.children[0] as HTMLElement).offsetLeft, behavior: reduced ? 'instant' : 'smooth' });
  };
  const onScroll = () => {
    const container = track.current;
    if (!container) return;
    const first = (container.children[0] as HTMLElement).offsetLeft;
    let nearest = 0;
    let distance = Infinity;
    Array.from(container.children).forEach((child, index) => {
      const delta = Math.abs((child as HTMLElement).offsetLeft - first - container.scrollLeft);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    setActive(nearest);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(Math.max(0, Math.min(highlights.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1))));
    }
  };
  return <div className="highlight-gallery" role="region" aria-label={`${label} photo highlights`}>
    <div className="slide-hint"><span>Swipe or use the arrows</span><span>{highlights.length} things to look for</span></div>
    <div ref={track} className="highlight-grid slide-track" tabIndex={0} aria-label="Highlight photos. On mobile, swipe or use the arrow buttons." onScroll={onScroll} onKeyDown={onKeyDown}>
      {highlights.map((highlight, index) => <div className="highlight-slide" key={highlight.id} role="group" aria-label={`${index + 1} of ${highlights.length}: ${highlight.title}`}>
        <MuseumHighlightCard highlight={highlight} favorite={favorites.includes(highlight.id)} onToggle={onToggle} />
      </div>)}
    </div>
    <div className="slide-controls">
      <button type="button" className="slide-arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous highlight"><ChevronLeft size={20} /></button>
      <div className="slide-dots" role="group" aria-label="Choose a highlight">{highlights.map((h, i) => <button type="button" key={h.id} className={active === i ? 'active' : ''} aria-label={`Show ${h.title}`} aria-pressed={active === i} onClick={() => goTo(i)}><span /></button>)}</div>
      <button type="button" className="slide-arrow" onClick={() => goTo(active + 1)} disabled={active === highlights.length - 1} aria-label="Next highlight"><ChevronRight size={20} /></button>
    </div>
    <p className="slide-count" role="status" aria-live="polite">{active + 1} / {highlights.length} · {highlights[active]?.title}</p>
  </div>;
}
