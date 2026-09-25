import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import {
  FaJava, FaPython, FaReact, FaNodeJs, FaAws, FaDocker, FaGitAlt, FaLinux,
} from "react-icons/fa";
import {
  SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiFirebase, SiVercel,
  SiMongodb, SiFlask, SiSpring, SiJenkins, SiPandas, SiScikitlearn,
  SiGooglecloud, SiOpencv, SiPostgresql, SiMysql, SiRailway, SiC,
} from "react-icons/si";

const SOCIAL = { github: FaGithub, linkedin: FaLinkedin, email: FaEnvelope };

const TECH = {
  "Java": FaJava, "Python": FaPython, "React": FaReact, "Next.js": SiNextdotjs,
  "Node.js": FaNodeJs, "TailwindCSS": SiTailwindcss, "JavaScript": SiJavascript,
  "TypeScript": SiTypescript, "Firebase": SiFirebase, "Vercel": SiVercel,
  "MongoDB": SiMongodb, "Flask": SiFlask, "Spring Boot": SiSpring, "Jenkins": SiJenkins,
  "Pandas": SiPandas, "Sci-Kit Learn": SiScikitlearn, "AWS": FaAws, "AWS EC2": FaAws,
  "Docker": FaDocker, "Git": FaGitAlt, "Linux": FaLinux, "GCP": SiGooglecloud,
  "OpenCV": SiOpencv, "C": SiC,
};

export function socialIcon(key) {
  return SOCIAL[key] ?? null;
}

export function techIcon(name) {
  return TECH[name] ?? null;
}
