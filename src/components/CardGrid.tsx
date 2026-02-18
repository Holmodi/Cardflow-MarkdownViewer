import { useCardFilter } from "../hooks/useCardFilter";
import CardItem from "./CardItem";
import EmptyState from "./EmptyState";
import { useCardStore } from "../stores/cardStore";

export default function CardGrid() {
  const filteredCards = useCardFilter();
  const isScanning = useCardStore((s) => s.isScanning);
  const currentDir = useCardStore((s) => s.currentDir);
  const selectedTags = useCardStore((s) => s.selectedTags);
  const searchQuery = useCardStore((s) => s.searchQuery);
  const cards = useCardStore((s) => s.cards);

  if (!currentDir) {
    return <EmptyState message="点击「打开文件夹」选择一个包含 .md 文件的目录" />;
  }

  const hasFilter = searchQuery.trim().length > 0 || selectedTags.length > 0;

  if (filteredCards.length === 0 && !isScanning) {
    if (hasFilter) {
      return <EmptyState message="没有找到匹配的卡片" />;
    }
    if (cards.size === 0) {
      return <EmptyState message="该目录下没有 .md 文件" />;
    }
  }

  return (
    <div className="p-4 columns-[280px] gap-4">
      {filteredCards.map((card) => (
        <div key={card.path} className="break-inside-avoid mb-4" style={{ contentVisibility: "auto" }}>
          <CardItem data={card} />
        </div>
      ))}
    </div>
  );
}
