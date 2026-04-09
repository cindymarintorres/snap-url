import { create } from "zustand";

type LinkItem = {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  isActive: boolean;
  createdAt: Date;
  _count: { clicks: number };
};

type LinksStore = {
  links: LinkItem[];
  setLinks: (links: LinkItem[]) => void;
  addLink: (link: LinkItem) => void;
  removeLink: (id: string) => void;
  toggleLink: (id: string) => void;
};

export const useLinksStore = create<LinksStore>((set) => ({
  links: [],
  setLinks: (links) => set({ links }),
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  removeLink: (id) =>
    set((state) => ({ links: state.links.filter((l) => l.id !== id) })),
  toggleLink: (id) =>
    set((state) => ({
      links: state.links.map((l) =>
        l.id === id ? { ...l, isActive: !l.isActive } : l,
      ),
    })),
}));
