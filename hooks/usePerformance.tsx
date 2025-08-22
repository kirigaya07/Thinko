import { useEffect, useState } from "react";

interface PerformanceMetrics {
  fontLoadTime: number | null;
  imageLoadTime: number | null;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fontLoadTime: null,
    imageLoadTime: null,
    firstContentfulPaint: null,
    largestContentfulPaint: null,
  });

  useEffect(() => {
    // Monitor font loading performance
    const monitorFonts = () => {
      if ("fonts" in document) {
        document.fonts.ready.then(() => {
          const fontLoadTime = performance.now();
          setMetrics((prev) => ({ ...prev, fontLoadTime }));
        });
      }
    };

    // Monitor Core Web Vitals
    const monitorWebVitals = () => {
      // First Contentful Paint
      if ("PerformanceObserver" in window) {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find(
            (entry) => entry.name === "first-contentful-paint",
          );
          if (fcp) {
            setMetrics((prev) => ({
              ...prev,
              firstContentfulPaint: fcp.startTime,
            }));
          }
        });

        try {
          fcpObserver.observe({ entryTypes: ["paint"] });
        } catch (e) {
          console.warn("FCP observer failed:", e);
        }

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          if (lcp) {
            setMetrics((prev) => ({
              ...prev,
              largestContentfulPaint: lcp.startTime,
            }));
          }
        });

        try {
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        } catch (e) {
          console.warn("LCP observer failed:", e);
        }
      }
    };

    // Monitor image loading performance
    const monitorImages = () => {
      const images = document.querySelectorAll("img");
      let totalLoadTime = 0;
      let loadedImages = 0;

      images.forEach((img) => {
        if (img.complete) {
          loadedImages++;
        } else {
          const startTime = performance.now();
          img.addEventListener("load", () => {
            const loadTime = performance.now() - startTime;
            totalLoadTime += loadTime;
            loadedImages++;

            if (loadedImages === images.length) {
              const avgLoadTime = totalLoadTime / loadedImages;
              setMetrics((prev) => ({ ...prev, imageLoadTime: avgLoadTime }));
            }
          });
        }
      });

      // If all images are already loaded
      if (loadedImages === images.length && images.length > 0) {
        setMetrics((prev) => ({ ...prev, imageLoadTime: 0 }));
      }
    };

    // Initialize monitoring
    monitorFonts();
    monitorWebVitals();

    // Monitor images after a short delay to ensure DOM is ready
    const imageTimer = setTimeout(monitorImages, 100);

    return () => {
      clearTimeout(imageTimer);
    };
  }, []);

  // Get performance score based on metrics
  const getPerformanceScore = (): number => {
    let score = 100;

    if (metrics.fontLoadTime && metrics.fontLoadTime > 1000) score -= 20;
    if (metrics.imageLoadTime && metrics.imageLoadTime > 2000) score -= 20;
    if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 1800)
      score -= 20;
    if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500)
      score -= 20;

    return Math.max(0, score);
  };

  // Check if performance is good
  const isPerformanceGood = (): boolean => {
    return getPerformanceScore() >= 80;
  };

  return {
    metrics,
    getPerformanceScore,
    isPerformanceGood,
  };
};
