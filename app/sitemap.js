import { SITE } from "@/data/portfolio";

export default function sitemap() {
  return ["", "/work", "/resume", "/services", "/contact"].map((path) => ({ url: `${SITE}${path}`, lastModified: new Date() }));
}
