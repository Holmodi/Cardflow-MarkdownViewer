import { useState, useRef, useCallback, useEffect } from "react";

interface FloatingToolProps {
  defaultPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  offset?: number;
  children: React.ReactNode;
}

export function FloatingTool({ defaultPosition = "bottom-right", offset = 20, children }: FloatingToolProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offsetPoint, setOffsetPoint] = useState({ x: 0, y: 0 });
  const toolRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化位置
  useEffect(() => {
    if (isInitialized) return;

    const updatePosition = () => {
      const x = defaultPosition.includes("right")
        ? window.innerWidth - (toolRef.current?.offsetWidth || 200) - offset
        : offset;
      const y = defaultPosition.includes("bottom")
        ? window.innerHeight - (toolRef.current?.offsetHeight || 100) - offset
        : offset;
      setPosition({ x, y });
      setIsInitialized(true);
    };

    updatePosition();
    // 延迟一下确保 DOM 已渲染
    const timer = setTimeout(updatePosition, 50);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      clearTimeout(timer);
    };
  }, [defaultPosition, offset, isInitialized]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && (e.target.closest("button") || e.target.closest("input"))) return;
    setIsDragging(true);
    setOffsetPoint({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - offsetPoint.x;
    const newY = e.clientY - offsetPoint.y;
    setPosition({ x: newX, y: newY });
  }, [isDragging, offsetPoint]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full shadow-lg cursor-pointer transition-all hover:scale-110"
        title="显示工具栏"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={toolRef}
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      {children}

      {/* 关闭按钮 */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
        title="收起"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
