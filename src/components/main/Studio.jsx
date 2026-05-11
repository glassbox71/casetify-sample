import React from 'react'
import SectionTitle from '../SectionTitle'
import "../scss/Studio.scss"
import { Link } from 'react-router-dom'
import FadeInSection from '../FadeInSection'

export default function Studio() {
    return (
        <section className="studio-info">
            {/* <FadeInSection direction="up" delay={0.4}> */}
                <SectionTitle title={"CASETiFY STUDiO"} subtitle={"전국 오프라인 매장에서 만나보세요!"} />
            {/* </FadeInSection> */}
            {/* <div className="bg"> */}
            <FadeInSection direction="up" delay={0.4}>
                <div className="inner">
                    <div className="img-box">
                        <img src="./images/main/studio/studio_pangyo.jpg" alt="판교지점" />
                    </div>
                    <div className="txt-box">
                        <div className="stdio-feature">
                            <span className='title'>케이스티파이와 함께 나만의 스타일을 완성하세요</span>
                            <span>나의 취향을 실물로 바로 확인하는 곳, 디자인 및 소개 피팅</span>
                            <span>기다림 없이 바로 만나는 즐거움, 커스텀 케이스 당일 수령</span>
                            <span>나만의 개성을 더해줄 포인트, 다양한 테크 악세서리 체험</span>
                        </div>
                        <Link to="/brand/store" className="studio-search">매장찾기</Link>
                    </div>
                </div>
            </FadeInSection>
            {/* </div> */}
        </section>
    )
}