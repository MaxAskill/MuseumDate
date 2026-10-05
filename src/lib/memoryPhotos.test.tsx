import 'fake-indexeddb/auto';
import { expect, test, beforeEach } from 'vitest';
import { deleteMemoryPhoto, listMemoryPhotos, saveMemoryPhoto, compressMemoryPhoto, type MemoryPhoto } from './memoryPhotos';

beforeEach(async () => {
  for (const museum of ['natural', 'arts']) for (const photo of await listMemoryPhotos(museum)) await deleteMemoryPhoto(photo.id);
});

test('photo captions persist and albums remain separate', async () => {
  const photo: MemoryPhoto = { id: 'photo1', museumId: 'natural', image: new Blob(['photo']), caption: 'Our first picture', createdAt: 1 };
  await saveMemoryPhoto(photo);
  await saveMemoryPhoto({ ...photo, id: 'photo2', museumId: 'arts', caption: 'Our art stop' });
  expect((await listMemoryPhotos('natural')).map(item => item.caption)).toEqual(['Our first picture']);
  expect((await listMemoryPhotos('arts')).map(item => item.caption)).toEqual(['Our art stop']);
  await saveMemoryPhoto({ ...photo, caption: 'A little memory' });
  expect((await listMemoryPhotos('natural'))[0].caption).toBe('A little memory');
});

test('removal can be restored to the same album', async () => {
  const photo: MemoryPhoto = { id: 'undo1', museumId: 'natural', image: new Blob(['photo']), caption: 'A keeper', createdAt: 1 };
  await saveMemoryPhoto(photo);
  await deleteMemoryPhoto(photo.id);
  expect(await listMemoryPhotos('natural')).toHaveLength(0);
  await saveMemoryPhoto(photo);
  expect((await listMemoryPhotos('natural'))[0].caption).toBe('A keeper');
});

test('unsupported and oversized files are rejected before decoding', async () => {
  await expect(compressMemoryPhoto(new File(['photo'], 'picture.heic', { type: 'image/heic' }))).rejects.toThrow('Choose a JPG');
  const bigFile = new File(['photo'], 'big.jpg', { type: 'image/jpeg' });
  Object.defineProperty(bigFile, 'size', { value: 16 * 1024 * 1024 });
  await expect(compressMemoryPhoto(bigFile)).rejects.toThrow('15 MB');
});
