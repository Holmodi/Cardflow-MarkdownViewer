import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useCardStore } from "../stores/cardStore";
import { readFile, writeFile, deleteFile } from "../lib/tauri";

export default function CardDetail() {
  const selectedCard = useCardStore((s) => s.selectedCard);
  const cards = useCardStore((s) => s.cards);
  const setSelectedCard = useCardStore((s) => s.setSelectedCard);
  const removeCard = useCardStore((s) => s.removeCard);

  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  const card = selectedCard ? cards.get(selectedCard) : null;

  useEffect(() => {
    if (!selectedCard) return;
    setLoading(true);
    setEditing(false);
    readFile(selectedCard)
      .then((text) => {
        setContent(text);
        setEditContent(text);
      })
      .finally(() => setLoading(false));
  }, [selectedCard]);

  const handleSave = useCallback(async () => {
    if (!selectedCard) return;
    await writeFile(selectedCard, editContent);
    setContent(editContent);
    setEditing(false);
  }, [selectedCard, editContent]);

  const handleDelete = useCallback(async () => {
    if (!selectedCard || !confirm("确定删除这张卡片？")) return;
    await deleteFile(selectedCard);
    removeCard(selectedCard);
    setSelectedCard(null);
  }, [selectedCard, removeCard, setSelectedCard]);

  if (!selectedCard || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedCard(null)} />
      <div className="relative ml-auto w-full max-w-2xl bg-slate-800 border-l border-slate-700 h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 shrink-0">
          <h2 className="text-lg font-semibold text-slate-100 truncate">{card.title}</h2>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm cursor-pointer">保存</button>
                <button onClick={() => { setEditing(false); setEditContent(content); }} className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm cursor-pointer">取消</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm cursor-pointer">编辑</button>
            )}
            <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm cursor-pointer">删除</button>
            <button onClick={() => setSelectedCard(null)} className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm cursor-pointer">关闭</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <p className="text-slate-400">加载中...</p>
          ) : editing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-full min-h-[60vh] bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
