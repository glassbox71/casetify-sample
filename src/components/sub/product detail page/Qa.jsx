import React, { useState } from "react";
import "./scss/qa.scss";
import { useAuthStore } from "../../../store/useAuthStore";
import ToastPopup from "../../Toastpopup";

const DATA = [
    {
        id: 1,
        type: "product",
        title: "상품하자 관련",
        question: "상품하자 관련 문의드립니다.",
        author: "cky0****......",
        answer: "네 고객님 확인 후 조치하겠습니다.",
        date: "2026.04.10",
        answered: true,
    },
    {
        id: 2,
        type: "shipping",
        title: "배송관련 문의",
        question: "상품 언제오나요?",
        author: "cky0****......",
        answer: "빠르게 배송해드리겠습니다.",
        date: "2026.04.10",
        answered: true,
    },
    {
        id: 3,
        type: "product",
        title: "튼튼한가요?",
        question: "튼튼한가요?",
        author: "abc1****......",
        answer: "",
        date: "2026.04.10",
        answered: false,
    },
];

export default function Qa() {
    const { user } = useAuthStore();

    const [openIndex, setOpenIndex] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [qaList, setQaList] = useState(DATA);
    const [showLoginBanner, setShowLoginBanner] = useState(false); // ✅ 추가
    const [showBanner, setShowBanner] = useState(false);   // ✅ 추가
    const [toastMsg, setToastMsg] = useState("");

    // ✅ 로그인 토스트 표시 후 이동
    const showLoginAlert = () => {
        setShowLoginBanner(true)
        setTimeout(() => {
            setShowLoginBanner(false)
            navigate('/login')
        }, 1500)
    }

    // ✅ 옵션 미선택 토스트 표시
    const showAlert = () => {
        setShowBanner(true)
        setTimeout(() => {
            setShowBanner(false)
        }, 1500)
    }

    const handleTabClick = (type) => {
        if (!user) {
            showLoginAlert();
            // alert("로그인하신 후 이용가능합니다.");
            return;
        }
        setActiveTab((prev) => (prev === type ? null : type));
    };

    const handleSubmit = () => {
        if (!formTitle.trim() || !formContent.trim()) {
            setToastMsg("제목과 문의 내용을 입력해주세요.");
            showAlert();
            // alert("제목과 문의 내용을 입력해주세요.");
            return;
        }
        const newItem = {
            id: Date.now(),
            type: activeTab,
            title: formTitle,
            question: formContent,
            author: user.email?.slice(0, 4) + "****......",
            answer: "",
            date: new Date().toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(".", "."),
            answered: false,
        };
        setQaList((prev) => [newItem, ...prev]);
        setFormTitle("");
        setFormContent("");
        setActiveTab(null);
    };

    const handleDelete = (e, item) => {
        e.stopPropagation();
        if (item.answered) {
            setToastMsg("답변이 달린 문의는 삭제가 불가능합니다.");
            showAlert();
            // alert("답변이 달린 문의는 삭제가 불가능합니다.");
            return;
        }
        setQaList((prev) => prev.filter((q) => q.id !== item.id));
    };

    const filteredList = qaList.filter((item) =>
        item.title.includes(searchKeyword) || item.question.includes(searchKeyword)
    );

    const toggle = (i) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <div className="qa">
            {/* ✅ 로그인 경고 토스트 */}
            <ToastPopup
                isOpen={showLoginBanner}
                message="로그인후 이용 가능합니다."
                onClose={() => setShowLoginBanner(false)}
                duration={1500}
            />

            {/* ✅ 옵션 미선택 토스트 — 로그인 경고와 동일한 디자인 */}
            <ToastPopup
                isOpen={showBanner}
                message={toastMsg}
                onClose={() => setShowBanner(false)}
                duration={1500}
            />
            <h3>상품 문의</h3>

            {/* 탭 + 폼 */}
            <div className="qa-top">
                <div className="qa-tab-write">
                    <div className="qa-tabs">
                        <button
                            className={activeTab === "product" ? "active" : ""}
                            onClick={() => handleTabClick("product")}
                        >
                            상품관련 문의
                        </button>
                        <button
                            className={activeTab === "shipping" ? "active" : ""}
                            onClick={() => handleTabClick("shipping")}
                        >
                            배송관련 문의
                        </button>
                    </div>

                    {activeTab && (
                        <div className="qa-form">
                            <input
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="궁금하신 점을 작성해주세요."
                                value={formContent}
                                onChange={(e) => setFormContent(e.target.value)}
                            />
                            <div className="qa-form-footer">
                                <button className="submit-btn" onClick={handleSubmit}>
                                    문의등록
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 리스트 */}
            <div className="qa-list">
                {/* 검색바 - 헤더 위 고정 */}
                <div className="qa-search-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="궁금한 내용의 단어나 키워드로 검색하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="qa-header">
                    <div>답변상태</div>
                    <div>제목</div>
                    <div>날짜</div>
                </div>

                {filteredList.map((item, i) => (
                    <div key={item.id}>
                        <div className="qa-row" onClick={() => toggle(i)}>
                            <div className={`status ${item.answered ? "done" : "wait"}`}>
                                {item.answered ? "답변완료" : "답변대기"}
                            </div>
                            <div className="qa-title">
                                <span className={`type-badge ${item.type}`}>
                                    {item.type === "product" ? "상품" : "배송"}
                                </span>
                                {item.title}
                            </div>
                            <div className="qa-date-wrap">
                                {openIndex === i && (
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => handleDelete(e, item)}
                                    >
                                        문의삭제
                                    </button>
                                )}
                                <span className="date">{item.date}</span>
                            </div>
                        </div>

                        {openIndex === i && (
                            <div className="qa-answer-wrap">
                                <div className="qa-answer-info">
                                    <span><strong>제목</strong>{item.title}</span>
                                    <span><strong>작성자</strong>{item.author}</span>
                                    <span><strong>문의 내용</strong>{item.question}</span>
                                </div>
                                {item.answered && (
                                    <div className="qa-answer-body">
                                        <span className="answer-label">답변</span>
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}