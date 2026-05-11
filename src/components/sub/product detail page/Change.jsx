import React, { useState } from "react";
import "./scss/change.scss";
import { FAQ_LIST } from "../../../data/QnaData";

// 배송/반품 탭에서만 사용할 카테고리
const FAQ_CATEGORIES = [
    { id: "all", label: "전체" },
    { id: "delivery", label: "배송" },
    { id: "return", label: "반품 및 교환" }
];

export default function Change() {
    const [activeTab, setActiveTab] = useState("returns");
    const [openIndex, setOpenIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setOpenIndex(null);
    };

    // const { faqs } = TABS[activeTab];
    const [openFaqId, setOpenFaqId] = useState(null);
    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    const filteredFaqs = FAQ_LIST
        .filter(f => f.category === 'delivery' || f.category === 'return')
        .filter((faq) =>
            activeCategory === "all" || faq.category === activeCategory
        );

    return (
        <div className="change">
            <h3>배송관련 FAQ</h3>

            <div className="top-btns">
                {FAQ_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        className={`faq-tab-btn ${activeCategory === cat.id ? "on" : ""}`}
                        onClick={() => {
                            setActiveCategory(cat.id);
                            setOpenFaqId(null);
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {filteredFaqs.map((faq) => (
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
            ))}

            {/* <ul className="faq">
                {faqs.map((faq, index) => (
                    <li key={index}>
                        <button onClick={() => toggle(index)}>
                            {faq.q}
                            <span>{openIndex === index ? "▲" : "▼"}</span>
                        </button>
                        <div className={openIndex === index ? "open" : ""}>
                            {faq.a}
                        </div>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}