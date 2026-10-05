import { PhotoSlot } from './PhotoSlot';

export function PolaroidPhoto({ title, src, alt, subtitle = 'Our day in Manila' }: { title: string; src?: string; alt?: string; subtitle?: string }) {
  return <figure className="polaroid-photo"><PhotoSlot title={title} src={src} alt={alt}/><figcaption><span>{title}</span><small>{subtitle}</small></figcaption></figure>;
}
