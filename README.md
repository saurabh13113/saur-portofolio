## Portofolio website built using React & Next.js

*Checkout my website at https://saur-portofolio.vercel.app/*

## Introduction
I built a modern and responsive portfolio website using **Next.js**, **Tailwind CSS**, and **Framer Motion**. This project showcases my web development skills and serves as a platform to present my projects, resume, and contact information. The website is deployed on **Vercel**, ensuring fast load times and reliable hosting. This project allowed me to leverage the latest web technologies to create a visually appealing and highly performant site.

## Design and Implementation
The website was developed using **Next.js**, a powerful React framework that offers server-side rendering and static site generation. This ensured that my portfolio loads quickly and provides a seamless user experience. The styling of the website was done using **Tailwind CSS**, a utility-first CSS framework that allowed me to create a clean and responsive design efficiently. Tailwind's utility classes enabled rapid development and easy customization, ensuring the site looks great on all devices.

To enhance the user experience, I incorporated **Framer Motion** for animations and interactive elements. Framer Motion is a popular animation library for React that allowed me to create smooth transitions and engaging animations. These animations are used to highlight different sections of the portfolio, making the site more dynamic and visually appealing.

The website features several sections, including a home page, about me, projects, resume, and contact form. Each section is designed to be both informative and visually attractive. The project section dynamically fetches and displays information about my work, showcasing my skills and achievements. The contact form is integrated with **Formspree**, ensuring that messages are delivered directly to my email.

## Features and Enhancements
The portfolio website includes several advanced features that enhance its functionality and user experience. The use of **Next.js** enables **server-side rendering (SSR)** and **static site generation (SSG)**, ensuring fast load times and improved SEO. The responsive design implemented with **Tailwind CSS** guarantees that the site looks great on all devices, from desktops to smartphones.

**Framer Motion** animations add a professional touch to the website, making transitions and interactions smooth and engaging. The animations are optimized for performance, ensuring they do not negatively impact the site's loading speed or usability.

Deployment on **Vercel** provides several benefits, including automatic deployments from the main branch, preview URLs for pull requests, and global CDN for fast load times. **Vercel's** continuous integration and deployment pipeline ensures that updates to the website are deployed quickly and reliably.

Overall, this portfolio website project demonstrates my ability to use modern web development technologies to create a professional, responsive, and visually appealing site. The combination of **Next.js**, **Tailwind CSS**, and **Framer Motion** allowed me to build a site that not only looks great but also performs exceptionally well. This project highlights my skills in frontend development and my ability to create engaging web experiences.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)!

## Theme: "Saurabh's Room"

The home page is a real 3D, voxel/pixel-art bedroom with a lofi-girl mood.
The camera looks down from the top of the near corner, and I'm coding at a
triple-monitor desk in the far corner. Everything clickable in the room leads
to part of the portfolio. The inner pages (Work, Resume, Services, Contact)
use the same cozy night palette with lamp-amber accents.

- **3D room** (`components/room/3d/`): three.js via `@react-three/fiber`,
  built entirely from boxes in code. It uses a fixed isometric camera and
  renders at 420px wide, scaled up without smoothing, which gives the pixel look.
  - **Interaction:** objects glow on hover, and clicking a page object zooms the camera into it before navigating.
  - **Motion:** typing hands, the cat's tail, scrolling code, rain, lamp flicker, coffee steam, and PC LEDs and piano keys that light up while music plays.
  - **Day/night:** the room follows the visitor's clock (day from 7am to 7pm), and a light switch by the door flips it. Add `?time=day` or `?time=night` to the URL to force one.
  - **Shadows:** soft blob shadows sit under the furniture.
  - **Performance:** static boxes are merged into a few meshes, and rendering pauses while the room is off-screen.
- **Loading picture and fallback** (`components/room/RoomImage.jsx`): a
  snapshot of the 3D room (`public/assets/room-poster.png`, 74 KB) taken with
  the same camera. It shows instantly while three.js downloads (about 175 KB
  gzipped, loaded after the page is up), so the swap to 3D is seamless. It
  also stays in place without WebGL or if the 3D room crashes.

