export type EdgeNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
  type?: "lessonPlan" | "teacherNote" | "peer";
  meta?: {
    from?: string;
    learnerId?: string;
  };
};

const STORAGE_KEY = "edgeai_notifications_v1";

export function loadNotifications(): EdgeNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EdgeNotification[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveNotifications(list: EdgeNotification[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore – best-effort persistence in this demo
  }
}

export function appendNotification(notification: EdgeNotification) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadNotifications();
    const updated = [notification, ...existing];
    saveNotifications(updated);
  } catch {
    // ignore
  }
}

