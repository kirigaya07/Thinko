"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

import { Item, ItemSkeleton } from "./Item";

import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentList = React.memo(
  ({ parentDocumentId, level = 0 }: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = useCallback((documentId: string) => {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [documentId]: !prevExpanded[documentId],
      }));
    }, []);

    const documents = useQuery(api.documents.getSidebar, {
      parentDocument: parentDocumentId,
    });

    const onRedirect = useCallback(
      (documentId: string) => {
        router.push(`/documents/${documentId}`);
      },
      [router],
    );

    // Memoize the expanded state check
    const hasExpandedItems = useMemo(() => {
      return Object.values(expanded).some(Boolean);
    }, [expanded]);

    // Memoize the level-based padding style
    const levelPaddingStyle = useMemo(() => {
      return level ? { paddingLeft: `${level * 12 + 25}px` } : undefined;
    }, [level]);

    if (documents === undefined) {
      return (
        <>
          <ItemSkeleton level={level} />
          {level === 0 && (
            <>
              <ItemSkeleton level={level} />
              <ItemSkeleton level={level} />
            </>
          )}
        </>
      );
    }

    return (
      <>
        <p
          style={levelPaddingStyle}
          className={cn(
            "hidden text-sm font-medium text-muted-foreground/80",
            hasExpandedItems && "last:block",
            level === 0 && "hidden",
          )}
        >
          No pages inside
        </p>
        {documents?.map((document) => (
          <div key={document._id}>
            <Item
              id={document._id}
              onClick={() => onRedirect(document._id)}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon}
              active={params.documentId === document._id}
              level={level}
              onExpand={() => onExpand(document._id)}
              expanded={expanded[document._id]}
            />
            {expanded[document._id] && (
              <DocumentList parentDocumentId={document._id} level={level + 1} />
            )}
          </div>
        ))}
      </>
    );
  },
);

DocumentList.displayName = "DocumentList";

export { DocumentList };
