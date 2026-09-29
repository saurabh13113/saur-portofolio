// Every clickable thing in the room, shared by the 3D room (Room3D) and the
// picture fallback (RoomImage). anchor: [x, y, z] world point where the
// object's label/tooltip (and, in the picture, its hotspot) sits.
// kind: nav (link) | egg (tooltip; some also animate when clicked, see Scene) | audio | speaker (playlist) | cat |
// photo | album (family carousel) | switch (day/night) | lamp (desk lamp on/off) | game (PS4 penalty shootout)

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

// The family photo on the wall opens this carousel, oldest first; every photo
// carries the same caption. Photos live in public/assets/family/.
export const FAMILY_CAPTION = "The people that made me me";
export const FAMILY = ["family-1.jpg", "family-2.jpg", "family-3.jpg", "family-4.jpg", "family-5.jpeg", "family-6.jpeg"].map(
  (f, i) => ({ src: `/assets/family/${f}`, alt: `Family photo ${i + 1} of 6` })
);

export const ROOM_OBJECTS = [
  { id: "work", kind: "nav", label: "Projects", href: "/projects", anchor: [1.2, 1.55, 0.15] },
  { id: "resume", kind: "nav", label: "Resume", href: "/resume", anchor: [0.2, 2.05, 2.05] },
  { id: "skills", kind: "nav", label: "Skills", href: "/resume?tab=skills", anchor: [5.55, 1.2, 3.9] },
  { id: "services", kind: "nav", label: "What I do", href: "/services", anchor: [0.05, 1.45, 3.35] },
  { id: "contact", kind: "nav", label: "Say hi", href: "/contact", anchor: [1.3, 0.05, 1.5] },

  { id: "pennant", kind: "egg", label: "UTM pennant", tooltip: "My home away from home.", anchor: [0.02, 2.65, 1.45] },
  { id: "trophies", kind: "egg", label: "Trophy shelf", tooltip: "Dean's list, Academic Society of the Year 25/26", anchor: [0.15, 2.3, 0.55] },
  { id: "abudhabi", kind: "egg", label: "Abu Dhabi poster", tooltip: "A good shawarma really does wonders", anchor: [3.1, 2.2, 0.02] },
  { id: "uae", kind: "egg", label: "UAE flag", tooltip: "Made me an adult, taught me how to survive", anchor: [0.2, 2.25, 2.35] },
  { id: "backpack", kind: "egg", label: "Backpack", tooltip: "Always packed for the next hackathon.", anchor: [0.6, 0.6, 2.65] },
  { id: "bed", kind: "egg", label: "The bed", tooltip: "Night owl always, 12 am onwards is my primetime", anchor: [1.3, 0.7, 4.9] },
  { id: "nightstand", kind: "egg", label: "Nightstand books", tooltip: "Currently reading some Wolverine comics", anchor: [0.22, 0.85, 4.05] },
  { id: "hoodie", kind: "egg", label: "Hoodie on the hook", tooltip: "My green Tom & Jerry hoodie, the one thing that is as comfy as 6 years ago.", anchor: [0.1, 1.75, 2.72] },
  { id: "laundry", kind: "egg", label: "Laundry basket", tooltip: "Sometimes you forget to shower or two honestly.", anchor: [5.6, 0.65, 0.4] },
  { id: "studentid", kind: "egg", label: "Student ID", tooltip: "UTM has been my home for 4 years, the deer on campus are my bros now.", anchor: [2.0, 0.85, 0.6] },
  { id: "coffee", kind: "egg", label: "Coffee", tooltip: "I love a good iced coffee, french vanilla from Tims is my G", anchor: [2.45, 1.05, 0.4] },
  { id: "soccer", kind: "egg", label: "Soccer ball", tooltip: "Center back, making sure no one scores and no one gets by.", anchor: [3.51, 0.45, 4.66] },
  { id: "paddle", kind: "egg", label: "Table tennis paddle", tooltip: "Doubles champion during high school, champion amongst friends now lol", anchor: [5.05, 0.95, 4.12] },
  { id: "messi", kind: "egg", label: "Messi jersey", tooltip: "That hat-trick vs France in the '22 WC final, unmatched.", anchor: [0.05, 1.7, 4.85] },
  { id: "bleach", kind: "egg", label: "Bleach poster", tooltip: "Ichigo, Bankai: Tensa Zangetsu!", anchor: [2.24, 1.9, 0.03] },
  { id: "ps4", kind: "game", label: "PS4: penalty shootout", anchor: [5.3, 0.55, 2.57] },

  { id: "lamp", kind: "lamp", label: "Desk lamp", anchor: [0.19, 1.3, 0.21] },
  { id: "lights", kind: "switch", label: "Light switch", anchor: [0.05, 1.5, 3.95] },
  { id: "cat", kind: "cat", label: "Pet Tutroo the cat", anchor: [4.75, 1.45, 0.1] },
  { id: "family", kind: "album", label: "Family photos", anchor: [1.3, 2.05, 0.05] },
  { id: "photo", kind: "photo", label: "A photo", anchor: [2.36, 1.0, 0.07] },
  { id: "music", kind: "audio", label: "Play a favorite piece", src: "/sfx/keyboard-piece.mp3", anchor: [4.4, 0.6, 0.5] },
  { id: "song", kind: "speaker", label: "Speaker: play music", anchor: [2.52, 1.0, 0.1] },
];

export const CAT_REACTIONS = ["Meow", "I am on my 2/9 lives", "What is a cat's favorite color? Purr-ple", "Lots of love, from Tutroo"];
export const PHOTOS = ["/assets/photo.jpg", "/assets/photo.png"];
