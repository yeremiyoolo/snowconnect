import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://snowconnect.com"; // Tu dominio real

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/catalogo`, lastModified: new Date() },
    { url: `${baseUrl}/servicios`, lastModified: new Date() },
    { url: `${baseUrl}/auth/login`, lastModified: new Date() },
    { url: `${baseUrl}/privacidad`, lastModified: new Date() },
    // Aquí podrías agregar dinámicamente tus productos desde la base de datos
  ];
}