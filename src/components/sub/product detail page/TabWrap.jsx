import React, { useEffect, useState } from "react";
import Detail from "./Detail";

import Qa from "./Qa";
import Change from "./Change";
import Recommend from "./Recommend";
import "./scss/tab.scss";
import Reivew from "./Reivew";

export default function TabWrap({ item }) {
    const [active, setActive] = useState(0);

    const tabs = [
        { id: "detail" },
        { id: "review" },
        { id: "qa" },
        { id: "delivery" },
    ];

    // 클릭 → 스크롤 이동
    const handleClick = (i) => {
        setActive(i);

        const el = document.getElementById(tabs[i].id);
        if (el) {
            const top = el.offsetTop - 80;
            window.scrollTo({
                top,
                behavior: "smooth",
            });
        }
    };

    // 스크롤 → active 자동 변경
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            tabs.forEach((tab, i) => {
                const el = document.getElementById(tab.id);
                if (!el) return;

                const top = el.offsetTop - 100;
                const bottom = top + el.offsetHeight;

                if (scrollY >= top && scrollY < bottom) {
                    setActive(i);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);




    return (
        <div className="tab-wrap">
            <ul className="tab-menu">
                <li
                    className={active === 0 ? "active" : ""}
                    onClick={() => handleClick(0)}
                >
                    상품 상세
                </li>

                <li
                    className={active === 1 ? "active" : ""}
                    onClick={() => handleClick(1)}
                >
                    {/* 상품 평<span>(스코어)</span> */}
                    고객 리뷰
                </li>

                <li
                    className={active === 2 ? "active" : ""}
                    onClick={() => handleClick(2)}
                >
                    상품 문의
                </li>

                <li
                    className={active === 3 ? "active" : ""}
                    onClick={() => handleClick(3)}
                >
                    {/* 배송/교환/반품 안내 */}
                    배송관련 FAQ
                </li>
            </ul>

            <br />

            <div id="detail">
                <Detail item={item} />
            </div>
            <Recommend item={item} />
            <div id="review">
                <Reivew
                    popularity={item.popularity}
                    productId={item.id}
                />
            </div>

            <div id="qa">
                <Qa />
            </div>

            <div id="delivery">
                <Change />
            </div>
        </div>
    );
}