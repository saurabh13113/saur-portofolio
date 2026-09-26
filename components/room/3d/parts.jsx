"use client";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BufferAttribute, CanvasTexture, Matrix4, MeshLambertMaterial, NearestFilter, SRGBColorSpace } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// { hovered, setHovered, activate } from Room3D.
export const RoomCtx = createContext(null);
const LitCtx = createContext(false);

const HIGHLIGHT = "#6b4a1a";

// Box laid out by its min corner p=[x,y,z] and size s=[w,h,d]: far easier for
// furnishing a room than three's centred boxes. e = emissive colour for things
// that glow (screens, lamps, LEDs). mref exposes the mesh for animation.
// Glowing/animated boxes are flagged `keep` so Merge leaves them as real meshes.
export function B({ p, s, c, e, ei = 1, mref }) {
  const lit = useContext(LitCtx);
  return (
    <mesh ref={mref} position={[p[0] + s[0] / 2, p[1] + s[1] / 2, p[2] + s[2] / 2]} userData={e || mref ? { keep: true } : undefined}>
      <boxGeometry args={s} />
      <meshLambertMaterial color={c} emissive={e ?? (lit ? HIGHLIGHT : "#000000")} emissiveIntensity={e ? ei : 1} />
    </mesh>
  );
}

// A flat pixel-art picture on a wall (art = { px, draw, src? } from art.js), placed by
// its min corner like B. face "z" hangs it on the right wall (facing +z), "x" on
// the left wall (facing +x); w runs along the wall, h up it. Flagged keep so
// Merge doesn't bake away the texture.
export function Pic({ p, w, h, art, face = "z" }) {
  const lit = useContext(LitCtx);
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    [c.width, c.height] = art.px;
    const g = c.getContext("2d");
    art.draw(g);
    const t = new CanvasTexture(c);
    t.magFilter = t.minFilter = NearestFilter;
    t.generateMipmaps = false;
    t.colorSpace = SRGBColorSpace;
    // A real photo, shrunk to pixel-art size (cover-cropped); draw() stays up until it loads.
    if (art.src) {
      const img = new Image();
      img.onload = () => {
        const s = Math.max(c.width / img.width, c.height / img.height);
        g.drawImage(img, (c.width - img.width * s) / 2, (c.height - img.height * s) / 2, img.width * s, img.height * s);
        t.needsUpdate = true;
      };
      img.src = art.src;
    }
    return t;
  }, [art]);
  const x = face === "z";
  return (
    <mesh position={x ? [p[0] + w / 2, p[1] + h / 2, p[2]] : [p[0], p[1] + h / 2, p[2] + w / 2]} rotation={[0, x ? 0 : Math.PI / 2, 0]} userData={{ keep: true }}>
      <planeGeometry args={[w, h]} />
      <meshLambertMaterial map={map} emissive={lit ? HIGHLIGHT : "#000000"} />
    </mesh>
  );
}

// Bakes every plain box inside into one vertex-coloured mesh (one draw call
// instead of dozens). The originals stay in the scene, hidden, so pointer
// events still hit them. Skips boxes flagged keep and groups flagged live
// (things that animate or change colour between day and night).
export function Merge({ children }) {
  const group = useRef(null);
  const lit = useContext(LitCtx);
  const mat = useMemo(() => new MeshLambertMaterial({ vertexColors: true }), []);
  const [geo, setGeo] = useState(null);

  useLayoutEffect(() => {
    const g = group.current;
    g.updateMatrixWorld(true);
    const toLocal = new Matrix4().copy(g.matrixWorld).invert();
    const parts = [];
    const walk = (o) => {
      for (const c of o.children) {
        if (c.userData.live) continue;
        if (c.isMesh && c.material?.isMeshLambertMaterial && !c.userData.keep) {
          const part = c.geometry.clone().applyMatrix4(new Matrix4().multiplyMatrices(toLocal, c.matrixWorld));
          const { r, g: gr, b } = c.material.color;
          const col = new Float32Array(part.attributes.position.count * 3);
          for (let i = 0; i < col.length; i += 3) col.set([r, gr, b], i);
          part.setAttribute("color", new BufferAttribute(col, 3));
          parts.push(part);
          c.visible = false;
        }
        walk(c);
      }
    };
    walk(g);
    if (parts.length) setGeo(mergeGeometries(parts));
  }, []);

  useEffect(() => {
    mat.emissive.set(lit ? HIGHLIGHT : "#000000");
  }, [lit, mat]);

  return (
    <group ref={group}>
      {children}
      {geo ? <mesh geometry={geo} material={mat} raycast={() => null} userData={{ live: true }} /> : null}
    </group>
  );
}

// A clickable object: hovering lights up every box inside it, clicking activates it.
export function Obj({ id, children, ...group }) {
  const { hovered, setHovered, activate } = useContext(RoomCtx);
  return (
    <group
      {...group}
      userData={{ live: true }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered((h) => (h === id ? null : h));
      }}
      onClick={(e) => {
        e.stopPropagation();
        activate(id);
      }}
    >
      <LitCtx.Provider value={hovered === id}>
        <Merge>{children}</Merge>
      </LitCtx.Provider>
    </group>
  );
}

// Soft blob shadow on the floor under an object: x/z footprint, a little larger than the object.
let blobTexture;
function getBlobTexture() {
  if (blobTexture) return blobTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 8, 32, 32, 32);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  blobTexture = new CanvasTexture(c);
  return blobTexture;
}

export function Shadow({ x, z, w, d, o = 0.45, y = 0.004 }) {
  const map = useMemo(getBlobTexture, []);
  return (
    <mesh position={[x + w / 2, y, z + d / 2]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null} userData={{ live: true }}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={map} color="#000000" transparent opacity={o} depthWrite={false} />
    </mesh>
  );
}
