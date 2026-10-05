import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
export function PhotoSlot({ title, src, alt }: { title: string; src?: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="photo-slot">{src && !failed ? <img src={src} alt={alt ?? title} loading="lazy" decoding="async" width="900" height="600" onError={() => setFailed(true)} /> : <div className="photo-placeholder"><span className="arch-line"/><ImageIcon size={25} strokeWidth={1}/><span>{title}</span><small>PHOTO TO COME</small></div>}</div>;
}
