"use client";

import { useEffect } from "react";

type ViewTrackerProps = {
  dishId: string;
  storageKey: string;
  tableId?: string | null;
};

export function ViewTracker({ dishId, storageKey, tableId }: ViewTrackerProps) {
  useEffect(() => {
    const dedupeKey = `dish-view:${storageKey}`;

    if (typeof window === "undefined" || window.sessionStorage.getItem(dedupeKey)) {
      return;
    }

    window.sessionStorage.setItem(dedupeKey, "1");

    void fetch("/api/analytics/dish-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ dishId, tableId: tableId ?? null }),
      keepalive: true
    }).catch(() => {
      window.sessionStorage.removeItem(dedupeKey);
    });
  }, [dishId, storageKey, tableId]);

  return null;
}
