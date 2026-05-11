import React, { useEffect, useState } from 'react'
import "./scss/WishList.scss"
import MypageTitle from './MypageTitle'
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { li } from 'framer-motion/client';
import EmptyState from './EmptyState';
import ConfirmModal from '../ConfirmModal';

export default function WishList() {
    const [wishItemList, setWishItemList] = useState([]);
    const { user, wishlist, onFetchWishlist, onRemoveWishlist } = useAuthStore();
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        if (!user) return;
        onFetchWishlist();
    }, [user]);

    // 1. 기본 설정
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // 한 페이지에 20개
    const pageGroupSize = 5; // 페이지 번호를 5개씩 보여줌 (예: 1~5, 6~10)

    // 2. 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

    // 3. 페이지 번호 그룹 계산
    const totalPages = Math.ceil(wishlist.length / itemsPerPage);
    const currentGroup = Math.ceil(currentPage / pageGroupSize); // 현재 몇 번째 그룹인지
    const startPage = (currentGroup - 1) * pageGroupSize + 1; // 그룹의 시작 번호
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages); // 그룹의 끝 번호

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className='wishlist-wrap'>
            <MypageTitle title={"위시리스트"} />
            <ul className="wish-list">
                {currentItems.length > 0 ? (
                    <>
                        {currentItems.map((item) => (
                            <li key={`${item.productId}-${item.deviceKey}-${item.color}`} className="wish-product-card">
                                <Link
                                    to={`/detail/${item.productId}`}
                                    state={{
                                        selectedModel: item.device,
                                        selectedColor: item.color
                                    }}
                                >
                                    <div className="card-img">
                                        <img src={`${item.imgUrl}`} alt={item.title} />
                                    </div>
                                    <div className="card-info">
                                        <p className="card-name">{item.title}</p>
                                        <p className="card-price">{Number(item.price || 0).toLocaleString()}원</p>
                                        <div className="card-option">
                                            {item.device || item.color ?
                                                <>
                                                    <p>[옵션]</p>
                                                    <p>{item.device && <span>{item.device}</span>}<span>{item.color}</span></p>
                                                </> : ""}
                                        </div>
                                    </div>
                                </Link>
                                <button onClick={() => setItemToDelete(item)} className='wish-heart'><img src="/images/icon/icon_favorite_fill.svg" alt="위시리스트 해제" /></button>
                            </li>
                        ))}
                    </>
                ) : (
                    <li>
                        <EmptyState icon="♡" strong="위시리스트" title="에 담긴 상품이 없습니다." desc="관심 있는 상품을 위시리스트에 추가해 보세요." btnText="상품 보러가기" btnLink="/case/device" />
                    </li>
                )}
            </ul>
            {wishlist.length > itemsPerPage && (
                <div className="pagination-wrap">
                    {/* 맨 앞으로 (<<) */}
                    <button onClick={() => paginate(1)} disabled={currentPage === 1}>«</button>

                    {/* 이전 그룹으로 (<) */}
                    <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>‹</button>

                    {/* 페이지 번호 (1, 2, 3, 4, 5...) */}
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={currentPage === pageNum ? 'active' : ''}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {/* 다음 그룹으로 (>) */}
                    <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>›</button>

                    {/* 맨 뒤로 (>>) */}
                    <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>»</button>
                </div>
            )}
            {itemToDelete && (
                <ConfirmModal
                    isOpen={!!itemToDelete}
                    message={"위시리스트에서 지워도 될까요?"}
                    onClose={() => setItemToDelete(null)}
                    buttons={[
                        { label: '취소', onClick: () => setItemToDelete(null), variant: 'secondary' },
                        { label: '확인', onClick: () => { onRemoveWishlist(itemToDelete); setItemToDelete(null); } },
                    ]}
                />
            )}
        </div>
    )
}