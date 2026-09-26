// Every clickable thing in the room, shared by the 3D room (Room3D) and the
// picture fallback (RoomImage). anchor: [x, y, z] world point where the
// object's label/tooltip (and, in the picture, its hotspot) sits.
// kind: nav (link) | egg (tooltip) | audio | speaker (playlist) | cat | photo | album (family carousel) | switch (day/night)

// Background music for the desk speaker: plays through in order, round and round.
// Drop mp3s in public/music/ and list them here.
export const PLAYLIST = [
  { title: "Aruarian Dance – Nujabes", src: "/music/aruarian-dance.mp3" },
  { title: "Subwoofer Lullaby – C418", src: "/music/subwoofer-lullaby.mp3" },
  { title: "Chubina", src: "/music/chubina.mp3" },
  { title: "Mice on Venus – C418", src: "/music/mice-on-venus.mp3" },
  { title: "Aria Math – C418", src: "/music/aria-math.mp3" },
  { title: "Minecraft – C418", src: "/music/minecraft.mp3" },
];

// The family photo on the wall opens this carousel. Drop pictures in public/assets/family/.
export const FAMILY = [
  { src: "/assets/photo.jpg", caption: "Me" },
];

export const ROOM_OBJECTS = [
  { id: "work", kind: "nav", label: "Work", href: "/work", anchor: [1.2, 1.55, 0.15] },
  { id: "resume", kind: "nav", label: "Resume", href: "/resume", anchor: [0.2, 2.05, 2.05] },
  { id: "skills", kind: "nav", label: "Skills", href: "/resume?tab=skills", anchor: [5.55, 1.2, 3.9] },
  { id: "services", kind: "nav", label: "Services", href: "/services", anchor: [0.05, 1.45, 3.35] },
  { id: "contact", kind: "nav", label: "Say hi", href: "/contact", anchor: [1.3, 0.05, 1.5] },

  { id: "pennant", kind: "egg", label: "UTM pennant", tooltip: "CS & Economics @ University of Toronto", anchor: [0.02, 2.65, 1.45] },
  { id: "trophies", kind: "egg", label: "Trophy shelf", tooltip: "🏆 TMU Solution Hacks '25 winner · 🌱 Dean's List, 4 yrs", anchor: [0.15, 2.3, 0.55] },
  { id: "abudhabi", kind: "egg", label: "Abu Dhabi poster", tooltip: "Home: the Abu Dhabi skyline 🇦🇪", anchor: [3.1, 2.2, 0.02] },
  { id: "uae", kind: "egg", label: "UAE flag", tooltip: "🇦🇪 → 🇨🇦 From Abu Dhabi, building in Toronto.", anchor: [0.2, 2.25, 2.35] },
  { id: "backpack", kind: "egg", label: "Backpack", tooltip: "Always packed for the next hackathon.", anchor: [0.6, 0.6, 2.65] },
  { id: "bed", kind: "egg", label: "The bed", tooltip: "5 more minutes... then one more commit.", anchor: [1.3, 0.7, 4.9] },
  { id: "nightstand", kind: "egg", label: "Nightstand books", tooltip: "Bedtime reading: Better Code, Better Days.", anchor: [0.22, 0.85, 4.05] },
  { id: "hoodie", kind: "egg", label: "Hoodie on the hook", tooltip: "The hackathon hoodie. Undefeated.", anchor: [0.1, 1.75, 2.72] },
  { id: "beanbag", kind: "egg", label: "Beanbag", tooltip: "Where the hardest bugs get solved.", anchor: [5.45, 0.8, 2.85] },
  { id: "laundry", kind: "egg", label: "Laundry basket", tooltip: "Scheduled for after the next deploy.", anchor: [5.6, 0.65, 0.4] },
  { id: "studentid", kind: "egg", label: "Student ID", tooltip: "UTM student card. Access level: caffeine.", anchor: [2.0, 0.85, 0.6] },
  { id: "coffee", kind: "egg", label: "Instant coffee", tooltip: "Instant coffee: fuel of champions (and deadlines).", anchor: [2.45, 1.05, 0.4] },
  { id: "soccer", kind: "egg", label: "Soccer ball", tooltip: "Weekend footy. Still chasing that top-bins finish.", anchor: [3.51, 0.45, 4.66] },
  { id: "paddle", kind: "egg", label: "Table tennis paddle", tooltip: "Table tennis: undefeated in the common room. Allegedly.", anchor: [5.05, 0.95, 4.12] },
  { id: "messi", kind: "egg", label: "Messi jersey", tooltip: "Argentina #10, framed. The GOAT debate is closed.", anchor: [0.05, 1.7, 4.85] },
  { id: "bleach", kind: "egg", label: "Bleach poster", tooltip: "Bankai! Ichigo & Zangetsu, all-time favourite anime.", anchor: [2.24, 1.9, 0.03] },
  { id: "ps4", kind: "egg", label: "PS4", tooltip: "PS4 plugged in. FIFA rematch, anyone?", anchor: [5.08, 1.0, 3.85] },

  { id: "lights", kind: "switch", label: "Light switch", anchor: [0.05, 1.5, 3.95] },
  { id: "cat", kind: "cat", label: "Pet the cat", anchor: [4.75, 1.45, 0.1] },
  { id: "family", kind: "album", label: "Family photos", anchor: [1.3, 2.05, 0.05] },
  { id: "photo", kind: "photo", label: "A photo", anchor: [2.36, 1.0, 0.07] },
  { id: "music", kind: "audio", label: "Play a favorite piece", src: "/sfx/keyboard-piece.mp3", anchor: [4.4, 0.6, 0.5] },
  { id: "song", kind: "speaker", label: "Speaker: play music", anchor: [2.52, 1.0, 0.1] },
];

export const CAT_REACTIONS = ["Mrow?", "purrrr", "*stretches*", "not now, human"];
export const PHOTOS = ["/assets/photo.jpg", "/assets/photo.png"];
