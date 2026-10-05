import { Check, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
export function MuseumMission({id,text}:{id:string;text:string}) { const [done,setDone] = useLocalStorage(`museumdate:mission:${id}`,false,(v):v is boolean=>typeof v==='boolean'); return <label className={`mission ${done?'done':''}`}><input type="checkbox" checked={done} onChange={e=>setDone(e.target.checked)}/><span className="mission-check">{done?<Check size={17}/>:<Sparkles size={17}/>}</span><span><strong>Museum Mission</strong><span>{text}</span></span></label>; }
