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

The home page is a single isometric, voxel/pixel-art bedroom at night, with a
lofi-girl mood. The camera looks down from the top of the near corner, and I'm
coding at a triple-monitor desk in the far corner. Everything clickable in the
room leads to part of the portfolio. There's no game engine and no 3D runtime:
it's one optimized image (`public/assets/room.png`, served as WebP/AVIF by
`next/image`) with invisible, accessible hotspots and a few CSS effects on top.

### Room map

| Object in the render | Goes to / does |
|---|---|
| Triple monitors | `/work` |
| Bookshelf | `/resume` |
| Dresser books (Algorithms, Data Structures...) | `/resume` (skills) |
| Door | `/services` |
| Me at the desk | `/contact` ("Say hi") |
| UTM pennant, trophy shelf, poster, backpack, bed, nightstand books, hoodie, beanbag, laundry basket, student ID | Easter-egg tooltips |
| Cat on the window sill | Pet it |
| Little photo on the desk | Pops my photos out as pixel art |
| Desk keyboard / PC tower | Play a favorite piece / a song on loop (never autoplays) |

Live effects are pure CSS in `app/globals.css` (`.room-*`): rain on the window,
the monitors' glow pulsing, and the lamps flickering.

### Editing the room

- Hotspot positions are `[left, top, width, height]` percentages of the
  square image, in `components/room/Room.jsx`. If the art is regenerated,
  re-measure them. Hover outlines show where each hotspot sits.
- Content still lives in `data/portfolio.js` (transcribed from
  `public/assets/resume.pdf`). Blocky UI primitives are in `components/mc/`.

Optional assets (the site degrades gracefully without them): `public/fonts/Monocraft.ttf`,
`public/sfx/{click,break,orb}.mp3`, `public/sfx/{keyboard-piece,speaker-loop}.mp3`.
