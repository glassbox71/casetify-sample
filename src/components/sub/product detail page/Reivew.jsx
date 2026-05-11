import React, { useState, useMemo, useEffect } from "react";
import "./scss/review.scss";
import { useAuthStore } from "../../../store/useAuthStore";
import { useReviewStore } from "../../../store/useReviewStore";

const maskEmail = (email) => {
    if (!email) return "익명";
    const [id] = email.split("@");
    const visible = id.slice(0, 3);
    return `${visible}***...`;
};

const generateInitialReviews = (popularity) => {
    if (!popularity) return [];
    const base = Math.floor(popularity);
    const pool = [
        { user: "cky***...", uid: "mock1", rating: Math.min(base + 1, 5), content: "기대 이상이에요! 퀄리티가 정말 좋아요.", date: "2026-01-05" },
        { user: "fel***...", uid: "mock2", rating: base, content: "배송도 빠르고 상품도 만족스러워요.", date: "2026-01-04" },
        { user: "kar***...", uid: "mock3", rating: Math.max(base - 1, 1), content: "사진이랑 실물이 비슷해요. 무난합니다.", date: "2026-01-03" },
        { user: "win***...", uid: "mock4", rating: base, content: "재구매 의사 있습니다. 추천해요!", date: "2026-01-02" },
        { user: "jig***...", uid: "mock5", rating: Math.min(base + 1, 5), content: "선물용으로 구매했는데 너무 좋아요.", date: "2026-01-01" },
        { user: "lia***...", uid: "mock6", rating: base, content: "가성비 최고입니다!", date: "2026-01-06" },
        { user: "min***...", uid: "mock7", rating: Math.max(base - 1, 1), content: "생각보다 작긴 한데 품질은 좋아요.", date: "2026-01-07" },
        { user: "sol***...", uid: "mock8", rating: Math.min(base + 1, 5), content: "색감이 정말 예뻐요. 만족합니다.", date: "2026-01-08" },
    ];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
};

export default function Review({ popularity, productId }) {
    const user = useAuthStore((state) => state.user);

    // ✅ 중복 제거, 한번만 선언
    const { addReview, deleteReview, initReviews } = useReviewStore();
const reviewMap = useReviewStore((state) => state.reviews);
const reviews = reviewMap[productId] || [];

    const [input, setInput] = useState("");
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");

    useEffect(() => {
        if (!productId || !popularity) return;
        initReviews(productId, generateInitialReviews(popularity));
    }, [productId, popularity]);

    const total = reviews.length;
    const avg = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const rounded = Math.round(avg * 2) / 2;
    const displayScore = popularity ?? rounded;

    const distribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        return { star, count, percent: total ? (count / total) * 100 : 0 };
    });

    const filtered = useMemo(() => {
        return reviews.filter((r) =>
            r.content.toLowerCase().includes(search.toLowerCase())
        );
    }, [reviews, search]);

    const sortedReviews = [...filtered].sort((a, b) => {
        if (sort === "latest") return new Date(b.date) - new Date(a.date);
        if (sort === "best") return b.rating - a.rating;
        return 0;
    });

    const handleAddReview = () => {
        if (!user || !input.trim()) return;
        addReview(productId, {
            uid: user.uid,
            user: maskEmail(user.email),
            rating,
            content: input,
            date: new Date().toISOString().slice(0, 10),
        });
        setInput("");
        setRating(5);
    };

const handleDeleteReview = (targetReview) => {
    if (!user || targetReview.uid !== user?.uid) return; //
    deleteReview(productId, targetReview);
};

    return (
        <div className="review">
            <h3>고객 리뷰</h3>

            <div className="review-star">
                <div className="left">
                    <div className="score">
                        {/* ✅ popularity 점수 연동 */}
                        <p className="num">{displayScore.toFixed(1)}</p>
                        <div className="stars">
                            {"★".repeat(Math.floor(displayScore))}
                            {displayScore % 1 !== 0 && "☆"}
                            {"☆".repeat(5 - Math.ceil(displayScore))}
                        </div>
                    </div>

                    <div className="score-list-wrap">
                        <p>별점별 분포도</p>
                        <ul className="score-list">
                            {distribution.map((d) => (
                                <li key={d.star}>
                                    <p>{d.star}별점</p>
                                    <div className="gauge-bar">
                                        <span style={{ width: `${d.percent}%` }} />
                                    </div>
                                    <p>({d.count})</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="right">
                    {!user ? (
                        <div className="login-prompt">
                            <p>로그인 후 작성 가능합니다</p>
                            <div className="star-select disabled">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <span key={n}>★</span>
                                ))}
                            </div>
                            <div className="text-box disabled">
                                <textarea
                                    disabled
                                    placeholder="로그인 후 리뷰를 작성할 수 있습니다."
                                />
                                <button disabled>리뷰 등록</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p>
                                <strong>{maskEmail(user.email)}</strong>님, 별점과 리뷰를 작성하세요
                            </p>

                            <div className="star-select">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <span
                                        key={n}
                                        onClick={() => setRating(n)}
                                        onMouseEnter={() => setHover(n)}
                                        onMouseLeave={() => setHover(0)}
                                        className={n <= (hover || rating) ? "active" : ""}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <div className="text-box">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="리뷰를 입력해주세요."
                                />
                                <button onClick={handleAddReview}>리뷰 등록</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="star-list">
                <div className="star-bar">
                    <div
                        className={`btn ${sort === "best" ? "active" : ""}`}
                        onClick={() => setSort("best")}
                    >
                        베스트순
                    </div>
                    <div
                        className={`btn ${sort === "latest" ? "active" : ""}`}
                        onClick={() => setSort("latest")}
                    >
                        최신순
                    </div>
                    <input
                        type="text"
                        placeholder="리뷰 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <ul className="star detail">
                    {sortedReviews.map((r, i) => (
                        <li key={i}>
                            <div className="user info">
                                <p className="user">{r.user}</p>
                                <div className="star-core">
                                    {"★".repeat(r.rating)}
                                    {"☆".repeat(5 - r.rating)}
                                </div>
                                <p className="date">{r.date}</p>
                                {user && r.uid === user.uid && (
                                    <button onClick={() => handleDeleteReview(r)}>삭제</button>
                                )}
                            </div>
                            <div className="user-review">{r.content}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}