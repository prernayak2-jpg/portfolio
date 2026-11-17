import { creatives } from "@/content/creatives";
import GalleryWall from "@/components/creatives/GalleryWall";

// Creatives: a gallery wall in elevation that scrolls sideways.
// At the end, "Next room" leads to the Photography gallery.
export default function CreativesPage() {
  return (
    <main>
      <GalleryWall
        title="Creatives Gallery"
        items={creatives}
        nextRoom={{ href: "/photography", label: "Next room" }}
      />
    </main>
  );
}
