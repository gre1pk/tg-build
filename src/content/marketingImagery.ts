/**
 * Verified Unsplash assets for demo/marketing until real studio photos replace them.
 * Run URL checks before changing IDs — broken images ship as empty placeholders.
 */
export function unsplashPhoto(photoId: string, width: number): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&q=80`;
}

/** Worn chair — reads clearly as «до». */
export const DEMO_BEFORE_CHAIR = unsplashPhoto('photo-1586023492125-27b2c045efd7', 800);

/** Restored sofa — reads as «после». */
export const DEMO_AFTER_SOFA = unsplashPhoto('photo-1555041469-a586c61ea9bc', 800);

/** Fabric texture close-up for catalog swatches. */
export const DEMO_FABRIC_VELVET = unsplashPhoto('photo-1618220179428-22790b461013', 600);
export const DEMO_FABRIC_WOOL = unsplashPhoto('photo-1558618666-fcd25c85cd64', 600);
export const DEMO_FABRIC_LEATHER = unsplashPhoto('photo-1615529328331-f8917597711f', 600);
export const DEMO_FABRIC_LINEN = unsplashPhoto('photo-1493663284031-b7e3aefcae8e', 600);
export const DEMO_FABRIC_JACQUARD = unsplashPhoto('photo-1598300042247-d088f8ab3a91', 600);
export const DEMO_FABRIC_CHENILLE = unsplashPhoto('photo-1567016432779-094069958ea5', 600);

/** Secondary portfolio pairs. */
export const DEMO_BEFORE_INTERIOR = unsplashPhoto('photo-1493663284031-b7e3aefcae8e', 600);
export const DEMO_AFTER_INTERIOR = unsplashPhoto('photo-1567016432779-094069958ea5', 600);
export const DEMO_BEFORE_CHAIRS = unsplashPhoto('photo-1506439773649-6e0eb8cfb237', 600);
export const DEMO_AFTER_CHAIR = unsplashPhoto('photo-1617806118233-18e1de247200', 600);

/** Hero on home — single showcase sofa (no before/after split). */
export const HERO_IMAGE = DEMO_AFTER_SOFA;
