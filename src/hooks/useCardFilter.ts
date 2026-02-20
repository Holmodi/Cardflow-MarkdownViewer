import { useMemo } from "react";
import { useCardStore } from "../stores/cardStore";
import type { CardMeta } from "../types/card";

export function useCardFilter(): CardMeta[] {
  const cards = useCardStore((s) => s.cards);
  const searchQuery = useCardStore((s) => s.searchQuery);
  const selectedTags = useCardStore((s) => s.selectedTags);
  const sortBy = useCardStore((s) => s.sortBy);

  return useMemo(() => {
    let result = Array.from(cards.values());

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.preview.toLowerCase().includes(q)
      );
    }

    // Filter by tags (AND logic)
    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.every((tag) => c.tags.includes(tag))
      );
    }

    // Sort - parse sortBy to extract field and order
    const [field, order] = sortBy.split("_") as [string, string];
    const isAsc = order === "asc";

    result.sort((a, b) => {
      let cmp = 0;
      switch (field) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "created":
          cmp = (a.created ?? "").localeCompare(b.created ?? "");
          break;
        case "updated":
          cmp = (a.updated ?? "").localeCompare(b.updated ?? "");
          break;
        case "size":
          cmp = a.size - b.size;
          break;
      }
      return isAsc ? cmp : -cmp;
    });

    return result;
  }, [cards, searchQuery, selectedTags, sortBy]);
}
