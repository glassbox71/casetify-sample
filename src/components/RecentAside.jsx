import React, { useState } from 'react';
import { useRecentStore } from '../store/useRecentStore';
import "./scss/RecentAside.scss"
import { Link } from 'react-router-dom';


export default function RecentAside() {
    const [isOpen, setIsOpen] = useState(false);
    const { recentItems } = useRecentStore();

    return (
        <aside className="recent-aside">
        {/* 모달 창 */}
        {isOpen && (
            <div className="recent-modal">
            <div className='recent-modal-header'>
                <h3>최근 본 상품</h3>
                <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <div className="item-list">
                {recentItems.length > 0 ? (
                recentItems.map((product) => (
                    <Link key={product.id} to={`/detail/${product.id}`}>
                        <div className="product-item">
                            <img src={product.imgUrl} alt={product.productName} />
                            <div className="info">
                                <span className="name">{product.productName}</span>
                                <span className="price">{Number(product.price).toLocaleString()}원</span>
                            </div>
                        </div>
                    </Link>
                ))
                ) : (
                <p className="empty-msg">최근 본 상품이 없습니다.</p>
                )}
            </div>
            </div>
        )}

        {/* 플로팅 버튼 */}
        <button className="floating-btn" onClick={() => setIsOpen(!isOpen)}>
            <span className="count">{recentItems.length}</span>
            <span>RECENT</span>
        </button>
        </aside>
    );
}
