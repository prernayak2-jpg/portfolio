import { photos } from "@/content/photography";
import GalleryWall from "@/components/creatives/GalleryWall";

// Photography: the room after Creatives. Same hand-drawn sketch wall, with
// the photos laid edge to edge in a mosaic.
export default function PhotographyPage() {
  return (
    <main>
      <GalleryWall
        title="Photography Gallery"
        photos={photos}
        look="sketch"
        previousRoom={{ href: "/creatives", label: "Previous room" }}
      />
    </main>
  );
}
