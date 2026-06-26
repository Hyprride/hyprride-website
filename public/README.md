# Public assets

Static files served from the site root (`/`).

## `hero-bike.jpg`
Hero background photo used by [`src/components/sections/hero.tsx`](../src/components/sections/hero.tsx).

- **Source:** Unsplash (free for commercial use — no attribution required, but credited below).
- **Photographer:** Rohan Krishnan — https://unsplash.com/photos/PF4eZpZpGXw
- Matte-black cafe racer on a dark studio background; the hero overlays dark gradients for headline contrast.

### Swapping it
Replace `public/hero-bike.jpg` with any wide/landscape (or studio) shot — ideally a **real photo of your own bikes** for brand authenticity. Keep the filename, or update the `src` in the hero. After swapping, you can fine-tune the crop via the `object-[..]` class in the hero (e.g. `object-center`, `object-[70%_center]`).
