// Single source of truth for all portfolio content.
// Content transcribed from public/assets/resume.pdf — keep role titles,
// employers, locations and date ranges verbatim.

export const profile = {
  name: "Saurabh Nair",
  role: "Software Developer",
  // shown under my name in the sidebar: the 10-second version for recruiters
  pitch: "CS + Econ @ UofT | TA @ UofT | ex-Bayer | ex-Lead Organizer @ DeerHacks",
  status: "Open to new-grad SWE roles (2027)",
  highlights: "",
  tagline:
    "CS & Economics double major at the University of Toronto. From Abu Dhabi 🇦🇪, building in Toronto.",
  location: "Toronto, ON",
  website: "saurabhnair.com",
  email: "saurabhnair13113@gmail.com",
  phone: "+1 647-831-6703",
  resumePdf: "/assets/resume.pdf",
  socials: [
    { key: "github", href: "https://github.com/saurabh13113" },
    { key: "linkedin", href: "https://www.linkedin.com/in/saurabh-nair" },
    { key: "email", href: "mailto:saurabhnair13113@gmail.com" },
  ],
};

// canonical address of the live site
export const SITE = `https://${profile.website}`;

export const stats = [
  { label: "Internships", value: 4, max: 5, suffix: "" },
  { label: "CGPA", value: 3.73, max: 4, suffix: "" },
  { label: "Dean's List years", value: 4, max: 4, suffix: "" },
  { label: "Shipped projects", value: 19, max: 20, suffix: "+" },
];

export const CATEGORIES = ["All", "Full-stack", "Backend", "ML", "Frontend"];

