import create from "zustand";

interface ToolState {
  history: string[];
  addHistory: (item: string) => void;
  clearHistory: () => void;
}

export const useToolStore = create<ToolState>((set) => ({
  history: [],
  addHistory: (item) =>
    set((state) => ({
      history: [...state.history, item].slice(-10),
    })),
  clearHistory: () => set({ history: [] }),
}));
