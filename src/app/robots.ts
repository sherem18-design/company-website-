import { MetadataRoute } from "next";

const BASE = "https://еспасатель.рф";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/lite"] },
      { userAgent: "Yandex", allow: "/", disallow: ["/lite"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
