import React, { useEffect, useState } from 'react'
import "./scss/SearchOverlay.scss";
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import ImageSearchModal from './ImageSearchModal';
import BundleRecommend from './sub/product detail page/Recommend';

// 추천상품용
const tempRecoItem = { id: "CTF-34942803-16006188" }

export default function SearchOverlay({ isActive, onClose }) {
    const { searchWord, onSetSearchWord, searchWordList, onAddSearchList, onRemoveSearchList, onRemoveAllSearch, onSearchByKeyword, onCloseSearch } = useProductStore();

    useEffect(() => {
        if (searchWordList.length === 0) { setSearchCheck(false) } else { setSearchCheck(true) }
    })

    // 검색 실행 함수 — onAddSearchList로 pendingSearch 설정, SearchNavigator가 navigate 처리
    const goSearch = (keyword) => {
        const kw = keyword.trim();
        if (!kw) return;
        onAddSearchList(kw);
        onSetSearchWord("");
        // navigate는 SearchNavigator가 pendingSearch를 감지해서 처리
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        goSearch(searchWord);
    }
    const [searchCheck, setSearchCheck] = useState(false);
    const [modalCheck, setModalCheck] = useState(false);

    return (
        <div className={`search-overlay-wrap ${isActive ? "active" : ""}`}>
            <div className="search-content-outer-wrap">
                <h1 className="logo">
                    <Link to="/"><img src="/images/casetify-logo-15th.png" alt="casetify" /></Link>
                </h1>
                <div className="search-center-wrap">
                    <div className="search-content-inner-wrap">
                        <form className="search-bar" onSubmit={handleSubmit}>
                            <label>
                                <input type="text" placeholder="궁금한 내용의 단어나 키워드로 검색하세요"
                                    value={searchWord}
                                    onChange={(e) => onSetSearchWord(e.target.value)}
                                />
                            </label>
                            <button type="submit" className="btn-search">
                                <img src="/images/icon/search_var.svg" alt="검색" />
                            </button>
                            {searchWord.length > 0 && (
                                <button className="btn-reset" onClick={() => onSetSearchWord("")}>
                                    <img src="/images/icon/btn_reset.svg" alt="검색초기화" />
                                </button>
                            )}
                        </form>
                        <div className="recent-search-wrap">
                            <div className="inner-title">최근 검색어</div>
                            {searchCheck ?
                                (<div className="recent-result-wrap">
                                    <button className="remove-all" onClick={onRemoveAllSearch}>모두 지우기</button>
                                    <ul className="recent-result-list">
                                        {searchWordList.map((s) => (
                                            <li key={s.id} style={{ cursor: "pointer" }} onClick={() => goSearch(s.text)}>{s.text} <button onClick={(e) => { e.stopPropagation(); onRemoveSearchList(s.id); }}> ×</button></li>
                                        ))}
                                    </ul>
                                </div>
                                )
                                : (<p className="txt-recent">최근 검색어가 없습니다.</p>)}
                        </div>
                        <div className="pop-search-wrap">
                            <div className="inner-title">인기 검색어</div>
                            <ol className="pop-search-list">
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("클리어 케이스")}>클리어 케이스</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("아이폰 17 Pro")}>아이폰 17 Pro</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("아이폰 17")}>아이폰 17</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("메탈 참 큐브")}>메탈 참 큐브</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("임팩트 케이스")}>임팩트 케이스</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("바운스 케이스")}>바운스 케이스</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("YOUNG FOREST")}>YOUNG FOREST</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("Cherry Blossom")}>Cherry Blossom</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("글레이즈 케이스")}>글레이즈 케이스</li>
                                <li style={{ cursor: "pointer" }} onClick={() => goSearch("Skater JOHN")}>Skater JOHN</li>
                            </ol>
                        </div>
                        <div className="recommend-wrap">
                            <BundleRecommend item={tempRecoItem} />
                        </div>
                    </div>
                    <div className="search-content-extra-wrap">
                        <div className="img-search" onClick={() => setModalCheck(true)} >
                            <img src="/images/icon/icon-img-search-camera.svg" alt="이미지검색_카메라아이콘" />
                            <span>이미지 검색</span>
                        </div>
                    </div>
                </div>
            </div>
            <ImageSearchModal modalCheck={modalCheck} setModalCheck={setModalCheck} />
            {/* 검색 닫기 */}
            <p className="close-btn" onClick={onClose}><img src="/images/icon/close.svg" alt="검색닫기" /></p>
        </div>
    )
}