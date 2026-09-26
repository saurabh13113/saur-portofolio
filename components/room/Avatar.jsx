"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL, useWakeUp } from "@/components/room/RoomStage";

const Avatar3D = dynamic(() => import("@/components/room/3d/Avatar3D"), { ssr: false });

// The Minecraft-style me. Until three.js wakes up (and where WebGL isn't
// available) a snapshot of it stands in: public/assets/avatar-poster.png, made by
// `npm run poster`.
export default function Avatar({ className = "", bubble = null, page }) {
  const [webgl, setWebgl] = useState(null);
  useEffect(() => setWebgl(hasWebGL()), []);
  const awake = useWakeUp();

  return (
    <div className={`relative aspect-[3/4] ${className}`}>
      {webgl && awake ? <Avatar3D bubble={bubble} page={page} /> : null}
      {webgl && awake ? null : (
        // eslint-disable-next-line @next/next/no-img-element -- tiny pixel-art PNG, sized by the box
        <img src="/assets/avatar-poster.png" alt="" className="absolute inset-0 w-full h-full" style={{ imageRendering: "pixelated" }} />
      )}
    </div>
  );
}
