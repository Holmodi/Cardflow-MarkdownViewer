import { useState, useCallback, useRef, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import TagFilter from "./components/TagFilter";
import CardGrid from "./components/CardGrid";
import CardDetail from "./components/CardDetail";
import SettingsPanel from "./components/SettingsPanel";
import { FloatingTool } from "./components/FloatingTool";
import { useTauriEvents } from "./hooks/useTauriEvents";
import { useCardStore } from "./stores/cardStore";
import { createFile } from "./lib/tauri";

function generateTimestampFilename(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mmVal = String(now.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}.${dd}-${HH}${mmVal}`;
}

export default function App() {
  useTauriEvents();

  const currentDir = useCardStore((s) => s.currentDir);
  const selectedCard = useCardStore((s) => s.selectedCard);
  const addCards = useCardStore((s) => s.addCards);
  const setSelectedCard = useCardStore((s) => s.setSelectedCard);
  const loadLastDir = useCardStore((s) => s.loadLastDir);
  const [showSettings, setShowSettings] = useState(false);
  const hasInitialScan = useRef(false);

  const handleCreate = useCallback(async () => {
    if (!currentDir) return;
    const filename = generateTimestampFilename();
    const card = await createFile(currentDir, filename);
    addCards([card]);
  }, [currentDir, addCards]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleBackdropClick = useCallback(() => {
    setSelectedCard(null);
  }, [setSelectedCard]);

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSettings]);

  // 启动时自动加载上次文件夹
  useEffect(() => {
    if (!hasInitialScan.current) {
      hasInitialScan.current = true;
      loadLastDir();
    }
  }, [loadLastDir]);

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden relative">
      {/* 遮罩层 */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={handleBackdropClick}
        />
      )}

      {/* 刷新按钮和设置按钮 - 右上角 */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="p-2 bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 rounded-xl transition-all duration-200 cursor-pointer"
          title="刷新视图"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl transition-all duration-200 cursor-pointer
            ${showSettings
              ? "bg-primary-600 text-white"
              : "bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600"
          }`}
          title="显示设置"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <Toolbar />
      <TagFilter />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 overflow-y-auto min-w-0">
          <CardGrid />
        </div>
        <CardDetail />
      </div>

      {/* 新建卡片悬浮工具 */}
      {currentDir && (
        <FloatingTool>
          <button
            onClick={handleCreate}
            className="px-4 py-2.5 bg-slate-800/95 backdrop-blur-md border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-xl text-sm cursor-pointer transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            + 新建卡片
          </button>
        </FloatingTool>
      )}

      {/* 设置面板 - 放在顶层 */}
      {showSettings && (
        <div ref={settingsRef} className="absolute right-4 top-14 z-[70]">
          <SettingsPanel />
        </div>
      )}
    </div>
  );
}
