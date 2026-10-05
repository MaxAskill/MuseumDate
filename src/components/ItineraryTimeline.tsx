import { itinerary } from '../data/itinerary';
import { TimelineItem } from './TimelineItem';
import type { FavoritesProps } from './MuseumHighlights';
export function ItineraryTimeline(props:FavoritesProps) { return <section id="itinerary" className="section"><div className="section-title"><span className="eyebrow">The plan, with room for little detours</span><h2>Our day, <em>together.</em></h2><p>From museum halls to the streets of old Manila.</p></div><div className="timeline">{itinerary.map((stop,index)=><TimelineItem key={stop.id} stop={stop} index={index} {...props}/>)}</div></section>; }
