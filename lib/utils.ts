import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Image optimization utilities
export const imageConfig = {
  // Default image quality
  quality: 85,

  // Responsive breakpoints for image sizes
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  // Generate responsive sizes string for Next.js Image
  getResponsiveSizes: (maxWidth: number = 1200) => {
    return `(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, ${maxWidth}px`;
  },

  // Generate blur placeholder data URL
  getBlurDataURL: () => {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
  },

  // Optimize image loading with intersection observer
  createImageObserver: (
    callback: (entry: IntersectionObserverEntry) => void,
  ) => {
    if (typeof IntersectionObserver === "undefined") {
      return null;
    }

    return new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      },
    );
  },
};

// Font optimization utilities
export const fontConfig = {
  // Font display strategies
  display: {
    swap: "swap",
    fallback: "fallback",
    optional: "optional",
  },

  // Font loading strategies
  loading: {
    eager: "eager",
    lazy: "lazy",
  },

  // Generate font preload link
  generatePreloadLink: (fontPath: string, type: string = "font/woff2") => {
    return {
      rel: "preload",
      href: fontPath,
      as: "font",
      type,
      crossOrigin: "anonymous",
    };
  },
};
