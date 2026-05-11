import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';

/**
 * SearchNavigator
 * - DOM을 렌더링하지 않는 유틸 컴포넌트
 * - pendingSearch 감지 → /search?q=검색어 이동 + 검색창 닫기
 */
export default function SearchNavigator() {
    const navigate = useNavigate();
    const { pendingSearch, onClearPendingSearch, onCloseSearch } = useProductStore();

    useEffect(() => {
        if (!pendingSearch) return;

        navigate(`/search?q=${encodeURIComponent(pendingSearch)}`);
        onCloseSearch();       // 검색창 닫기
        onClearPendingSearch(); // 트리거 초기화
    }, [pendingSearch]);

    return null;
}