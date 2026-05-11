import React from 'react'
import "../scss/Quality.scss"
import SectionTitle from '../SectionTitle'
import { useNavigate } from 'react-router-dom'
import Benefit from '../Benefit'
import FadeInSection from '../FadeInSection'

// 케이스티파이 Quality 특징관련 데이터
const infoCardData = [
    { img: "./images/main/quality/bump.jpg", text: "100번의 낙하 테스트\n한계를 넘는 보호력" },
    { img: "./images/main/quality/glaze.jpg", text: "벗겨지지 않는\n컬러의 완성\n글레이즈 기술" },
    { img: "./images/main/quality/stand.jpg", text: "카메라 프로텍터\n스탠드가 되다" },
    { img: "./images/main/quality/stain.jpg", text: "변색 없이\n오래 유지되는\n투명함" },
]

export default function Quality() {
    const navigate = useNavigate()

    return (
        <section className="quality-info">
            <SectionTitle title={"Protection Quality"} subtitle={"케이스티파이만의 완벽한 기준"} />
            {/* Quality 특징 */}
            <FadeInSection direction="up" delay={0.4}>
                <ul className="quality-card-wrap">
                    {infoCardData.map((item, i) => (
                        <li
                            key={i}
                            className="quality-card"
                            onClick={() => navigate('/brand/casetify', { state: { tab: 'standard' } })}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={item.img} alt={`quality-img${i + 1}`} />
                            <div className="text-box">{item.text}</div>
                        </li>
                    ))}
                </ul>
                {/* Benefit */}
                <Benefit />
            </FadeInSection>
        </section>
    )
}