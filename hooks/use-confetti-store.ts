import { create } from "zustand";

type ConfittiStore = {
    isOpen: Boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useConfettiStore = create<ConfittiStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))