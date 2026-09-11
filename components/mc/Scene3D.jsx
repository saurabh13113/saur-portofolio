"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSfx } from "@/hooks/useSfx";
import {
  TOOLS, EMERALD_IDS, PHYSICS_3D, hitsToBreak, advanceBlock, stepPhysics3D,
  loadFoundEmeralds, saveFoundEmeralds,
} from "@/components/mc/hero-scene-logic";

const GROUND = { width: 12, depth: 8 };
const BOUNDS = {
  minX: -GROUND.width / 2 + 0.5,
  maxX: GROUND.width / 2 - 0.5,
  minZ: -GROUND.depth / 2 + 0.5,
  maxZ: GROUND.depth / 2 - 0.5,
};
const PLATFORM_TEX = ["grass", "dirt", "stone", "dirt", "grass"];
const TEX_COLOR = { grass: "#7cb342", dirt: "#866043", stone: "#7f7f7f" };
const PLATFORMS = PLATFORM_TEX.map((tex, i) => ({
  x: -2.4 + i * 1.2,
  z: -1.5,
  tex,
}));
const GEM_SPOTS = [
  { id: "grass", x: -4.5, y: 0.4, z: 2.5 },
  { id: "path", x: 4.5, y: 0.4, z: 2.5 },
  { id: "cloud", x: -2.4, y: 2.1, z: -1.5 },
];
const GEM_RADIUS = 0.6;

function keyToInput(key) {
  if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
  if (key === "ArrowRight" || key === "d" || key === "D") return "right";
  if (key === "ArrowUp" || key === "w" || key === "W") return "forward";
  if (key === "ArrowDown" || key === "s" || key === "S") return "back";
  if (key === " ") return "jump";
  return null;
}

function Ground() {
  const blocks = [];
  for (let x = 0; x < GROUND.width; x++) {
    for (let z = 0; z < GROUND.depth; z++) {
      blocks.push([x - GROUND.width / 2 + 0.5, z - GROUND.depth / 2 + 0.5]);
    }
  }
  return (
    <group>
      {blocks.map(([x, z], i) => (
        <mesh key={i} position={[x, -0.5, z]} receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5b8a3c" />
        </mesh>
      ))}
    </group>
  );
}

function Platform({ tex, x, z, state, onHit }) {
  const scale = state.shattering ? 0.001 : 1 - state.hits * 0.12;
  return (
    <mesh
      position={[x, 1, z]}
      scale={[scale, scale, scale]}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onHit();
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={TEX_COLOR[tex]} />
    </mesh>
  );
}

function Gem({ x, y, z, found }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 1.5;
  });
  if (found) return null;
  return (
    <mesh ref={ref} position={[x, y, z]}>
      <octahedronGeometry args={[0.25]} />
      <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.5} />
    </mesh>
  );
}

