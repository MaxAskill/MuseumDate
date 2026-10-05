import { useEffect, useState, type ChangeEvent } from 'react';
import { Camera, Download, ImagePlus, Trash2, Undo2 } from 'lucide-react';
import type { Museum } from '../types/itinerary';
import { PolaroidPhoto } from './PolaroidPhoto';
import { compressMemoryPhoto, deleteMemoryPhoto, downloadPolaroid, listMemoryPhotos, saveMemoryPhoto, type MemoryPhoto } from '../lib/memoryPhotos';

function MemoryPhotoCard({ photo, museum, busy, onSaveCaption, onRemove, onError }: { photo: MemoryPhoto; museum: Museum; busy: boolean; onSaveCaption: (photo: MemoryPhoto) => Promise<void>; onRemove: (photo: MemoryPhoto) => Promise<void>; onError: (message: string) => void }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState(photo.caption);
  useEffect(() => { const value = URL.createObjectURL(photo.image); setUrl(value); return () => URL.revokeObjectURL(value); }, [photo.image]);
  const exportPhoto = async () => { try { await downloadPolaroid({ ...photo, caption }, museum.name); } catch { onError('Could not download this Polaroid. Try another browser.'); } };
  return <article className="memory-card"><PolaroidPhoto title={caption.trim() || 'Our museum memory'} src={url || undefined} alt={caption.trim() || `Our photo at ${museum.name}`} subtitle={`${museum.name} · October 17, 2026`}/><label className="memory-caption-label">Caption<input value={caption} maxLength={70} placeholder="A little moment to remember…" onChange={event => setCaption(event.target.value)} onBlur={() => { if (caption !== photo.caption) void onSaveCaption({ ...photo, caption }); }} disabled={busy}/></label><div className="memory-actions"><button onClick={() => void exportPhoto()} disabled={busy}><Download size={16}/>Save Polaroid</button><button onClick={() => void onRemove(photo)} disabled={busy} aria-label={`Remove photo: ${photo.caption || 'Our museum memory'}`}><Trash2 size={16}/>Remove</button></div></article>;
}

export function MemoryGallery({ museum }: { museum: Museum }) {
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [removed, setRemoved] = useState<MemoryPhoto | null>(null);
  useEffect(() => { let active = true; listMemoryPhotos(museum.id).then(items => { if (active) setPhotos(items); }).catch(() => { if (active) setError('Photo storage is unavailable in this browser. Try a regular browser window.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [museum.id]);
  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []); event.target.value = '';
    if (!files.length) return;
    setBusy(true); setError(''); setNotice('');
    let count = 0;
    const failures: string[] = [];
    const available = Math.max(0, 12 - photos.length);
    if (files.length > available) failures.push('Up to 12 photos can be saved per museum.');
    for (const file of files.slice(0, available)) {
      try {
        const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join('');
        const photo: MemoryPhoto = { id, museumId: museum.id, image: await compressMemoryPhoto(file), caption: 'Our museum memory', createdAt: Date.now() };
        await saveMemoryPhoto(photo); setPhotos(previous => [...previous, photo]); count++;
      } catch (reason) { failures.push(`${file.name}: ${reason instanceof Error ? reason.message : 'Could not add this photo.'}`); }
    }
    setBusy(false); setNotice(count ? `${count} ${count === 1 ? 'photo' : 'photos'} added to our ${museum.name} album.` : ''); setError(failures.join(' '));
  };
  const saveCaption = async (photo: MemoryPhoto) => { try { await saveMemoryPhoto(photo); setPhotos(previous => previous.map(item => item.id === photo.id ? photo : item)); setNotice('Caption saved.'); } catch { setError('Could not save the caption. Browser photo storage may be full.'); } };
  const remove = async (photo: MemoryPhoto) => { setBusy(true); try { await deleteMemoryPhoto(photo.id); setPhotos(previous => previous.filter(item => item.id !== photo.id)); setRemoved(photo); setNotice('Photo removed. You can undo until you leave this view.'); } catch { setError('Could not remove this photo.'); } finally { setBusy(false); } };
  const undo = async () => { if (!removed) return; setBusy(true); try { await saveMemoryPhoto(removed); setPhotos(previous => [...previous, removed].sort((a, b) => a.createdAt - b.createdAt)); setRemoved(null); setNotice('Photo restored.'); } catch { setError('Could not restore this photo.'); } finally { setBusy(false); } };
  return <section className="memory-gallery"><div className="memory-intro"><Camera size={25} strokeWidth={1.2}/><h3>Our little museum memories</h3><p>Add the pictures we take here, then turn them into keepsakes.</p><label className={`memory-add ${busy || loading || photos.length >= 12 ? 'disabled' : ''}`}><ImagePlus size={18}/>{busy ? 'Preparing photos…' : 'Add Our Photos'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => void addPhotos(event)} disabled={busy || loading || photos.length >= 12} aria-label={`Add our photos at ${museum.name}`}/></label><small>JPG, PNG or WebP · up to 12 photos per museum · 15 MB each</small><p className="memory-local-note">Saved only in this browser on this device. Download your Polaroids to keep a copy; photos won’t sync to another phone.</p></div>{loading && <p role="status">Opening our album…</p>}{error && <p className="memory-error" role="alert">{error}</p>}<div className="memory-notice" role="status">{notice}{removed && <button onClick={() => void undo()} disabled={busy || photos.length >= 12}><Undo2 size={15}/>Undo remove</button>}</div>{!loading && !photos.length && <div className="memory-empty"><span>♡</span><p>This museum’s first Polaroid is waiting for us.</p><small>Add a photo from your camera roll to start the album.</small></div>}<div className="memory-photo-grid">{photos.map(photo => <MemoryPhotoCard key={photo.id} photo={photo} museum={museum} busy={busy} onSaveCaption={saveCaption} onRemove={remove} onError={setError}/>)}</div></section>;
}
