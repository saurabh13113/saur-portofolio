import { SITE } from "@/data/portfolio";

export default function sitemap() {
  return ["", "/projects", "/resume", "/services", "/contact"].map((path) => ({ url: `${SITE}${path}`, lastModified: new Date() }));
}
