"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { File, Wand2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/useSearch";
import { useRewrite } from "@/hooks/useRewrite";
import { api } from "@/convex/_generated/api";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const update = useMutation(api.documents.update);
  const { rewrite, isLoading } = useRewrite();
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = useCallback(
    (id: string) => {
      router.push(`/documents/${id}`);
      onClose();
    },
    [router, onClose],
  );

  const onRewrite = useCallback(
    async (id: string, content: string) => {
      if (!content || isLoading) return;

      try {
        const promise = (async () => {
          const rewritten = await rewrite(content, {});
          await update({
            id: id as any,
            content: JSON.stringify(rewritten, null, 2),
          });
        })();
        toast.promise(promise, {
          loading: "Rewriting note...",
          success: "Note rewritten",
          error: (e) => e?.message || "Failed to rewrite",
        });
        await promise;
      } catch {}
    },
    [rewrite, update, isLoading],
  );

  // Memoize the search placeholder text
  const searchPlaceholder = useMemo(() => {
    return `Search ${user?.fullName}'s Thinko..`;
  }, [user?.fullName]);

  // Memoize the documents mapping to prevent unnecessary re-renders
  const documentItems = useMemo(() => {
    return documents?.map((document) => (
      <CommandItem
        key={document._id}
        value={document._id}
        title={document.title}
        onSelect={onSelect}
      >
        {document.icon ? (
          <p className="mr-2 text-[1.125rem]">{document.icon}</p>
        ) : (
          <File className="mr-2 h-4 w-4" />
        )}
        <span>{document.title}</span>
        {document.content && (
          <div className="ml-auto flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRewrite(document._id, document.content || "");
              }}
              disabled={isLoading}
              className="rounded p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            >
              <Wand2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </CommandItem>
    ));
  }, [documents, onSelect, onRewrite, isLoading]);

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="AI Actions">
          <CommandItem
            onSelect={() => {
              // This would open a modal or prompt for AI features
              toast.info("AI features available in document toolbar");
              onClose();
            }}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            <span>AI Rewrite</span>
            <kbd className="ml-auto">Available in documents</kbd>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documents">{documentItems}</CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
