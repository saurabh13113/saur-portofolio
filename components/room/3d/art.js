// Pixel-art pictures for the walls, painted on tiny canvases (one canvas pixel
// is about one screen pixel of the 420px render). Each is { px: [w, h], draw(g) }.

// 3x5 bitmap font, just the letters the posters need.
const FONT = {
  B: ["110", "101", "110", "101", "110"],
  L: ["100", "100", "100", "100", "111"],
  E: ["111", "100", "110", "100", "111"],
  A: ["010", "101", "111", "101", "101"],
  C: ["011", "100", "100", "100", "011"],
  H: ["101", "101", "111", "101", "101"],
  M: ["101", "111", "111", "101", "101"],
  S: ["011", "100", "010", "001", "110"],
  I: ["111", "010", "010", "010", "111"],
  1: ["010", "110", "010", "010", "111"],
  0: ["111", "101", "101", "101", "111"],
};

function text(g, str, x, y, color, k = 1) {
  g.fillStyle = color;
  [...str].forEach((ch, i) =>
    FONT[ch].forEach((row, r) =>
      [...row].forEach((on, c) => on === "1" && g.fillRect(x + (i * 4 + c) * k, y + r * k, k, k))
    )
  );
}

const rect = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

const disc = (g, color, cx, cy, r) => {
  g.fillStyle = color;
  for (let y = -r; y <= r; y++) {
    const w = Math.round(Math.sqrt(r * r - y * y));
    g.fillRect(cx - w, cy + y, w * 2, 1);
  }
};

// The family photo above my monitors: a real photo shrunk to 32x22 pixels, with
// a drawn family-at-sunset as the stand-in while it loads.
export const FAMILY_ART = {
  px: [32, 22],
  src: "/assets/family/family-6.jpeg",
  draw(g) {
    rect(g, "#f39a5b", 0, 0, 32, 5);
    rect(g, "#f7c07e", 0, 5, 32, 5);
    disc(g, "#fff0a8", 25, 7, 3);
    rect(g, "#3d6fa8", 0, 10, 32, 3);
    rect(g, "#5b8cc4", 0, 10, 32, 1);
    rect(g, "#e8cf9c", 0, 13, 32, 9);
    // [x, head y, shirt, hair]: dad, mom, me, sibling
    const people = [
      [5, 6, "#2e6b57", "#1a1412"],
      [11, 7, "#c0392b", "#2a1d17"],
      [18, 6, "#1d1d23", "#17110e"],
      [24, 9, "#34598f", "#1a1412"],
    ];
    for (const [x, y, shirt, hair] of people) {
      rect(g, hair, x, y, 3, 1);
      rect(g, "#8d5a3b", x, y + 1, 3, 2);
      rect(g, shirt, x - 1, y + 3, 5, 5);
      rect(g, "#2a3348", x, y + 8, 1, 4);
      rect(g, "#2a3348", x + 2, y + 8, 1, 4);
    }
  },
};

// Messi's Argentina #10, back side, framed.
export const MESSI_ART = {
  px: [28, 32],
  draw(g) {
    rect(g, "#2a2f3d", 0, 0, 28, 32);
    rect(g, "#f4f4f4", 4, 3, 20, 26);
    for (let x = 6; x < 24; x += 4) rect(g, "#75aadb", x, 3, 2, 26);
    rect(g, "#75aadb", 0, 3, 4, 7);
    rect(g, "#75aadb", 24, 3, 4, 7);
    rect(g, "#1d2c5e", 10, 3, 8, 1);
    rect(g, "#f4f4f4", 4, 5, 20, 7);
    text(g, "MESSI", 5, 6, "#1d2c5e");
    text(g, "10", 8, 13, "#1d2c5e", 2);
    rect(g, "#d4a82a", 12, 25, 4, 2); // the badge star, sort of
  },
};

// Bleach: Ichigo with Zangetsu in front of a red moon, manga-cover white.
export const BLEACH_ART = {
  px: [26, 38],
  draw(g) {
    rect(g, "#ece6da", 0, 0, 26, 38);
    disc(g, "#c0392b", 13, 13, 9);
    // Zangetsu: a huge black cleaver with a silver edge, wrapped hilt
    rect(g, "#141418", 18, 4, 4, 22);
    rect(g, "#c9ced6", 21, 4, 1, 22);
    rect(g, "#e8e8e8", 19, 26, 2, 4);
    // spiky orange hair
    const orange = "#ff8c1a";
    rect(g, orange, 8, 7, 9, 4);
    for (const [x, y] of [[7, 6], [10, 5], [13, 5], [16, 6], [6, 9], [17, 9]]) rect(g, orange, x, y, 2, 2);
    rect(g, "#f0c9a0", 9, 11, 7, 4);
    rect(g, "#3b2a1a", 10, 12, 2, 1);
    rect(g, "#3b2a1a", 13, 12, 2, 1);
    // black shihakusho with the white collar
    rect(g, "#0c0c10", 7, 15, 11, 15);
    rect(g, "#e8e8e8", 11, 15, 1, 3);
    rect(g, "#e8e8e8", 13, 15, 1, 3);
    rect(g, "#e8e8e8", 17, 16, 2, 2); // hand on the hilt
    text(g, "BLEACH", 2, 32, "#141418");
  },
};
