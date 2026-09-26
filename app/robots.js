import { SITE } from "@/data/portfolio";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SITE}/sitemap.xml` };
}
