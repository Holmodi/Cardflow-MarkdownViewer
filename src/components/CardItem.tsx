import type { CardMeta } from "../types/card";
import { useCardStore } from "../stores/cardStore";

interface Props {
  data: CardMeta;
}

export default function CardItem({ data }: Props) {
  const setSelectedCard = useCardStore((s) => s.setSelectedCard);

  return (
    <div
      onClick={() => setSelectedCard(data.path)}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:bg-slate-750 transition-colors"
    >
      <h3 className="text-sm font-semibold text-slate-100 mb-2 line-clamp-2">
        {data.title}
      </h3>

      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed">
        {data.preview || "（空内容）"}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{data.created ?? ""}</span>
        <span>{(data.size / 1024).toFixed(1)} KB</span>
      </div>
    </div>
  );
}
