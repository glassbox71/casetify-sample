import React, { useState } from 'react'
import "./scss/MypageMenu.scss"
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore';
import CircularOverlay from '../CircularOverlay';

// 마이페이지 메뉴 데이터
const mypageMenuData = [
    { id: 1, icon: "./images/mypage/mypage_id.svg", name: "회원정보", tabicon: true, islink: false },
    { id: 2, icon: "./images/mypage/mypage_order.svg", name: "주문", tabicon: true, islink: false },
    { id: 3, icon: "./images/mypage/mypage_favorite.svg", name: "위시리스트", tabicon: true, islink: false },
    { id: 4, icon: null, name: "케이스티파이 정품 인증", tabicon: false, islink: true },
    { id: 5, icon: "./images/mypage/mypage_present.svg", name: "기프트 카드/쿠폰", tabicon: true, islink: false },
    { id: 6, icon: "./images/mypage/mypage_logout.svg", name: "로그아웃", tabicon: true, islink: false },
]

export default function MypageMenu({ sendSelect, selectMenu }) {
    // hover 상태 파악
    const [hoverId, setHoverId] = useState(null);
    const { onLogout } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        
        setTimeout(async()=>{
            const isLogout = await onLogout();
            if (isLogout) {
                navigate("/");
                setIsLoading(false);
            }
        }, 1500);
    }

    const handleCertify = ()=>{
        navigate("/brand/certify");
    }
    return (
        <>
            <ul className="mypage-menu-list">
                {mypageMenuData.map((menu) => {
                    const isActive = selectMenu === menu.name;
                    const isHover = hoverId === menu.id;
                    return (
                        <li key={menu.id} className={`menu-item ${isActive ? "active" : ""}`}>
                            <button
                                onClick={() => {
                                    if (menu.name === "로그아웃") {
                                        handleLogout();
                                    }else if(menu.name === "케이스티파이 정품 인증"){
                                        handleCertify();
                                    } else {
                                        sendSelect(menu.name);
                                    }
                                }}
                                onMouseEnter={() => setHoverId(menu.id)}
                                onMouseLeave={() => setHoverId(null)}
                            >
                                {menu.icon &&
                                    <img src={(isHover || isActive) ? menu.icon.replace(".svg", "_white.svg") : menu.icon}
                                        alt={menu.name} />}
                                <span>{menu.name}</span>
                                {menu.islink && <span className="link"
                                ><img src={(isHover || isActive) ? "./images/icon/external_link_white.svg" : "./images/icon/external_link.svg"}
                                    alt="링크이동" /></span>}
                            </button>
                        </li>
                    )
                }
                )}
            </ul>
            {isLoading ? (
            <CircularOverlay />
            ) : ("")}
        </>
    )
}