// Featured projects (featured: true) get the big carousel on /projects; the rest
// are listed under "More projects". Optional context shown on each slide:
// year, context (Hackathon / Course / Personal / Team project), role, outcome.
export const projects = [
  {
    slug: "feynomenon",
    title: "Feynomenon — AI-Powered Learning Tutor",
    category: "Full-stack",
    featured: true,
    year: "2025",
    context: "TMU Solution Hacks",
    outcome: "🏆 Winner, TMU Solution Hacks '25",
    blurb:
      "Adaptive AI tutor built on the Feynman technique. Winner, TMU Solution Hacks '25.",
    description:
      "Adaptive AI tutoring platform that applies the Feynman technique, using the Gemini API for dynamic response generation. Fully responsive Next.js + TailwindCSS frontend with Firebase authentication and MongoDB-backed session analytics. Deployed on Vercel and Railway. Winner at TMU Solution Hacks '25.",
    stack: ["Next.js", "TailwindCSS", "Node.js", "MongoDB", "Firebase", "Gemini"],
    image: "/assets/work/feynomenon.png",
    links: { live: "https://feynomenon-chatbot.vercel.app/", github: "https://github.com/saurabh13113/feynomenon-chatbot" },
  },
  {
    slug: "round1",
    title: "Round1 — Multimodal AI Interviewer",
    category: "Full-stack",
    featured: true,
    year: "2025",
    context: "TMU TRSM Hackathon",
    blurb:
      "Job-role-aware interview simulator with a transparent LLM rubric and behavioral metrics.",
    description:
      "Interview simulator that conducts job-role-aware questioning and applies a transparent LLM rubric for real-time scoring, combining natural-language understanding with behavioral metrics extracted via MediaPipe. Includes a recruiter dashboard with interactive charts, transcripts, pass/fail thresholds and engagement flags, backed by Firebase Hosting and Storage.",
    stack: ["Next.js", "TailwindCSS", "Firebase", "MediaPipe", "Gemini", "RoboFlow"],
    image: "/assets/work/round1.png",
    links: { live: "https://round1-two.vercel.app/", github: "https://github.com/Big-ShahMir/Round1" },
  },

  // --- Archive: existing GitHub repos (real screenshots under /assets/work) ---
  { slug: "ml-stock-price-predictor", title: "ML Stock Price Predictor", category: "ML", featured: false,
    blurb: "SciKit-Learn + pandas model over S&P 500 data to predict next-day prices.",
    description: "Summer project using SciKit-Learn and pandas to analyze S&P 500 data and predict tomorrow's stock prices.",
    stack: ["Python", "Sci-Kit Learn", "Jupyter", "Pandas"], image: "/assets/work/Pic9.png",
    links: { live: "https://github.com/saurabh13113/ml-stock-price-predictor", github: "https://github.com/saurabh13113/ml-stock-price-predictor" } },
  { slug: "flashgenie", title: "FlashGenie AI Flashcards", category: "Full-stack", featured: true, year: "2024", context: "Headstarter Fellowship",
    blurb: "AI flashcard generator with Stripe billing and Clerk auth.",
    description: "Headstarter Fellowship project to learn how a web app with many moving parts fits together: an AI flashcard generator on Meta Llama, with a premium pricing model (Stripe), user authentication (Clerk) and other APIs.",
    stack: ["React", "Next.js", "Material UI", "Llama AI", "Stripe", "Clerk"], image: "/assets/work/Pic15.png",
    links: { live: "https://flashcard-saas-mu-liart.vercel.app/", github: "https://github.com/saurabh13113/flashcard-saas/tree/main" } },
  { slug: "ml-premier-league-predictor", title: "ML Premier League Predictor", category: "ML", featured: true, year: "2024", context: "Headstarter Fellowship",
    blurb: "Predicts Premier League match results from web-scraped season data.",
    description: "Headstarter Fellowship project to learn web scraping and building ML models: SciKit-Learn and pandas over scraped Premier League data to predict match results across a season.",
    stack: ["Python", "Sci-Kit Learn", "Jupyter", "Pandas"], image: "/assets/work/Pic12.png",
    links: { live: "https://github.com/saurabh13113/ml-premier-league-predictor", github: "https://github.com/saurabh13113/ml-premier-league-predictor" } },
  { slug: "webscraper-premier-league", title: "Premier League Web Scraper", category: "Backend", featured: false,
    blurb: "BeautifulSoup + pandas scraper for multi-season Premier League data.",
    description: "Summer project using BeautifulSoup and pandas to scrape Premier League data across recent seasons.",
    stack: ["Python", "Beautiful Soup", "Jupyter", "Pandas"], image: "/assets/work/Pic13.png",
    links: { live: "https://github.com/saurabh13113/webscraper-premier-league", github: "https://github.com/saurabh13113/webscraper-premier-league" } },
  { slug: "math-chatbot", title: "Math Chat Bot (Llama AI)", category: "Full-stack", featured: false, year: "2023", context: "Headstarter Fellowship",
    blurb: "AI chatbot that helps students work through math problems.",
    description: "Headstarter Fellowship project to learn LLM APIs: an AI chatbot on Meta Llama that helps students practice and work through math problems. Built with Next.js, React and deployed on AWS EC2 / Vercel.",
    stack: ["React", "Next.js", "Material UI", "Llama AI", "AWS EC2"], image: "/assets/work/Pic14.png",
    links: { live: "https://math-chatbot-eta.vercel.app/", github: "https://github.com/saurabh13113/math-chatbot/tree/main" } },
  { slug: "uaemetro-ticketer", title: "UAE Metro Ticketer", category: "Full-stack", featured: false,
    blurb: "Desktop app to purchase UAE metro tickets.",
    description: "High-school project allowing customers to purchase UAE metro tickets via a Tkinter desktop UI.",
    stack: ["Python", "TKinter"], image: "/assets/work/Pic10.png",
    links: { live: "https://github.com/saurabh13113/uaemetro-ticketer", github: "https://github.com/saurabh13113/uaemetro-ticketer" } },
  { slug: "pantry-tracker", title: "Pantry Tracker", category: "Full-stack", featured: false, year: "2023", context: "Headstarter Fellowship",
    blurb: "Pantry management app with Next.js, Material UI and Firebase.",
    description: "Headstarter Fellowship project to learn Firebase and databases: a pantry management application built with Next.js, Material UI and Firebase.",
    stack: ["React", "Next.js", "Material UI", "Firebase"], image: "/assets/work/Pic11.png",
    links: { live: "https://pantry-app-lac.vercel.app/", github: "https://github.com/saurabh13113/pantry-app" } },
  { slug: "huffman-compressor", title: "Huffman Tree File Compressor", category: "Backend", featured: false,
    blurb: "File compression/decompression via Huffman trees.",
    description: "University project that compresses and decompresses files using Huffman trees.",
    stack: ["Python"], image: "/assets/work/Pic2.png",
    links: { live: "https://github.com/saurabh13113/huffman-compressor-tree-", github: "https://github.com/saurabh13113/huffman-compressor-tree-" } },
  { slug: "hua-rong-dao-solver", title: "Hua Rong Dao Puzzle Solver", category: "Backend", featured: false,
    blurb: "Solves the Hua Rong Dao sliding puzzle via state-space search.",
    description: "University project that solves the Hua Rong Dao puzzle using state-space search.",
    stack: ["Python"], image: "/assets/work/Pic16.png",
    links: { live: "https://github.com/saurabh13113/Hua-Rong-Dao-Solver", github: "https://github.com/saurabh13113/Hua-Rong-Dao-Solver" } },
  { slug: "checkers-solver", title: "Checkers Endgame Solver", category: "Backend", featured: false,
    blurb: "Solves checkers endgames with game-tree search.",
    description: "University project that solves checkers endgames using game-tree search.",
    stack: ["Python"], image: "/assets/work/Pic17.png",
    links: { live: "https://github.com/saurabh13113/checkers-solver", github: "https://github.com/saurabh13113/checkers-solver" } },
  { slug: "battleship-solitaire-solver", title: "Battleship Solitaire Solver", category: "Backend", featured: false,
    blurb: "Constraint-satisfaction + GAC solver for Battleship Solitaire.",
    description: "University project that solves Battleship Solitaire endgames using constraint satisfaction and generalized arc consistency.",
    stack: ["Python"], image: "/assets/work/Pic18.png",
    links: { live: "https://github.com/saurabh13113/battleship-solitaire-solver", github: "https://github.com/saurabh13113/battleship-solitaire-solver" } },
  { slug: "naive-bayes-salary", title: "Naive Bayes Salary Predictor", category: "ML", featured: false,
    blurb: "Predicts salaries with a hand-built Naive Bayes model.",
    description: "University project that predicts salaries by building a Naive Bayes classifier.",
    stack: ["Python"], image: "/assets/work/Pic19.png",
    links: { live: "https://github.com/saurabh13113/Naive-Bayes_Model", github: "https://github.com/saurabh13113/Naive-Bayes_Model" } },
  { slug: "mobile-companytracker", title: "Mobile System Tracker", category: "Backend", featured: false,
    blurb: "Tracks a mobile carrier and its customers, with a visualizer.",
    description: "University assignment to track a mobile company and its customers, including a PyGame visualizer.",
    stack: ["Python", "PyGame"], image: "/assets/work/pic1.png",
    links: { live: "https://github.com/saurabh13113/mobile-companytracker", github: "https://github.com/saurabh13113/mobile-companytracker" } },
  { slug: "treemap-file-organizer", title: "TreeMap File Organizer", category: "Full-stack", featured: false,
    blurb: "Organizes files/folders with a treemap visualizer.",
    description: "University project using file-system trees and treemaps to organize files and folders through a visualizer.",
    stack: ["Python", "PyGame"], image: "/assets/work/Pic4.png",
    links: { live: "https://github.com/saurabh13113/treemap-file-organizer-tree-", github: "https://github.com/saurabh13113/treemap-file-organizer-tree-" } },
  { slug: "uber-driver-rider-pairer", title: "Driver / Rider Pairer", category: "Backend", featured: false,
    blurb: "Matches drivers and riders on locational data.",
    description: "University project that matches drivers and riders based on locational information.",
    stack: ["Python"], image: "/assets/work/Pic8.png",
    links: { live: "https://github.com/saurabh13113/uber-driver-rider-pairer", github: "https://github.com/saurabh13113/uber-driver-rider-pairer" } },
  { slug: "mindsnatcher-game", title: "MindSnatcher (team game)", category: "Full-stack", featured: true, context: "University, team of 4",
    blurb: "3-month Agile team build of a JavaFX game.",
    description: "University assignment building a game over three months in Java and JavaFX, in a team of four following Agile practices.",
    stack: ["Java", "JavaFx", "PlayHT"], image: "/assets/work/Pic3.png",
    links: { live: "https://github.com/saurabh13113/mindsnatcher-game", github: "https://github.com/saurabh13113/mindsnatcher-game" } },
  { slug: "add-echo", title: "Add Echo (audio DSP)", category: "Backend", featured: false,
    blurb: "Removes vocals and adds echo to WAV files by decoding bit data.",
    description: "University project that removes vocals and adds an echo effect to a WAV file by decoding its bit-level audio data.",
    stack: ["C"], image: "/assets/work/Pic7.png",
    links: { live: "https://github.com/saurabh13113/add-echo", github: "https://github.com/saurabh13113/add-echo" } },
  { slug: "tsh-mini-shell", title: "tsh Mini Shell", category: "Backend", featured: true, context: "University",
    blurb: "A replica Unix shell / command prompt in C.",
    description: "University project implementing a replica mini shell / command prompt in C.",
    stack: ["C"], image: "/assets/work/Pic6.png",
    links: { live: "https://github.com/saurabh13113/tsh-mini-shell", github: "https://github.com/saurabh13113/tsh-mini-shell" } },
  { slug: "multiplayer-server-game", title: "Multiplayer Server Game", category: "Backend", featured: false,
    blurb: "Local server battle game hosted on the UofT servers.",
    description: "University project that stands up a local server on the UofT machines and lets users join and play a simple battle game.",
    stack: ["C"], image: "/assets/work/Pic5.png",
    links: { live: "https://github.com/saurabh13113/multiplayer-server-game", github: "https://github.com/saurabh13113/multiplayer-server-game" } },
];

