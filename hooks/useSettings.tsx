import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

type SettingsStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useSettings = create<SettingsStore>()(
  subscribeWithSelector((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }))
);

// Optimized selectors for specific use cases
export const useSettingsIsOpen = () => useSettings((state) => state.isOpen);
export const useSettingsActions = () => useSettings(
  (state) => ({
    onOpen: state.onOpen,
    onClose: state.onClose,
  }),
  shallow
);
