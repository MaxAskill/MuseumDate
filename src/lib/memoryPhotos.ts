export type MemoryPhoto = { id: string; museumId: string; image: Blob; caption: string; createdAt: number };
const databaseName = 'museumdate-memories';
const storeName = 'photos';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(storeName, { keyPath: 'id' });
      store.createIndex('museumId', 'museumId');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Photo storage unavailable.'));
    request.onblocked = () => reject(new Error('Close another tab using the photo album, then try again.'));
  });
}

export async function listMemoryPhotos(museumId: string): Promise<MemoryPhoto[]> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction(storeName, 'readonly').objectStore(storeName).index('museumId').getAll(museumId);
      request.onsuccess = () => resolve((request.result as MemoryPhoto[]).sort((a, b) => a.createdAt - b.createdAt));
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}

export async function saveMemoryPhoto(photo: MemoryPhoto): Promise<void> {
  await mutateMemoryPhoto(store => store.put(photo));
}
export async function deleteMemoryPhoto(id: string): Promise<void> {
  await mutateMemoryPhoto(store => store.delete(id));
}
async function mutateMemoryPhoto(action: (store: IDBObjectStore) => void) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      action(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the photo.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Photo storage is full or unavailable.'));
    });
  } finally { database.close(); }
}

export async function compressMemoryPhoto(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG, or WebP image. Convert HEIC photos to JPG first.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Choose a photo smaller than 15 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare this photo.');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare this photo.')), 'image/webp', .85));
  } finally { bitmap.close(); }
}

export async function downloadPolaroid(photo: MemoryPhoto, museumName: string) {
  const bitmap = await createImageBitmap(photo.image);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 1450;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not export this photo.');
    context.fillStyle = '#fffdfa'; context.fillRect(0, 0, 1200, 1450);
    context.fillStyle = '#eee7e1'; context.fillRect(70, 70, 1060, 1060);
    const scale = Math.min(1060 / bitmap.width, 1060 / bitmap.height);
    const width = bitmap.width * scale, height = bitmap.height * scale;
    context.drawImage(bitmap, 70 + (1060 - width) / 2, 70 + (1060 - height) / 2, width, height);
    context.textAlign = 'center'; context.fillStyle = '#765061'; context.font = '48px "Segoe Print", cursive';
    const caption = photo.caption.trim() || 'Our museum memory';
    const words = caption.split(/\s+/); const lines: string[] = []; let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (context.measureText(next).width > 1000 && line) { lines.push(line); line = word; } else { line = next; }
    }
    if (line) lines.push(line);
    lines.slice(0, 2).forEach((text, index) => context.fillText(text, 600, 1210 + index * 60, 1000));
    context.fillStyle = '#9a7784'; context.font = '24px Arial';
    context.fillText(museumName, 600, 1350, 1040);
    context.fillText('October 17, 2026 · A Day Around Manila', 600, 1395, 1040);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not export the Polaroid.')), 'image/png'));
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `manila-polaroid-${photo.museumId}-${photo.id}.png`;
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  } finally { bitmap.close(); }
}