export const experience = [
  {
    role: "Software Developer Intern",
    org: "BAYER Canada",
    location: "Toronto, ON",
    start: "May 2025",
    end: "August 2026",
    bullets: [
      "Owned end-to-end delivery of the DRL Redesign on the Radimetrics dose-management platform, shipping exam-level alert filtering — +28% alert-filtering accuracy.",
      "Built an automated OS patch pipeline with Jenkins and AWS, replacing a manual release process with repeatable ISO packaging — −35% release-prep time.",
      "Led dependency upgrades across RHEL and Alma Linux for the 3.8 release, coordinating testing across multiple VMs — −20% post-release defects.",
    ],
  },
  {
    role: "Software Engineering Intern",
    org: "Kaytoons Inc.",
    location: "San Jose, CA",
    start: "September 2024",
    end: "May 2025",
    bullets: [
      "Built, deployed and remotely maintained backend systems for a children's educational mobile app; proactive monitoring and refactoring kept it stable through investor demos.",
      "Integrated a PlayHT-powered voice-cloning feature in Python for dynamic character dialogue — +18% average session duration.",
    ],
  },
  {
    role: "Teaching Assistant",
    org: "University of Toronto",
    location: "Mississauga, ON",
    start: "September 2024",
    end: "Present",
    bullets: [
      "TA'd CSC236 (Theory of Computation), ECO225 (Data Tools for Economics) and CSC263 (Data Structures & Algorithms).",
      "Graded assignments, quizzes and exams and held office hours for 150+ students, lifting engagement and course-satisfaction scores.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Emirates Steel Arkan",
    location: "Abu Dhabi, UAE",
    start: "June 2024",
    end: "August 2024",
    bullets: [
      "Built and deployed predictive-maintenance models on time-series sensor data — −15% unplanned downtime, saving hundreds of production hours a year.",
      "Engineered a real-time consumption dashboard giving plant managers actionable insight — an estimated $1.2M annual reduction in raw-material costs.",
      "Feature engineering and hyperparameter tuning improved model precision by 12% across multiple production lines.",
    ],
  },
];

export const education = [
  {
    school: "University of Toronto",
    credential: "B.Sc Computer Science & B.A Economics (Double Major)",
    detail: "CGPA 3.73",
    start: "2022",
    end: "Expected June 2027",
    honors: [
      "Dean's List Scholar — 2022, 2023, 2024, 2025",
      "University of Toronto Scholar Award — 2022",
    ],
  },
];

// Two honest tiers instead of made-up percentages: proficient = used in a job or
// a shipped project and comfortable being quizzed on; familiar = have used, would ramp up.
export const skills = [
  { group: "Languages",
    proficient: ["Python", "Java", "JavaScript / TypeScript", "SQL (PostgreSQL / MySQL)", "C", "HTML / CSS"],
    familiar: ["R", "Stata", "Bash / Shell"] },
  { group: "Frameworks",
    proficient: ["React", "Next.js", "Node.js", "Spring Boot", "Flask", "TailwindCSS"],
    familiar: ["Hibernate / JPA", "Material-UI"] },
  { group: "Tools",
    proficient: ["Git", "Docker", "Jenkins", "AWS", "Linux", "Firebase", "Vercel", "Postman"],
    familiar: ["GCP", "Railway", "Maven", "JupyterHub"] },
  { group: "Libraries",
    proficient: ["Pandas", "SciKit-Learn"],
    familiar: ["OpenCV", "MediaPipe", "RoboFlow"] },
];

// "What I do" (/services): each card backed by something I actually shipped.
export const services = [
  { num: "01", title: "Full-Stack Web Apps", description: "Next.js / React / Node.js apps with auth, a database and a deploy pipeline — end to end.",
    proof: { text: "Feynomenon: AI tutor, winner at TMU Solution Hacks '25", href: "/projects?project=feynomenon" } },
  { num: "02", title: "Backend & APIs", description: "Spring Boot or Flask services: REST APIs, data modeling, integrations and monitoring.",
    proof: { text: "Kaytoons: backend + voice-cloning feature, +18% session time", href: "/resume" } },
  { num: "03", title: "ML & Data", description: "Predictive models, feature engineering and dashboards that turn raw data into decisions.",
    proof: { text: "Emirates Steel: −15% unplanned downtime, ~$1.2M/yr in savings", href: "/resume" } },
  { num: "04", title: "DevOps & Cloud Automation", description: "Jenkins / Docker / AWS / GCP pipelines that make releases repeatable instead of manual.",
    proof: { text: "Bayer: Jenkins + AWS patch pipeline, −35% release-prep time", href: "/resume" } },
];

export function filterProjects(list, cat) {
  return cat === "All" ? list.slice() : list.filter((p) => p.category === cat);
}
