import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Hotbar from "@/components/mc/Hotbar";
import PageTransition from "@/components/PageTransition";
import BreakOverlay from "@/components/mc/BreakOverlay";
import KonamiUnlock from "@/components/room/easter-eggs/KonamiUnlock";
import ConsoleEasterEgg from "@/components/room/easter-eggs/ConsoleEasterEgg";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

export const metadata = {
  title: "Saurabh Nair — Software Developer",
  description:
    "Minecraft-themed portfolio of Saurabh Nair, software developer and CS + Economics student at the University of Toronto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} pb-28`}>
        <BreakOverlay />
        <PageTransition>{children}</PageTransition>
        <Hotbar />
        <KonamiUnlock />
        <ConsoleEasterEgg />
      </body>
    </html>
  );
}
