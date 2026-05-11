import { useState } from "react";
import { create } from "zustand";

// 메인배너따라 헤더글자색변경
export const useMainSlider = create((set, get) => ({

    //기본값
    headerColor: "white",

    setHeaderColor: (color) => set({ headerColor: color })


}))

