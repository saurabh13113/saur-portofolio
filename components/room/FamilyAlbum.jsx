"use client";
import { useEffect, useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";
import { FAMILY, FAMILY_CAPTION } from "@/components/room/roomObjects";

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
  const btn = "mc-bevel tex-plank w-11 h-11 flex items-center justify-center text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white";
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      aria-label={FAMILY_CAPTION}
      className="family-album bg-transparent p-0 w-[min(92vw,640px)] text-[#f4e4c1]"
    >
      {/* a wooden frame with a cream mat, like the one on my wall */}
      <figure className="bg-[#5e3c22] p-3 sm:p-4 shadow-[6px_6px_0_rgba(0,0,0,0.45)] border-2 border-[#3d2615]">
        <div className="bg-[#efe6d2] p-3 sm:p-5 border border-[#3d2615]/40">
          <div
            className="relative aspect-[4/3] bg-[#ddd2bb] overflow-hidden"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain img: sizes vary, no layout shift inside the fixed box */}
            <img key={photo.src} src={photo.src} alt={photo.alt} className="slide-in absolute inset-0 w-full h-full object-contain" style={{ imageRendering: "auto" }} />
          </div>
          <figcaption className="mt-3 text-center font-mc text-sm sm:text-base text-[#3b2a1a]">{FAMILY_CAPTION}</figcaption>
        </div>
      </figure>
      <div className="flex items-center justify-center gap-2 mt-3">
        {FAMILY.length > 1 ? (
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={btn}>
            <BsChevronLeft aria-hidden="true" />
          </button>
        ) : null}
        <div className="flex gap-1.5 mx-2" role="group" aria-label="Jump to photo">
          {FAMILY.map((p, k) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setI(k)}
              aria-label={p.alt}
              aria-current={k === i}
              className={`w-3 h-3 border border-[#f4d27a] focus:outline focus:outline-2 focus:outline-white ${k === i ? "bg-[#f4d27a]" : "bg-transparent"}`}
            />
          ))}
        </div>
        {FAMILY.length > 1 ? (
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className={btn}>
            <BsChevronRight aria-hidden="true" />
          </button>
        ) : null}
        <button type="button" onClick={onClose} aria-label="Close" className="mc-bevel tex-dirt w-11 h-11 ml-2 flex items-center justify-center focus:outline focus:outline-2 focus:outline-white">
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
