import { useWindowSize } from "./useWindowSize";
import { Masonry } from "masonic";
import { useCardFilter } from "../hooks/useCardFilter";
import CardItem from "./CardItem";
import EmptyState from "./EmptyState";
import type { CardMeta } from "../types/card";
import { useCardStore } from "../stores/cardStore";

export default function CardGrid() {
  const filteredCards = useCardFilter();
  const isScanning = useCardStore((s) => s.isScanning);
  const currentDir = useCardStore((s) => s.currentDir);
  const selectedTags = useCardStore((s) => s.selectedTags);

  if (!currentDir) {
    return <EmptyState message="点击「打开文件夹」选择一个包含 .md 文件的目录" />;
  }

  if (filteredCards.length === 0 && !isScanning) {
    return <EmptyState message="没有找到匹配的卡片" />;
  }

  return (
    <div className="p-4">
      <MasonryGrid items={filteredCards} dirKey={currentDir} tagsKey={selectedTags.join(",")} />
    </div>
  );
}

function MasonryGrid({ items, dirKey, tagsKey }: { items: CardMeta[]; dirKey: string; tagsKey: string }) {
  const { width } = useWindowSize();
  const columnWidth = 280;
  const columnGutter = 16;
  const overscanBy = 5;

  return (
    <Masonry
      items={items}
      columnGutter={columnGutter}
      columnWidth={columnWidth}
      overscanBy={overscanBy}
      render={CardItem}
      key={`${dirKey}-${tagsKey}-${width}`}
    />
  );
}
