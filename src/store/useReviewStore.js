import { create } from "zustand";

export const useReviewStore = create((set, get) => ({
    reviews: {},

    addReview: (productId, review) => {
        set((state) => ({
            reviews: {
                ...state.reviews,
                [productId]: [review, ...(state.reviews[productId] || [])],
            },
        }));
    },

    deleteReview: (productId, targetReview) => {
        set((state) => ({
            reviews: {
                ...state.reviews,
                [productId]: (state.reviews[productId] || []).filter(
                    (r) => r !== targetReview
                ),
            },
        }));
    },

    initReviews: (productId, initialReviews) => {
        set((state) => {
            if (state.reviews[productId]?.length > 0) return state;
            return {
                reviews: {
                    ...state.reviews,
                    [productId]: initialReviews,
                },
            };
        });
    },
}));