"use client";
import { useEffect } from "react";
import { profile } from "@/data/portfolio";

export default function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      `%cHey, nice of you to check the console.\nWant to build something together? ${profile.email}`,
      "color:#2ecc71;font-family:monospace;font-size:14px;"
    );
  }, []);

  return null;
}
