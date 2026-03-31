import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/admin/", "/checkout/"], // Protegemos áreas privadas
    },
    sitemap: "https://snowconnect.com/sitemap.xml", // Cambia por tu dominio real
  };
}