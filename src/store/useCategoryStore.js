import { create } from "zustand";

const initialFilters = {
    colors: [],
    caseCategories: [],
    freeShipping: false,
    devices: [],
};

export const useCategoryStore = create((set, get) => ({
    baseItems: [],
    displayItems: [],
    currentMiniCategory: null,

    isFilterOpen: false,
    isDeviceOpen: false,
    selectedBrand: "Apple",
    selectedSort: "recommend",

    selectedFilters: initialFilters,

    colorOptions: [],
    caseCategoryOptions: [],
    brandDeviceOptions: {
        Apple: [],
        Samsung: [],
        Google: [],
    },

    setBaseItems: (items, currentMiniCategory = null) => {
        set({
            baseItems: items,
            displayItems: items,
            currentMiniCategory,
            selectedFilters: {
                colors: [],
                caseCategories: [],
                freeShipping: false,
                devices: [],
            },
            selectedBrand: "Apple",
            selectedSort: "recommend",
        });

        get().buildOptions(items);
        get().applyFilters();
    },

    buildOptions: (items) => {
        const colorSet = new Set();
        const caseCategorySet = new Set();

        const brandMap = {
            Apple: new Set(),
            Samsung: new Set(),
            Google: new Set(),
        };

        items.forEach((item) => {
            const colors = Array.isArray(item.caseColors) ? item.caseColors : [];
            colors.forEach((color) => {
                if (color) colorSet.add(color);
            });

            if (item.caseCategory) {
                caseCategorySet.add(item.caseCategory);
            }

            if (
                item.productTarget === "phone" &&
                item.brand &&
                item.modelLabel &&
                brandMap[item.brand]
            ) {
                brandMap[item.brand].add(item.modelLabel);
            }
        });

        set({
            colorOptions: [...colorSet],
            caseCategoryOptions: [...caseCategorySet],
            brandDeviceOptions: {
                Apple: [...brandMap.Apple],
                Samsung: [...brandMap.Samsung],
                Google: [...brandMap.Google],
            },
        });
    },

    openFilterPanel: () => {
        set({
            isFilterOpen: true,
            isDeviceOpen: false,
        });
    },

    openDevicePanel: () => {
        set({
            isDeviceOpen: true,
            isFilterOpen: false,
        });
    },

    closePanels: () => {
        set({
            isFilterOpen: false,
            isDeviceOpen: false,
        });
    },

    setSelectedBrand: (brand) => {
        set({ selectedBrand: brand });
    },

    setSelectedSort: (sort) => {
        set({ selectedSort: sort });
        get().applyFilters();
    },

    toggleColor: (color) => {
        const prev = get().selectedFilters.colors;
        const next = prev.includes(color)
            ? prev.filter((v) => v !== color)
            : [...prev, color];

        set((state) => ({
            selectedFilters: {
                ...state.selectedFilters,
                colors: next,
            },
        }));

        get().applyFilters();
    },

    toggleCaseCategory: (category) => {
        const prev = get().selectedFilters.caseCategories;
        const next = prev.includes(category)
            ? prev.filter((v) => v !== category)
            : [...prev, category];

        set((state) => ({
            selectedFilters: {
                ...state.selectedFilters,
                caseCategories: next,
            },
        }));

        get().applyFilters();
    },

    toggleDevice: (device) => {
        const prev = get().selectedFilters.devices;
        const next = prev.includes(device)
            ? prev.filter((v) => v !== device)
            : [...prev, device];

        set((state) => ({
            selectedFilters: {
                ...state.selectedFilters,
                devices: next,
            },
        }));

        get().applyFilters();
    },

    setFreeShipping: (checked) => {
        set((state) => ({
            selectedFilters: {
                ...state.selectedFilters,
                freeShipping: checked,
            },
        }));

        get().applyFilters();
    },

    removeFilter: (type, value) => {
        const current = get().selectedFilters;

        if (type === "color") {
            set({
                selectedFilters: {
                    ...current,
                    colors: current.colors.filter((v) => v !== value),
                },
            });
        }

        if (type === "caseCategory") {
            set({
                selectedFilters: {
                    ...current,
                    caseCategories: current.caseCategories.filter((v) => v !== value),
                },
            });
        }

        if (type === "device") {
            set({
                selectedFilters: {
                    ...current,
                    devices: current.devices.filter((v) => v !== value),
                },
            });
        }

        if (type === "freeShipping") {
            set({
                selectedFilters: {
                    ...current,
                    freeShipping: false,
                },
            });
        }

        get().applyFilters();
    },

    clearAllFilters: () => {
        set((state) => ({
            selectedFilters: {
                colors: [],
                caseCategories: [],
                freeShipping: false,
                devices: [],
            },
            displayItems: state.baseItems,
            selectedBrand: "Apple",
            selectedSort: "recommend",
        }));

        get().applyFilters();
    },

    applyFilters: () => {
        const { baseItems, selectedFilters, selectedSort } = get();

        let filtered = baseItems.filter((item) => {
            if (
                selectedFilters.colors.length > 0 &&
                !selectedFilters.colors.some((color) =>
                    (Array.isArray(item.caseColors) ? item.caseColors : []).includes(color)
                )
            ) {
                return false;
            }

            if (
                selectedFilters.caseCategories.length > 0 &&
                !selectedFilters.caseCategories.includes(item.caseCategory)
            ) {
                return false;
            }

            if (
                selectedFilters.freeShipping &&
                !(item.badge || []).includes("무료 배송")
            ) {
                return false;
            }

            if (
                selectedFilters.devices.length > 0 &&
                !selectedFilters.devices.includes(item.modelLabel)
            ) {
                return false;
            }

            return true;
        });

        filtered = [...filtered].sort((a, b) => {
            if (selectedSort === "recommend") {
                return (a.recommendRank ?? 9999) - (b.recommendRank ?? 9999);
            }

            if (selectedSort === "popular") {
                return Number(b.popularity || 0) - Number(a.popularity || 0);
            }

            if (selectedSort === "priceLow") {
                return Number(a.price || 0) - Number(b.price || 0);
            }

            if (selectedSort === "priceHigh") {
                return Number(b.price || 0) - Number(a.price || 0);
            }

            return 0;
        });

        set({ displayItems: filtered });
    },
}));