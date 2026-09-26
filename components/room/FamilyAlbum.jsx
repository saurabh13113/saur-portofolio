"use client";
import { useEffect, useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";
import { FAMILY } from "@/components/room/roomObjects";

// The family photo on the wall, opened up: a modal carousel (native <dialog>
// handles focus, Esc and the backdrop). ←/→ keys and swipes flip photos.
export default function FamilyAlbum({ open, onClose }) {
  const dialog = useRef(null);
  const [i, setI] = useState(0);
  const touchX = useRef(0);
  const go = (d) => setI((x) => (x + d + FAMILY.length) % FAMILY.length);

  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const photo = FAMILY[i];
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      aria-label="Family photos"
      className="family-album mc-bevel tex-obsidian p-3 w-[min(92vw,720px)] text-[#f4e4c1]"
    >
      <div
        className="relative aspect-[4/3] bg-black/40 overflow-hidden"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- plain img: sizes vary, no layout shift inside the fixed box */}
        <img key={photo.src} src={photo.src} alt={photo.caption} className="slide-in absolute inset-0 w-full h-full object-contain" style={{ imageRendering: "auto" }} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <p className="font-mc text-sm flex-1">
          {photo.caption}
          <span className="text-white/50 ml-2">
            {i + 1} / {FAMILY.length}
          </span>
        </p>
        {FAMILY.length > 1 ? (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="mc-bevel tex-plank w-11 h-11 flex items-center justify-center text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
              <BsChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="mc-bevel tex-plank w-11 h-11 flex items-center justify-center text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
              <BsChevronRight aria-hidden="true" />
            </button>
          </>
        ) : null}
        <button type="button" onClick={onClose} aria-label="Close" className="mc-bevel tex-dirt w-11 h-11 flex items-center justify-center focus:outline focus:outline-2 focus:outline-white">
          <BsX aria-hidden="true" className="text-xl" />
        </button>
      </div>
    </dialog>
  );
}

// Picture-fallback hotspot for the album.
export function AlbumHotspot({ label, style }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label={label} onClick={() => setOpen(true)} className="room-hotspot" style={style}>
        <span className="room-label">{label}</span>
      </button>
      <FamilyAlbum open={open} onClose={() => setOpen(false)} />
    </>
  );
}
