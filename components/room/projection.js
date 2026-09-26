// The room camera, as plain math (no three.js), so the picture fallback can
// place hotspots exactly where the 3D room draws things without loading three.
export const TARGET = [3, 1.75, 3]; // point the camera looks at
export const DIR = [1, 0.95, 1]; // from the near corner, high up
export const ASPECT = 1.15; // room box width / height; the room is wider than tall
export const HALF = 3.95; // half the visible world width
export const HALF_Y = HALF / ASPECT;

const norm = (v) => {
  const l = Math.hypot(...v);
  return v.map((x) => x / l);
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const forward = norm(DIR.map((x) => -x));
const right = norm(cross(forward, [0, 1, 0]));
const up = cross(right, forward);

// World point -> CSS position (in %) inside the room box.
export function toScreen(p) {
  const d = p.map((x, i) => x - TARGET[i]);
  return {
    left: `${(0.5 + dot(d, right) / (2 * HALF)) * 100}%`,
    top: `${(0.5 - dot(d, up) / (2 * HALF_Y)) * 100}%`,
  };
}
