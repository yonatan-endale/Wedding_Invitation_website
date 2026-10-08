import { GallerySection, type GalleryPhoto } from "../../gallery";
import { StitchFrame } from "./ornaments";

/**
 * The shared carousel, hung inside an embroidered frame whose corners stitch
 * themselves in. The carousel itself is untouched, so Embla can measure and
 * drag it.
 */
export function KabaGallery({ photos, names }: { photos: GalleryPhoto[]; names: string }) {
  if (photos.length === 0) return null;
  return (
    <div className="relative mx-3 my-10 sm:mx-6 sm:my-14 lg:mx-10 2xl:mx-auto 2xl:max-w-[80rem]">
      <StitchFrame id="kaba-gallery-frame" />
      <div className="px-2 py-4 sm:px-6 sm:py-6">
        <GallerySection photos={photos} names={names} />
      </div>
    </div>
  );
}
