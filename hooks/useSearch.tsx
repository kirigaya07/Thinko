import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

type SearchStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

export const useSearch = create<SearchStore>()(
  subscribeWithSelector((set, get) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  })),
);

// Optimized selectors for specific use cases
export const useSearchIsOpen = () => useSearch((state) => state.isOpen);
export const useSearchActions = () =>
  useSearch(
    (state) => ({
      onOpen: state.onOpen,
      onClose: state.onClose,
      toggle: state.toggle,
    }),
    shallow,
  );
