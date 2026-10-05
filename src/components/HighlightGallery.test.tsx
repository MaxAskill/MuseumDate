import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HighlightGallery } from './HighlightGallery';
import { PhotoSlot } from './PhotoSlot';
import type { Highlight } from '../types/itinerary';

afterEach(cleanup);
const highlights: Highlight[] = [
  { id: 'one', title: 'First exhibit', description: 'First description', category: 'Nature' },
  { id: 'two', title: 'Second exhibit', description: 'Second description', category: 'Art' },
  { id: 'three', title: 'Third exhibit', description: 'Third description', category: 'Culture' },
];

test('arrows, dots, keyboard and swipe position keep the slide indicator in sync', () => {
  Object.defineProperty(window, 'matchMedia', { writable: true, value: () => ({ matches: true }) });
  const toggle = vi.fn();
  render(<HighlightGallery highlights={highlights} label="Museum" favorites={[]} onToggle={toggle} />);
  const track = screen.getByLabelText('Highlight photos. On mobile, swipe or use the arrow buttons.');
  Array.from(track.children).forEach((child, index) => Object.defineProperty(child, 'offsetLeft', { value: 20 + index * 300 }));
  Object.defineProperty(track, 'scrollTo', { value: vi.fn((options: ScrollToOptions) => { track.scrollLeft = options.left ?? 0; fireEvent.scroll(track); }) });
  expect((screen.getByRole('button', { name: 'Previous highlight' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Next highlight' }));
  expect(screen.getByRole('status').textContent).toContain('2 / 3');
  fireEvent.click(screen.getByRole('button', { name: 'Show Third exhibit' }));
  expect(screen.getByRole('status').textContent).toContain('3 / 3');
  expect((screen.getByRole('button', { name: 'Next highlight' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.keyDown(track, { key: 'ArrowLeft' });
  expect(screen.getByRole('status').textContent).toContain('2 / 3');
  track.scrollLeft = 0; fireEvent.scroll(track);
  expect(screen.getByRole('button', { name: 'Show First exhibit' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button', { name: 'Save Second exhibit as favorite' }));
  expect(toggle).toHaveBeenCalledWith('two');
});

test('reference photos are lazy loaded and a failed image has a named fallback', () => {
  render(<PhotoSlot title="Tree of Life" src="/images/museums/floor22.webp" alt="Glass lift" />);
  const image = screen.getByRole('img', { name: 'Glass lift' });
  expect(image.getAttribute('loading')).toBe('lazy');
  fireEvent.error(image);
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('Tree of Life')).toBeTruthy();
});
