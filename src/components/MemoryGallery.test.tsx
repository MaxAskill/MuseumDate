import 'fake-indexeddb/auto';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryGallery } from './MemoryGallery';
import { museums } from '../data/museums';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

test('add a personal photo, edit its caption, export a Polaroid, and undo removal', async () => {
  const user = userEvent.setup();
  vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 600, height: 400, close: vi.fn() })));
  const drawImage = vi.fn();
  const context = { fillStyle: '', textAlign: '', font: '', fillRect: vi.fn(), drawImage, fillText: vi.fn(), measureText: () => ({ width: 200 }) };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => context as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(callback => callback(new Blob(['image'], { type: 'image/png' })));
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:memory-photo') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
  const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<MemoryGallery museum={museums[0]}/>);
  const input = screen.getByLabelText(/Add our photos at/);
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  await user.upload(input, new File(['photo'], 'our-day.jpg', { type: 'image/jpeg' }));
  await screen.findByLabelText('Caption');
  const caption = screen.getByLabelText('Caption');
  await user.clear(caption); await user.type(caption, 'Our first photo together');
  await user.click(screen.getByRole('button', { name: 'Save Polaroid' }));
  await waitFor(() => expect(download).toHaveBeenCalled());
  expect(drawImage).toHaveBeenCalled();
  await screen.findByText('Caption saved.');
  await user.click(screen.getByRole('button', { name: 'Remove photo: Our first photo together' }));
  await screen.findByText('This museum’s first Polaroid is waiting for us.');
  await user.click(screen.getByRole('button', { name: 'Undo remove' }));
  await waitFor(() => expect((screen.getByLabelText('Caption') as HTMLInputElement).value).toBe('Our first photo together'));
});
