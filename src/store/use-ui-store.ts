import { create } from "zustand";

type UIStore = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  deletingLinkId: string | null;
  setDeletingLinkId: (id: string | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  deletingLinkId: null,
  setDeletingLinkId: (id) => set({ deletingLinkId: id }),
}));
