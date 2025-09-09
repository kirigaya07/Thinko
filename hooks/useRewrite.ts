"use client";

import { useState, useCallback } from "react";

type RewriteOptions = {
  tone?: string;
  length?: string;
};

export const useRewrite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewrite = useCallback(
    async (content: unknown, options: RewriteOptions = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, ...options }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Rewrite failed (${res.status})`);
        }
        const data = (await res.json()) as { content: unknown };
        return data.content;
      } catch (e: any) {
        setError(e?.message || "Rewrite failed");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { rewrite, isLoading, error };
};
