import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, List, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FoodVoting } from './components/FoodVoting';
import { ManilaDayPass } from './components/ManilaDayPass';
import { TripDetails } from './components/TripDetails';
import { FavoritesSection } from './components/FavoritesSection';
import { RSVPSection } from './components/RSVPSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ItineraryOverview } from './components/ItineraryOverview';
import { JourneyPage } from './components/JourneyPage';
import { MuseumPage } from './components/MuseumPage';
import { StopPage } from './components/StopPage';
import { chapters, chapterFromHash } from './data/chapters';
import { itinerary } from './data/itinerary';
import { museums } from './data/museums';
import { tripDetails } from './data/tripDetails';

export default function App() {
  const [page, setPage] = useState(chapterFromHash);
  const [favorites, setFavorites, error] = useLocalStorage<string[]>('museumdate:favorites', [], (v): v is string[] => Array.isArray(v) && v.every(i => typeof i === 'string'));
  const viewport = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const index = chapters.findIndex(chapter => chapter.id === page);
  const chapter = chapters[index];
  const stop = itinerary.find(item => item.id === page);
  const museum = museums.find(item => item.id === stop?.museumId);
  const navigate = (id: string) => {
    if (!chapters.some(item => item.id === id) || id === page) return;
    window.history.pushState(null, '', `#${id}`);
    setPage(id);
  };
  useEffect(() => {
    const sync = () => setPage(chapterFromHash());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  useEffect(() => {
    if (viewport.current) viewport.current.scrollTop = 0;
    title.current?.focus({ preventScroll: true });
    document.title = `${chapter.shortTitle} · A Day Around Manila`;
  }, [page, chapter.shortTitle]);
  const onToggle = (id: string) => setFavorites(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]);
  const next = chapters[index + 1];
  return <div className="chapter-app">
    <nav className="chapter-nav" aria-label="Trip pages"><button className="brand" onClick={() => navigate('plan')} aria-label="Open itinerary">M / D <Heart size={13}/></button><div className="chapter-shortcuts"><button aria-current={page === 'plan' ? 'page' : undefined} onClick={() => navigate('plan')}><List size={15}/>Itinerary</button><button aria-current={page === 'favorites' ? 'page' : undefined} onClick={() => navigate('favorites')}><Heart size={15}/>Favorites{favorites.length > 0 && ` (${favorites.length})`}</button><button className="nav-rsvp" aria-current={page === 'rsvp' ? 'page' : undefined} onClick={() => navigate('rsvp')}>RSVP ↗</button></div></nav>
    <div className="chapter-heading"><div><span className="eyebrow">{chapter.kicker}</span><h1 ref={title} tabIndex={-1}>{chapter.shortTitle}</h1></div><label className="chapter-jump"><span>Go to page</span><select aria-label="Go to trip page" value={page} onChange={event => navigate(event.target.value)}>{chapters.map((item, i) => <option key={item.id} value={item.id}>{String(i + 1).padStart(2, '0')} · {item.shortTitle}</option>)}</select></label></div>
    <main ref={viewport} className="chapter-viewport" id="trip-page" aria-label={chapter.title}>
      <motion.div key={page} className="chapter-content" initial={reduced ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .22 }}>
        {page === 'plan' && <ItineraryOverview onNavigate={navigate}/>}
        {page === 'journey' && <JourneyPage/>}
        {museum && stop && <MuseumPage museum={museum} stop={stop} favorites={favorites} onToggle={onToggle}/>}
        {page === 'lunch' && <><div className="lunch-transition"><MapPin size={18}/><p>{stop?.description}</p><small>{stop?.time} · Allow travel time from Fine Arts to Intramuros.</small></div><FoodVoting/></>}
        {stop && !museum && !['lunch', 'meet', 'transit'].includes(page) && <StopPage stop={stop}/>}
        {page === 'favorites' && <FavoritesSection favorites={favorites} onToggle={onToggle}/>}
        {page === 'pass' && <><ManilaDayPass/><TripDetails/></>}
        {page === 'rsvp' && <RSVPSection/>}
        {error && <p role="status">Favorites are selected for this session. Browser storage is unavailable.</p>}
      </motion.div>
    </main>
    <div className="chapter-progress" role="progressbar" aria-label="Trip page progress" aria-valuemin={1} aria-valuemax={chapters.length} aria-valuenow={index + 1}><span style={{ width: `${(index + 1) / chapters.length * 100}%` }}/></div>
    <footer className="chapter-pagination"><button className="chapter-back" disabled={index === 0} onClick={() => navigate(chapters[index - 1].id)}><ArrowLeft size={18}/><span>Back</span></button><div className="chapter-page-count"><span>PAGE {String(index + 1).padStart(2, '0')} / {chapters.length}</span><small>{tripDetails.date}</small></div><button className="chapter-next" onClick={() => navigate(next?.id ?? 'plan')} aria-label={next ? `Next: ${next.shortTitle}` : 'Back to itinerary'}><span><small>{next ? 'NEXT' : 'BACK TO'}</small><span className="chapter-next-title">{next?.shortTitle ?? 'Itinerary'}</span></span><ArrowRight size={18}/></button></footer>
  </div>;
}
