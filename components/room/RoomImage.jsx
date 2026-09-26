import Image from "next/image";
import RoomHotspot from "@/components/room/RoomHotspot";
import HiddenObject from "@/components/room/easter-eggs/HiddenObject";
import InteractiveCat from "@/components/room/easter-eggs/InteractiveCat";
import PhotoFrame from "@/components/room/easter-eggs/PhotoFrame";
import AudioObject from "@/components/room/easter-eggs/AudioObject";
import { ROOM_OBJECTS, PHOTOS } from "@/components/room/roomObjects";
import { toScreen } from "@/components/room/projection";

// A snapshot of the 3D room taken with the same camera, shown while three.js
// loads and wherever WebGL isn't available. Hotspots sit on the same anchors
// as the 3D labels, so the swap to 3D is seamless.
// Regenerate public/assets/room-poster.png whenever the scene changes (see README).
const at = (anchor) => ({ ...toScreen(anchor), width: "44px", height: "44px", transform: "translate(-50%, -50%)" });

function Hotspot({ o }) {
  const style = at(o.anchor);
  if (o.kind === "nav") return <RoomHotspot href={o.href} label={o.label} style={style} />;
  if (o.kind === "cat") return <InteractiveCat style={style} />;
  if (o.kind === "photo") return <PhotoFrame images={PHOTOS} style={style} />;
  if (o.kind === "audio") return <AudioObject label={o.label} src={o.src} loop={o.loop} style={style} />;
  return <HiddenObject label={o.label} tooltip={o.tooltip} style={style} />;
}

export default function RoomImage() {
  return (
    <div className="room-poster absolute inset-0">
      <Image
        src="/assets/room-poster.png"
        alt="Isometric pixel-art bedroom at night: Saurabh coding at a triple-monitor desk, bookshelf, bed, a piano by the window and a cat on the sill."
        fill
        priority
        unoptimized
        className="select-none"
        style={{ imageRendering: "pixelated" }}
      />
      {ROOM_OBJECTS.filter((o) => o.kind !== "switch").map((o) => (
        <Hotspot key={o.id} o={o} />
      ))}
    </div>
  );
}
