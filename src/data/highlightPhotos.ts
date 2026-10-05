import photos from './referencePhotos.json';
import type { Highlight } from '../types/itinerary';

type PhotoKey = keyof typeof photos;
const references: Record<string, { photo: PhotoKey; alt: string; caption: string }> = {
  tree: { photo: 'floor22', alt: 'The glass lift and white branching structure at the base of the Tree of Life', caption: 'Look for the glass lift and white branching structure at the base of the Tree of Life.' },
  biodiversity: { photo: 'tree', alt: 'Preserved Philippine eagle in a natural history display', caption: 'Example to look for: a Philippine eagle specimen in the wildlife displays.' },
  lolong: { photo: 'lolong', alt: 'The preserved crocodile Lolong displayed in the museum', caption: 'Lolong reference photo. Confirm the current display with museum staff.' },
  architecture: { photo: 'atrium', alt: 'The white façade and columns of the National Museum of Natural History', caption: 'Architecture reference: the museum’s historic exterior and columns.' },
  dome: { photo: 'dome', alt: 'Glass dome and sunlit balconies in the Natural History museum atrium', caption: 'Look for the geometric glass dome above the central courtyard.' },
  textiles: { photo: 'textiles', alt: 'Traditional clothing and colorful woven textiles in the Hibla display', caption: 'Hibla gallery reference: look for woven patterns and traditional clothing.' },
  archaeology: { photo: 'jar', alt: 'The Manunggul burial jar with figures on its lid, in a museum case', caption: 'Archaeology example: the Manunggul Jar. Check gallery access on arrival.' },
  communities: { photo: 'textiles', alt: 'Traditional clothing beside striped textiles in a museum display', caption: 'Culture reference: compare clothing and textile traditions, and read the community labels.' },
  objects: { photo: 'cloth', alt: 'Fragments of Banton cloth preserved in a museum case', caption: 'Material culture example: Banton cloth. Objects and displays can change.' },
  maritime: { photo: 'maritime', alt: 'A traditional wooden boat with an outrigger inside the Anthropology museum', caption: 'Seafaring reference: a boat display photographed in the museum. Confirm current access.' },
  spoliarium: { photo: 'spoliarium', alt: 'Juan Luna’s Spoliarium in its ornate frame', caption: 'Spoliarium reference photo: look for the monumental framed painting.' },
  masters: { photo: 'art02', alt: 'A framed painting displayed in the National Museum of Fine Arts', caption: 'Gallery example. Read the artwork label for its artist and title; selections may change.' },
  bustamante: { photo: 'bustamante2', alt: 'Hidalgo’s painting showing the assassination of Governor Bustamante, in its gallery frame', caption: 'Reference photo of Hidalgo’s Governor Bustamante painting.' },
  sculpture: { photo: 'sculpture', alt: 'A sculpted bust of Captain Ricardo Carnicero by José Rizal', caption: 'Sculpture example: a bust by José Rizal. Confirm current display access.' },
  halls: { photo: 'senate', alt: 'The grand former Senate Hall inside the National Museum of Fine Arts', caption: 'Gallery-space reference: the former Senate Hall.' },
  stairs: { photo: 'artsinterior', alt: 'An upper interior hall and balustrade at the National Museum of Fine Arts', caption: 'Architecture reference: an upper hall and balustrade; this photo does not show the staircase.' },
};

export function withReferencePhoto(highlight: Highlight): Highlight {
  const reference = references[highlight.id];
  if (!reference) return highlight;
  const { description: _description, ...photo } = photos[reference.photo];
  return { ...highlight, ...photo, imageAlt: reference.alt, imageCaption: reference.caption };
}