- **Sidebar with a 3D me** (`components/room/Avatar.jsx`, `3d/Avatar3D.jsx`):
  a Minecraft-style voxel version of me, textured like a real skin: curly
  hair, a big grin, the black blazer and white shirt from my photo, and headphones.
  - The head turns and the pupils follow your cursor anywhere on the page, and it blinks.
  - Clicking it makes me wave and say a tip.
  - Below it are my name, role and social links; the room itself is the navigation.
  - It reacts to each page: it waves hello with a page-specific line, types along while you fill in a form, and jumps for joy when your message sends.
  - The sidebar stays beside every page; only the right side changes. Off the home page I have a "Click me to go back home!" speech bubble, and clicking me goes back to the room. This replaced the old hotbar.
  - Without WebGL, it shows a pixelated version of my photo instead.
- **Work page** (`components/work/WorkCarousel.jsx`): a carousel through every
  project.
  - Each slide shows a big number, description, stack, and Live/GitHub links.
  - It shows the screenshot when one exists in `public/assets/work/` (checked at build time), otherwise a generated cover.
  - You can browse with the category filters, a numbered strip, prev/next buttons, ←/→ keys, and swiping on phones.
  - Every project has a shareable link (`/work?project=round1`); the address follows along as you browse, and a "Copy link" button copies it.

### Room map

| Object | Goes to / does |
|---|---|
| Triple monitors | `/work` |
| Bookshelf | `/resume` |
| Dresser books | `/resume` (skills) |
| Door | `/services` ("What I do") |
| Me at the desk | `/contact` ("Say hi") |
| Light switch by the door | Day / night |
| Keyboard on the stand by the window | Plays a favorite piece; keys light up (never autoplays) |
| Speaker on the desk | Background music: plays the playlist in order, round and round (the PC tower LEDs pulse along). It keeps playing across pages, with a now-playing line (skip/stop) in the sidebar. |
| Family photo above the monitors | Opens a photo carousel (←/→, swipe, Esc) |
| Cat on the window sill | Pet it |
| Little photo on the desk | Pops my photos out as pixel art |
| UTM pennant, trophy shelf, Abu Dhabi poster, Messi jersey, Bleach poster, UAE flag, backpack, bed, nightstand books, hoodie, beanbag, laundry basket, student ID, instant coffee, soccer ball, table-tennis paddle, PS4 | Easter-egg tooltips |

### Editing the room

- Every clickable object is one entry in `components/room/roomObjects.js`,
  with its label, link or tooltip, and an `anchor` (the 3D point where its
  label sits). The picture version places its hotspots on the same anchors.
- Geometry is in `components/room/3d/Scene.jsx`. `<B p={[x,y,z]} s={[w,h,d]} c="#hex" />`
  is a box placed by its corner. `<Obj id="...">` groups boxes into one
  clickable object whose `id` matches a `roomObjects.js` entry. The room is
  6 × 6 × 2.8 units, with the back corner at the origin: the left wall is
  x=0 and the right wall is z=0.
  - Boxes are merged automatically.
  - Anything that animates or changes between day and night needs `mref`, an emissive `e` colour, or a parent group with `userData={{ live: true }}`.
- **After changing the scene or the home layout, regenerate the snapshots:** run `npm run build && npm start`, then run `npm run poster` in a second terminal. It rewrites `public/assets/room-poster.png` (the loading picture) and `public/og.png` (the link-preview image). The script uses your installed Edge; set `CHROME_PATH` to use another Chrome-based browser.
- `test/room3d.test.mjs` checks that every label lands on screen, and that the plain-math projection matches the real camera.
- Content still lives in `data/portfolio.js` (transcribed from `public/assets/resume.pdf`).

- **Music and family photos:** list the speaker's songs in `PLAYLIST` and the album's photos in `FAMILY`, both in `components/room/roomObjects.js`. Put the files in `public/music/` and `public/assets/family/`.
- **Wall art** (family photo, Messi jersey, Bleach poster) is pixel art drawn in code in `components/room/3d/art.js` and hung with `<Pic>`.

Optional assets (the site degrades gracefully without them):
`public/sfx/keyboard-piece.mp3` (the piano) and the playlist mp3s.
