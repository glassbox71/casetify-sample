import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentStore = create(
  persist(
    (set) => ({
      recentItems: [],
      
      // 상품 추가 액션
      addRecentItem: (product) => set((state) => {
        // 1. 중복 제거
        const filtered = state.recentItems.filter((item) => item.id !== product.id);
        // 2. 맨 앞에 추가하고 최대 5개 유지
        const updated = [product, ...filtered].slice(0, 5);
        return { recentItems: updated };
      }),
      
      // 목록 전체 비우기 (필요시)
      clearRecent: () => set({ recentItems: [] }),
    }),
    {
      name: 'recent-products-storage', // 로컬 스토리지에 저장될 키 이름
    }
  )
);