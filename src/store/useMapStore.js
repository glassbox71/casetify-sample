import { create } from "zustand";
import { studioPosData } from "../data/studioPosData";

export const useMapStore = create((set) => ({
    locations: studioPosData,

    selectedLocation: null,

    setSelectedLocation: (loc) => {
        set({ selectedLocation: loc });
    },

    clearSelectedLocation: () => {
        set({ selectedLocation: null });
    }
}));