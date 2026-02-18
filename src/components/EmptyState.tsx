export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="text-6xl mb-4 opacity-30">📂</div>
        <p className="text-slate-400 text-lg">{message}</p>
      </div>
    </div>
  );
}
