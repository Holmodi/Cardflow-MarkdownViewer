import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useCardStore } from "../stores/cardStore";
import type { ScanBatch, ScanComplete, FileEvent } from "../types/card";

export function useTauriEvents() {
  const addCards = useCardStore((s) => s.addCards);
  const updateCard = useCardStore((s) => s.updateCard);
  const removeCard = useCardStore((s) => s.removeCard);
  const setIsScanning = useCardStore((s) => s.setIsScanning);

  useEffect(() => {
    const unlisten: Array<() => void> = [];

    async function setup() {
      console.log("[useTauriEvents] Setting up event listeners");

      unlisten.push(
        await listen<ScanBatch>("scan-batch", (event) => {
          console.log("[scan-batch] Received:", event.payload);
          addCards(event.payload.cards);
        })
      );

      unlisten.push(
        await listen<ScanComplete>("scan-complete", (event) => {
          console.log("[scan-complete] Received:", event.payload);
          setIsScanning(false);
        })
      );

      unlisten.push(
        await listen<FileEvent>("fs-event", (event) => {
          const { kind, path, card } = event.payload;
          if (kind === "Deleted") {
            removeCard(path);
          } else if (card) {
            if (kind === "Created") {
              addCards([card]);
            } else {
              updateCard(card);
            }
          }
        })
      );
    }

    setup();

    return () => {
      unlisten.forEach((fn) => fn());
    };
  }, [addCards, updateCard, removeCard, setIsScanning]);
}
