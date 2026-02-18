import { useMemo } from "react";
import { useCardStore } from "../stores/cardStore";

export default function TagFilter() {
  const cards = useCardStore((s) => s.cards);
  const selectedTags = useCardStore((s) => s.selectedTags);
  const toggleTag = useCardStore((s) => s.toggleTag);

  const allTags = useMemo(() => {
    const tagCount = new Map<string, number>();
    for (const card of cards.values()) {
      for (const tag of card.tags) {
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(tagCount.entries()).sort((a, b) => b[1] - a[1]);
  }, [cards]);

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
      {allTags.map(([tag, count]) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            selectedTags.includes(tag)
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          {tag} ({count})
        </button>
      ))}
    </div>
  );
}
