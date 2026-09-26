"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL } from "@/components/room/RoomStage";
import { PixelPhoto } from "@/components/room/easter-eggs/PhotoFrame";

const Avatar3D = dynamic(() => import("@/components/room/3d/Avatar3D"), { ssr: false });

// The Minecraft-style me in the sidebar; a pixelated photo where WebGL isn't available.
export default function Avatar({ className = "" }) {
  const [webgl, setWebgl] = useState(null);
  useEffect(() => setWebgl(hasWebGL()), []);

  return (
    <div className={`relative aspect-[3/4] ${className}`}>
      {webgl ? <Avatar3D /> : null}
      {webgl === false ? <PixelPhoto src="/assets/photo.png" className="w-full h-full" /> : null}
    </div>
  );
}