function Character({ posRef }) {
  const group = useRef();
  useFrame(() => {
    const { x, y, z, rotY } = posRef.current;
    if (group.current) {
      group.current.position.set(x, y, z);
      group.current.rotation.y = rotY;
    }
  });
  return (
    <group ref={group} castShadow>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#e0ac69" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial color="#3b5dc9" />
      </mesh>
      <mesh position={[-0.35, 0.95, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#e0ac69" />
      </mesh>
      <mesh position={[0.35, 0.95, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#e0ac69" />
      </mesh>
      <mesh position={[-0.15, 0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4a3222" />
      </mesh>
      <mesh position={[0.15, 0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4a3222" />
      </mesh>
    </group>
  );
}

function ChaseCamera({ posRef }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame(() => {
    const { x, y, z } = posRef.current;
    target.current.set(x, y + 3.2, z + 6.5);
    camera.position.lerp(target.current, 0.08);
    camera.lookAt(x, y + 1, z);
  });
  return null;
}

function TorchLight({ posRef, active }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      const { x, y, z } = posRef.current;
      ref.current.position.set(x, y + 2, z);
    }
  });
  if (!active) return null;
  return <pointLight ref={ref} color="#ffb066" intensity={1.4} distance={6} />;
}

function SceneContents({ inputRef, posRef, blocksRef, blocks, onHit, tool, found, onCollect }) {
  useFrame(() => {
    const { x, y, z } = posRef.current;
    posRef.current = stepPhysics3D(
      posRef.current,
      inputRef.current,
      blocksRef.current
        .map((b, i) => ({ b, i }))
        .filter(({ b }) => !b.shattering)
        .map(({ i }) => ({
          minX: PLATFORMS[i].x - 0.5,
          maxX: PLATFORMS[i].x + 0.5,
          minZ: PLATFORMS[i].z - 0.5,
          maxZ: PLATFORMS[i].z + 0.5,
          top: 1.5,
        })),
      BOUNDS
    );
    for (const g of GEM_SPOTS) {
      if (found.includes(g.id)) continue;
      const d = Math.hypot(posRef.current.x - g.x, posRef.current.y - g.y, posRef.current.z - g.z);
      if (d < GEM_RADIUS) onCollect(g.id);
    }
    void x;
    void y;
    void z;
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
      <fog attach="fog" args={["#bfe8ff", 9, 18]} />
      <Ground />
      {PLATFORMS.map((p, i) => (
        <Platform key={i} tex={p.tex} x={p.x} z={p.z} state={blocks[i]} onHit={() => onHit(i)} />
      ))}
      {GEM_SPOTS.map((g) => (
        <Gem key={g.id} {...g} found={found.includes(g.id)} />
      ))}
      <Character posRef={posRef} />
      <ChaseCamera posRef={posRef} />
      <TorchLight posRef={posRef} active={tool === "torch"} />
    </>
  );
}

export default function Scene3D() {
  const { play } = useSfx();
  const containerRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0, z: 3, vy: 0, rotY: 0 });
  const inputRef = useRef({ forward: false, back: false, left: false, right: false, jump: false });
  const blocksRef = useRef(PLATFORM_TEX.map(() => ({ hits: 0, shattering: false })));
  const foundRef = useRef([]);

  const [tool, setTool] = useState(TOOLS[0].id);
  const [blocks, setBlocks] = useState(blocksRef.current);
  const [found, setFound] = useState([]);

  useEffect(() => {
    const loaded = loadFoundEmeralds();
    foundRef.current = loaded;
    setFound(loaded);
  }, []);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  function setKey(key, value) {
    const dir = keyToInput(key);
    if (!dir) return false;
    inputRef.current = { ...inputRef.current, [dir]: value };
    return true;
  }

  function onKeyDown(e) {
    if (setKey(e.key, true)) e.preventDefault();
  }
  function onKeyUp(e) {
    if (setKey(e.key, false)) e.preventDefault();
  }

  function hitBlock(i) {
    const cur = blocksRef.current[i];
    const { hits, broken } = advanceBlock(cur.hits, tool);
    play(broken ? "break" : "click");
    setBlocks((prev) => {
      const next = [...prev];
      next[i] = { hits, shattering: broken };
      return next;
    });
    if (broken) {
      setTimeout(() => {
        setBlocks((prev) => {
          const next = [...prev];
          next[i] = { hits: 0, shattering: false };
          return next;
        });
      }, 500);
    }
  }

  function collect(id) {
    if (foundRef.current.includes(id)) return;
    const next = [...foundRef.current, id];
    foundRef.current = next;
    setFound(next);
    saveFoundEmeralds(next);
    play("orb");
  }

  function onSceneClick(e) {
    if (tool === "compass" && e.target === containerRef.current) {
      play("click");
      document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div>
      <p className="text-xs text-white/50 font-primary mt-8 mb-1">
        Click into the scene, then ← → ↑ ↓ (or WASD) to move, Space to jump.
      </p>
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onClick={onSceneClick}
        className="mc-scene-3d relative h-[420px] focus:outline focus:outline-2 focus:outline-white"
        role="application"
        aria-label="Playable 3D scene (optional): move the character, break blocks, find hidden gems"
      >
        <Canvas shadows camera={{ position: [0, 3.2, 9.5], fov: 50 }}>
          <color attach="background" args={["#8ec9ff"]} />
          <SceneContents
            inputRef={inputRef}
            posRef={posRef}
            blocksRef={blocksRef}
            blocks={blocks}
            onHit={hitBlock}
            tool={tool}
            found={found}
            onCollect={collect}
          />
        </Canvas>

        <div className="absolute top-2 right-2 mc-bevel tex-obsidian px-3 py-1 text-xs font-mc text-[#a8f0c0] pointer-events-none">
          💎 {found.length}/{EMERALD_IDS.length}
        </div>

        <div className="absolute top-2 left-2 flex gap-2" role="group" aria-label="Equip a tool (cosmetic)">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                play("click");
                setTool(t.id);
              }}
              aria-pressed={tool === t.id}
              title={t.label}
              className={`mc-bevel tex-dirt w-9 h-9 flex items-center justify-center text-base focus:outline focus:outline-2 focus:outline-white ${
                tool === t.id ? "outline outline-2 outline-white" : ""
              }`}
            >
              <span aria-hidden="true">{t.glyph}</span>
              <span className="sr-only">{t.label}</span>
            </button>
          ))}
        </div>

        {found.length === EMERALD_IDS.length && (
          <div className="absolute inset-x-0 bottom-2 mx-auto w-max mc-bevel tex-plank px-4 py-2 text-xs font-mc text-[#f4e4c1] pointer-events-none">
            Achievement: Full-Stack Explorer 🏆
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-2 sm:hidden" role="group" aria-label="Touch controls">
        {[
          { label: "◀", key: "ArrowLeft" },
          { label: "▲", key: "ArrowUp" },
          { label: "▶", key: "ArrowRight" },
          { label: "⤒", key: " " },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            className="mc-bevel tex-dirt w-14 h-12 text-[#f4e4c1] text-lg"
            onPointerDown={() => setKey(b.key, true)}
            onPointerUp={() => setKey(b.key, false)}
            onPointerLeave={() => setKey(b.key, false)}
            aria-label={
              b.key === "ArrowLeft" ? "Move left" : b.key === "ArrowRight" ? "Move right" : b.key === " " ? "Jump" : "Move forward"
            }
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
