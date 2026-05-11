import React, { useEffect, useState } from "react";
import "./scss/BrandQna.scss";
import { useLocation } from 'react-router-dom'
import { FAQ_CATEGORIES, FAQ_LIST } from "../data/QnaData"; // ✅ 카테고리 + 리스트 모두 import
import { motion } from 'framer-motion';

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const INQUIRY_CATEGORIES = [
    "문의 분류를 선택해주세요",
    "주문 문의",
    "상품 문의",
    "배송 문의",
    "반품/교환 문의",
    "결제 문의",
    "프로모션/할인 코드 문의",
    "기프트 카드 문의",
    "개인정보 문의",
    "기타 문의",
];

export default function BrandQna() {
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState(location.state?.activeTab || "all");
    const [openFaqId, setOpenFaqId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { hash } = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // ✅ 페이지네이션 state 추가
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    useEffect(() => {
        if (hash === '#inquiry') {
            const el = document.getElementById('inquiry');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        if (hash === '#faq') {
            const el = document.getElementById('faq');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveCategory(location.state.activeTab);
        }
    }, [location.state]);

    // ✅ 카테고리/검색 바뀔 때 1페이지로 리셋
    useEffect(() => {
        setCurrentPage(1)
        setOpenFaqId(null)
    }, [activeCategory, searchKeyword])

    // 문의하기 폼 상태
    const [form, setForm] = useState({
        category: "",
        email: "",
        phone: "",
        message: "",
    });
    const [joinErr, setJoinErr] = useState("");
    const [joinAllErr, setJoinAllErr] = useState({
        category: "",
        email: "",
        phone: "",
        message: "",
    });
    const [touched, setTouched] = useState({
        category: false,
        email: false,
        phone: false,
        message: false
    });
    const [submitDone, setSubmitDone] = useState(false);

    const filteredFaqs = FAQ_LIST.filter((faq) => {
        const matchCate = activeCategory === "all" || faq.category === activeCategory;
        const matchSearch =
            !searchKeyword ||
            faq.question.includes(searchKeyword) ||
            faq.answer.includes(searchKeyword);
        return matchCate && matchSearch;
    });

    // ✅ 페이지네이션 계산
    const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE)
    const pagedFaqs = filteredFaqs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // 검증 결과 업데이트
        const error = validate(name, value);
        setJoinAllErr(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e) => {
        // 입력창에서 나가는 순간, 해당 필드를 '터치'한 것으로 간주
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleCustomSelectBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    // 실시간 검증 로직
    const validate = (name, value) => {
        let error = '';
        if (name === 'category') {
            if (!value || value.trim() === '') error = '문의 분류를 선택해주세요.';
        }
        if (name === 'email') {
            if (!value.includes('@') || !value || value.trim() === '') error = '이메일 형식이 올바르지 않습니다.';
        }
        if (name === 'phone') {
            const numberRegex = /^[0-9]+$/;
            if (!numberRegex.test(value) || value.includes('-')) error = '-없이 숫자만 입력해주세요.';
        }
        if (name === 'message') {
            if (!value || value.trim() === '') error = '필수 입력 항목입니다.';
        }
        return error;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 제출 시 최종 검증 (모든 필드에 대해)
        const newErrors = {};
        Object.keys(form).forEach(key => {
            newErrors[key] = validate(key, form[key]);
        });
        setJoinAllErr(newErrors);

        const allTouched = {
            category: true,
            email: true,
            phone: true,
            message: true
        };
        setTouched(allTouched);

        // 에러가 하나도 없는지 확인
        let isFormValid = Object.values(newErrors).every(err => err === '');

        if (!isFormValid) {
            setJoinErr("입력 오류가 있습니다.");
            return;
        }

        setSubmitDone(true);
    };

    return (
        <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <div className="brand-qna-page" id="faq">
                {/* 히어로 */}
                <section className="qna-hero">
                    <div className="qna-hero-text">
                        <p className="qna-hero-sub">CASETiFY SUPPORT</p>
                        <h2>Q&A</h2>
                        <div className="qna-hero-line" />
                        <p>궁금한 점이 있으신가요? 무엇이든 도와드릴게요</p>
                    </div>
                </section>
                {/* ─── FAQ 섹션 ─── */}
                <section className="faq-section">
                    <div className="faq-inner">
                        <h2 className="section-heading">자주 묻는 질문(FAQ)</h2>

                        {/* 카테고리 탭 */}
                        <div className="faq-tab-wrap">
                            {FAQ_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`faq-tab-btn ${activeCategory === cat.id ? "on" : ""}`}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setOpenFaqId(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* 검색창 */}
                        <div className="faq-search-wrap">
                            <input
                                type="text"
                                placeholder="검색어를 입력해주세요"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <button type="button" className="faq-search-btn" aria-label="검색">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </button>
                        </div>

                        {/* FAQ 아코디언 */}
                        <div className="faq-accordion">
                            {/* ✅ filteredFaqs → pagedFaqs 로 교체 */}
                            {pagedFaqs.length === 0 ? (
                                <p className="faq-empty">검색 결과가 없습니다.</p>
                            ) : (
                                pagedFaqs.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className={`faq-item ${openFaqId === faq.id ? "open" : ""}`}
                                    >
                                        <button
                                            type="button"
                                            className="faq-question"
                                            onClick={() => toggleFaq(faq.id)}
                                        >
                                            <span>{faq.question}</span>
                                            <svg
                                                className="faq-chevron"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>
                                        {openFaqId === faq.id && (
                                            <div className="faq-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* ✅ 페이지네이션 추가 */}
                        {totalPages > 1 && (
                            <div className="faq-pagination">
                                <button
                                    className="faq-page-btn"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    ‹
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`faq-page-btn ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="faq-page-btn"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    ›
                                </button>
                            </div>
                        )}

                    </div>
                </section>

                {/* ─── 문의하기 섹션 ─── */}
                <section className="inquiry-section" id="inquiry">
                    <div className="faq-inner">
                        <h2 className="section-heading">문의하기</h2>

                        {submitDone ? (
                            <div className="inquiry-done">
                                <p>문의가 접수되었습니다.<br />빠른 시일 내에 답변 드리겠습니다.</p>
                                <button
                                    type="button"
                                    className="inquiry-submit-btn"
                                    onClick={() => {
                                        setSubmitDone(false);
                                        setForm({ category: "", email: "", phone: "", message: "" });
                                    }}
                                >
                                    다시 문의하기
                                </button>
                            </div>
                        ) : (
                            <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
                                <div className="inquiry-row">
                                    <label className="inquiry-label">문의 분류</label>
                                    <div className="custom-select-container">
                                        <div className="selected-value" onClick={() => setIsOpen(!isOpen)}>
                                            {form.category || INQUIRY_CATEGORIES[0]}
                                        </div>

                                        {isOpen && (
                                            <ul className="custom-options">
                                                {INQUIRY_CATEGORIES.map((cat, idx) => (
                                                    <li
                                                        key={cat}
                                                        className="custom-option"
                                                        onClick={() => {
                                                            handleFormChange({ target: { name: 'category', value: idx === 0 ? "" : cat } });
                                                            handleCustomSelectBlur('category');
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {cat}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <p className='err-box'>{touched.category && joinAllErr.category}</p>
                                </div>

                                <div className="inquiry-row">
                                    <label className="inquiry-label">이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="casetify@castify.com"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        onBlur={handleBlur}
                                        className="inquiry-input"
                                    />
                                    <p className='err-box'>{touched.email && joinAllErr.email}</p>
                                </div>

                                <div className="inquiry-row">
                                    <label className="inquiry-label">휴대전화</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="-없이 입력"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        onBlur={handleBlur}
                                        className="inquiry-input"
                                    />
                                    <p className='err-box'>{touched.phone && joinAllErr.phone}</p>
                                </div>

                                <div className="inquiry-row inquiry-row--textarea">
                                    <label className="inquiry-label">문의 내용</label>
                                    <textarea
                                        name="message"
                                        placeholder="문의 내용을 입력해주세요."
                                        value={form.message}
                                        onChange={handleFormChange}
                                        onBlur={handleBlur}
                                        className="inquiry-textarea"
                                        rows={8}
                                    />
                                    <p className='err-box'>{touched.message && joinAllErr.message}</p>
                                </div>

                                <div className="inquiry-submit-wrap">
                                    <p>{joinErr}</p>
                                    <button type="submit" className="inquiry-submit-btn">
                                        문의 제출하기
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </motion.div>
    );
}