import React from 'react'
import "./scss/Benefit.scss"
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// 하단 benefit 배너 데이터
const subCardData = [
    {
        img: "/images/main/quality/benefit01.jpg",
        topText: "당신을 위한 특별 회원 혜택",
        bottomText: "지금 바로 CASETiFY 클럽 로열티 프로그램에 가입해 \n특별 혜택을 즐겨보세요.",
        tab: 'club',
    },
    {
        img: "/images/main/quality/benefit02.jpg",
        topText: "Re/CASETiFY 프로세스",
        bottomText: "210만개 이상의 케이스를 재활용했습니다.",
        tab: 'recastify',
    },
    {
        img: "/images/main/quality/benefit03.jpg",
        topText: "100% 만족 보장",
        bottomText: "구매하시는 모든 CASETiFY 제품에 대해 다음과 같은\n 품질 보증 및 만족 보장 계획을 도입하고있습니다.",
        tab: 'standard',
    },
]

export default function Benefit() {
    const navigate = useNavigate()

    return (
        <div className="benefit-inner">
            <ul className="benefit-card-list">
                {subCardData.map((data, d) => (
                    <li key={d} className="benefit-banner-item">
                        <Link to={"/brand/casetify"} state={{ tab: data.tab }}>
                            <img src={data.img} alt={`benefit-img${d + 1}`} />
                            <div className="text-box">
                                <p className="text1">{data.topText}</p>
                                <p className="text2">{data.bottomText}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}