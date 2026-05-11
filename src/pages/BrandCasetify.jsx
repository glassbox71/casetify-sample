import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useNavigate, useLocation } from 'react-router-dom'
import './scss/BrandCasetify.scss'
import { motion } from 'framer-motion';
import { FAQ_LIST } from '../data/QnaData';
import { Link } from 'react-router-dom'

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

// ─── STORY 탭 ───────────────────────────────────────
function StoryTab() {
    return (
        <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <div className="bc-story">
                {/* Hero */}
                <div className="bc-hero story-bg">
                    <div className="bc-hero-text">
                        <p className="bc-hero-eyebrow">CASETiFY · BRAND STORY</p>
                        <h2 className="bc-hero-title">STORY</h2>
                        <div className="bc-hero-line" />
                        <p className="bc-hero-desc">케이스티파이가 걸어온 길</p>
                    </div>
                </div>

                {/* 인트로 */}
                <section className="bc-intro">
                    <span className="bc-intro-eyebrow">OUR STORY</span>
                    <h3>우리는 <b style={{ color: 'var(--gold)' }}>케이스티파이</b>입니다</h3>
                    <p>케이스티파이는 일상의 품격을 높이는 테크 액세서리를 만듭니다.<br />홍콩과 로스앤젤레스에 본사를 두고, 크리에이티브 정신을 전하는 글로벌 브랜드입니다.</p>
                </section>

                {/* 마키 */}
                <div className="story-marquee">
                    <span className="story-marquee-text">CRAFTED FOR YOU</span>
                    <span className="story-dot" />
                    <span className="story-marquee-text">SINCE 2011</span>
                    <span className="story-dot" />
                    <span className="story-marquee-text">HONG KONG · LOS ANGELES</span>
                    <span className="story-dot" />
                    <span className="story-marquee-text">CRAFTED FOR YOU</span>
                </div>

                {/* CEO 피처 */}
                <section className="story-feature">
                    <div className="bc-inner">
                        <div className="story-feature-grid">
                            <img
                                src="/images/brand/story-wes-ng.png"
                                alt="Wes Ng · Co-Founder & CEO"
                                className="story-feature-img"
                            />
                            <div className="story-feature-meta">
                                <div className="story-yrs">2011</div>
                                <div className="story-since">FOUNDED · A NEW IDEA</div>
                                <h2>새로운 아이폰을 위한,<br /><b>완전히 다른 케이스</b>가 필요했습니다</h2>
                                <p>2011년 아이폰이 출시되었을 때, 케이스티파이의 공동 창업자이자 CEO인 Wes Ng에게 영감이 찾아왔습니다. 새로운 아이폰을 보호하기 위한 케이스들을 살펴보던 중, 무겁고 지루하고, 그의 스타일과도 전혀 어울리지 않는 선택지들에 실망했죠.</p>
                                <p>디자이너이자 혁신가인 그는 이를 도전으로 받아들였습니다. 갖고 싶고, 세련되고, 독특한 — 부담스럽지 않은 부피에 어떤 스타일이든 포인트를 줄 수 있는 케이스를 만드는 것이 목표였습니다.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 타임라인 */}
                <section className="story-timeline">
                    <div className="bc-inner">
                        <div className="story-timeline-head">
                            <p className="bc-intro-eyebrow">OUR JOURNEY</p>
                            <h3>걸어온 길, 그리고 앞으로</h3>
                        </div>
                        <div className="story-rail">
                            {[
                                { yr: '2011', title: '브랜드의 시작', desc: '홍콩에서 출발한 작은 아이디어, 자신의 사진으로 케이스를 커스텀하다.', gold: false },
                                { yr: '2015', title: '임팩트 케이스 출시', desc: '실제 낙하 환경에서 검증한 자체 보호 기준을 정립합니다.', gold: false },
                                { yr: '2021', title: 'RE:CASTiFY 시작', desc: '지속 가능한 미래를 위한 재활용 프로그램을 시작합니다.', gold: false },
                                { yr: 'NOW', title: '전 세계 100여 개 도시', desc: '케이스티파이만의 바이브를 지구촌 곳곳으로 전파하고 있습니다.', gold: true },
                            ].map((step) => (
                                <div key={step.yr} className={`story-step${step.gold ? ' gold' : ''}`}>
                                    <div className="story-step-yr">{step.yr}</div>
                                    <div className="story-step-dot" />
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 큰 인용 */}
                <section className="story-quote">
                    <div className="bc-inner">
                        <div className="story-quote-mark">"</div>
                        <blockquote>
                            케이스티파이는 자신의 사진으로 케이스를 커스텀하는 것에서 시작되었습니다. 10년이 지난 지금, 케이스티파이는 <b>유니크한 디자인으로 자신만의 바이브</b>를 표현할 수 있는 신나는 방법을 제시합니다.
                        </blockquote>
                        <div className="story-quote-by">— WES NG · CO-FOUNDER &amp; CEO</div>
                    </div>
                </section>

                {/* 글로벌 거점 */}
                <section className="story-global">
                    <div className="bc-inner">
                        <div className="story-global-grid">
                            {[
                                { city: 'HONG KONG', role: 'HEAD OFFICE', desc: '브랜드가 시작된 곳. 디자인과 프로덕션의 본거지로, 케이스티파이의 모든 이야기가 이곳에서 출발합니다.' },
                                { city: 'LOS ANGELES', role: 'CREATIVE STUDIO', desc: '전 세계 아티스트·셀러브리티와의 협업이 이루어지는 크리에이티브 거점입니다.' },
                                { city: 'SEOUL', role: 'FLAGSHIP MARKET', desc: '가장 빠르게 성장하는 시장. 한국 고객을 위한 한정 컬렉션과 매장을 운영합니다.' },
                            ].map((cell) => (
                                <div key={cell.city} className="story-global-cell">
                                    <div className="story-global-city">{cell.city}</div>
                                    <div className="story-global-role">{cell.role}</div>
                                    <p>{cell.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    )
}

// ─── STANDARD 슬라이드 데이터 ─────────────────────────
const STANDARD_SLIDES = [
    {
        key: 'impact',
        label: 'IMPACT CASE',
        showcaseTitle: 'PROTECTION,\nREFINED',
        title: '충격을 흡수하는,\n가장 신뢰할 수 있는 케이스',
        desc: '군용 등급 낙하 보호와 부담스럽지 않은 부피의 균형. 케이스티파이가 정의하는 가장 표준적인 형태입니다.',
        link: '/search?q=임팩트 케이스',
        img: '/images/brand/impact-case.png'
    },

    {
        key: 'bounce',
        label: 'BOUNCE CASE',
        showcaseTitle: 'BUILT TO\nBOUNCE BACK',
        title: '튀어오르는 탄성,\n일상을 지키는 케이스',
        desc: '독자적인 에어 쿠션 구조로 충격을 분산합니다. 어떤 낙하에도 흔들리지 않는 자신감.',
        link: '/search?q=바운스 케이스',
        img: '/images/brand/bounce-case.png'
    },

    {
        key: 'clear',
        label: 'CLEAR CASE',
        showcaseTitle: 'CRYSTAL CLEAR,\nEVERYDAY READY',
        title: '투명하게, 그러나\n완벽하게 보호합니다',
        desc: '폰의 디자인을 그대로 살리면서 탁월한 보호력을 제공하는 시그니처 클리어 케이스.',
        link: '/search?q=임팩트 클리어 케이스',
        img: '/images/brand/clear-case.png'
    },

    {
        key: 'glaze',
        label: 'GLAZE CASE',
        showcaseTitle: 'SHINE WITH\nATTITUDE',
        title: '광택이 주는 품격,\n새로운 감각의 케이스',
        desc: '미러 피니시 소재로 완성한 글레이즈 케이스. 빛에 따라 달라지는 독특한 표면감.',
        link: '/search?q=글레이즈 케이스',
        img: '/images/brand/glaze-case.png'
    },

    {
        key: 'ring',
        label: 'RING STAND',
        showcaseTitle: 'HOLD.\nSTAND. GO.',
        title: '잡기 편하고,\n세워두기도 좋은 링스탠드',
        desc: '자유롭게 각도 조절되는 링스탠드. 한 손으로도 안정적으로 기기를 잡을 수 있습니다.',
        link: '/search?q=임팩트 링 스탠드 케이스',
        img: '/images/brand/ring-stand.png'
    },

    {
        key: 'strap',
        label: 'BODY STRAP',
        showcaseTitle: 'MOVE\nHANDS FREE',
        title: '손 없이도 자유롭게,\n바디스트랩',
        desc: '어깨에 걸치거나 크로스로 착용 가능한 바디스트랩. 패션과 실용성을 동시에.',
        link: '/search?q=strap',
        img: '/images/brand/body-strap.png'
    },

    {
        key: 'travel',
        label: 'TRAVEL CARRIER',
        showcaseTitle: 'MOVE IN\nSTYLE',
        title: '여행의 시작,\n케이스티파이 트래블 캐리어',
        desc: '가볍고 견고한 소재로 만든 트래블 캐리어. 이동 중에도 스타일을 잃지 않습니다.',
        link: '/search?q=바운스 캐리어',
        img: '/images/brand/travel.png'
    },
]


const CHIP_LABELS = ['임팩트 케이스', '바운스 케이스', '클리어 케이스', '글레이즈 케이스', '링스탠드', '바디스트랩', '트래블 캐리어']

// 슬라이드별 상세 설명
const SLIDE_DETAILS = [
    {
        key: 'impact',
        features: [
            { icon: '🛡️', title: '군용 등급 보호', desc: 'MIL-STD-810G 기준 2.5m 낙하 테스트 통과. 모서리와 측면을 감싸는 에어 쿠션 구조.' },
            { icon: '⚖️', title: '얇고 가벼운 설계', desc: '보호력은 극대화하면서 케이스 두께는 최소화. 손에 쥐었을 때 부담이 없습니다.' },
            { icon: '✏️', title: '자유로운 커스텀', desc: '수천 가지 디자인 중 선택하거나 직접 업로드해 나만의 임팩트 케이스를 완성하세요.' },
        ],
    },
    {
        key: 'bounce',
        features: [
            { icon: '🌀', title: '에어 쿠션 구조', desc: '독자적인 바운스 소재가 충격을 사방으로 분산. 어떤 각도로 떨어져도 안심입니다.' },
            { icon: '🤸', title: '유연한 그립감', desc: '손에 자연스럽게 감기는 소재로 미끄럼 없이 편안하게 잡을 수 있습니다.' },
            { icon: '🎨', title: '선명한 컬러', desc: '바운스 케이스만의 반투명 컬러 팔레트. 생동감 넘치는 색상으로 개성을 표현하세요.' },
        ],
    },
    {
        key: 'clear',
        features: [
            { icon: '🔍', title: '완벽한 투명도', desc: '황변 방지 처리된 프리미엄 투명 소재. 폰 본연의 색상과 디자인을 그대로 보여줍니다.' },
            { icon: '🛡️', title: '탁월한 보호력', desc: '투명하지만 충격에는 강합니다. 일상적인 낙하와 긁힘으로부터 폰을 지켜줍니다.' },
            { icon: '💎', title: '슬림한 핏', desc: '군더더기 없는 얇은 두께로 폰의 슬림함을 유지합니다.' },
        ],
    },
    {
        key: 'glaze',
        features: [
            { icon: '✨', title: '미러 피니시', desc: '빛에 따라 다채롭게 변하는 광택 표면. 보는 각도마다 다른 표정을 보여줍니다.' },
            { icon: '🎭', title: '프리미엄 소재', desc: '고광택 코팅 처리로 스크래치에 강하면서도 고급스러운 질감을 유지합니다.' },
            { icon: '🌈', title: '다양한 컬러', desc: '실버, 골드, 로즈골드 등 다양한 메탈릭 컬러로 취향에 맞게 선택하세요.' },
        ],
    },
    {
        key: 'ring',
        features: [
            { icon: '💍', title: '360° 회전 링', desc: '어느 방향으로도 자유롭게 회전하는 링. 가로·세로 모두 안정적으로 거치됩니다.' },
            { icon: '🤳', title: '한 손 그립', desc: '손가락을 링에 걸어 한 손으로도 안전하게 기기를 잡을 수 있습니다.' },
            { icon: '📲', title: 'MagSafe 호환', desc: '무선 충전과 MagSafe 액세서리 사용을 방해하지 않도록 설계되었습니다.' },
        ],
    },
    {
        key: 'strap',
        features: [
            { icon: '👜', title: '크로스·숄더 양용', desc: '길이 조절이 가능한 스트랩으로 크로스백 또는 숄더백 스타일 모두 연출 가능.' },
            { icon: '🔗', title: '탈착 가능 구조', desc: '카라비너 클립으로 케이스와 스트랩을 손쉽게 탈착. 상황에 맞게 유연하게 사용하세요.' },
            { icon: '🧵', title: '다양한 소재', desc: '나일론, 레더, 체인 등 소재와 색상을 선택해 나만의 스타일을 완성하세요.' },
        ],
    },
    {
        key: 'travel',
        features: [
            { icon: '✈️', title: '가볍고 견고한 쉘', desc: '항공우주 등급 폴리카보네이트 소재로 무게는 줄이고 내구성은 높였습니다.' },
            { icon: '🔒', title: 'TSA 승인 잠금장치', desc: '공항 보안 검색에 호환되는 TSA 승인 자물쇠가 기본 탑재되어 있습니다.' },
            { icon: '🎨', title: '시그니처 커스텀', desc: '케이스티파이만의 감성을 담은 디자인. 공항에서도 내 캐리어를 한눈에 찾을 수 있습니다.' },
        ],
    },
]

// ─── STANDARD 탭 ────────────────────────────────────
function StandardTab() {
    const navigate = useNavigate()
    const swiperRef = useRef(null)
    const [currentIdx, setCurrentIdx] = useState(0)

    const total = STANDARD_SLIDES.length
    const current = STANDARD_SLIDES[currentIdx]

    const warrantyCards = [
        {
            period: '10일 이내', tag: '모든 고객님', color: 'blue',
            body: <p className="std-card-body">구매하신 제품이 마음에 들지 않으신다면, <b>10일 내에 주문하신 모든 제품을 조건 없이 반품</b> 또는 교환해드립니다.</p>,
            list: ['일부 제품 및 주문 건에만 적용', '제품 구매 후 10일 이내 | T&C applies*'],
        },
        {
            period: '6개월', tag: '모든 고객님', color: 'blue',
            body: <p className="std-card-body">당사의 <b>6개월 제품 보증</b>은 손상된 제품을 교환해 드립니다.</p>,
            list: ['일부 제품 및 주문 건에만 적용됩니다.', '한 번 교환 | T&C applies*', '반품/교환된 제품이 단종된 제품일 경우 동일한 금액 또는 그보다 낮은 금액의 제품으로 적용됩니다.'],
        },
        {
            period: '12개월', tag: '골드 등급 회원', color: 'pink', tagGold: true,
            body: <p className="std-card-body"><b>골드 등급 회원</b>에게는 6개월 제품 보증 기간 외의 <b>6개월 특별 연장을 제공</b>합니다.</p>,
            list: ['골드 회원으로 업그레이드 이후 발생한 주문 및 제품에 한하여 적용됩니다.', 'CASETiFY Club 골드 등급 회원에게만 해당 (전 지역)', '구매 후 12개월 이내', '한 번 교환 | T&C applies*'],
        },
    ]

    return (
        <div className="bc-standard">
            {/* Hero */}
            <div className="bc-hero standard-bg">
                <div className="bc-hero-text">
                    <p className="bc-hero-eyebrow">CASETiFY · OUR STANDARD</p>
                    <h2 className="bc-hero-title">STANDARD</h2>
                    <div className="bc-hero-line" />
                    <p className="bc-hero-desc">케이스티파이가 지키는 기준</p>
                </div>
            </div>

            {/* 메가 헤드라인 */}
            <section className="std-mega">
                <div className="bc-inner">
                    <span className="bc-intro-eyebrow">OUR STANDARD</span>
                    <h2><span className="std-light">충분한</span> 보호력이 아닌,<br />당신의 <b style={{ color: 'var(--gold)' }}>실제 삶</b>에서 시작되는 기준</h2>
                    <p><span className="std-strong">다른 이들이 '이 정도면 충분한' 보호력을 이야기할 때,</span> 케이스티파이의 기준은 당신의 실제 삶에서 시작됩니다. 일상 속 사소한 낙하부터 짜릿한 모험, 그리고 케이스의 진정한 성능을 시험하는 생생한 도전까지 — 우리가 만들어내는 모든 제품은 현실에서 만들어진 끝없는 도전에서 비로소 탄생합니다.</p>
                </div>
            </section>

            {/* 키 메트릭 */}
            <section className="std-metrics">
                <div className="bc-inner">
                    <div className="std-metrics-grid">
                        {[
                            { idx: '01', num: '2.5', unit: 'm', title: '군용 등급 낙하 테스트', desc: 'MIL-STD-810G 기준 2.5m 높이에서의 다중 낙하를 통과합니다.' },
                            { idx: '02', num: '100', unit: '%', title: '만족 보장 정책', desc: '모든 주문은 10일 이내 조건 없는 반품·교환이 가능합니다.' },
                            { idx: '03', num: '6+6', unit: '개월', title: '제품 보증 기간', desc: '기본 6개월, 골드 등급은 추가 6개월의 연장 보증을 제공합니다.' },
                        ].map((m) => (
                            <div key={m.idx} className="std-metric-cell">
                                <div className="std-metric-idx">{m.idx}</div>
                                <div className="std-metric-num">{m.num}<small>{m.unit}</small></div>
                                <h4>{m.title}</h4>
                                <p>{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 제품 쇼케이스 — Swiper */}
            <section className="std-showcase">
                <div className="bc-inner">
                    <div className="std-showcase-frame">
                        {/* 슬라이드 이미지 */}
                        <Swiper
                            modules={[Navigation]}
                            loop
                            onSwiper={(swiper) => { swiperRef.current = swiper }}
                            onSlideChange={(swiper) => setCurrentIdx(swiper.realIndex)}
                            className="std-swiper"
                        >
                            {STANDARD_SLIDES.map((slide) => (
                                <SwiperSlide key={slide.key}>
                                    <div
                                        className="std-slide-bg"
                                        style={{ backgroundImage: `url(${slide.img})` }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* 오버레이 레이블 */}
                        <div className="std-showcase-lbl">SIGNATURE COLLECTION</div>

                        제품 보러가기
                        <button
                            className="std-showcase-cta"
                            onClick={() => navigate(current.link)}
                        >
                            제품 보러가기 →
                        </button>

                        {/* 캡션 */}
                        <div className="std-showcase-cap">
                            <div className="std-showcase-k">{current.label}</div>

                            <h3>
                                {current.showcaseTitle.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        {i === 0 && <br />}
                                    </span>
                                ))}
                            </h3>
                        </div>

                        {/* 페이저 */}
                        <div className="std-showcase-pager">
                            <button
                                className="std-pager-arrow"
                                onClick={() => swiperRef.current?.slidePrev()}
                            >‹</button>
                            <div className="std-pager-num">
                                <b>{String(currentIdx + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
                            </div>
                            <button
                                className="std-pager-arrow"
                                onClick={() => swiperRef.current?.slideNext()}
                            >›</button>
                        </div>
                    </div>
                </div>
            </section >

            {/* 카테고리 칩 — 클릭 시 해당 슬라이드로 이동 */}
            <div div className="std-chips-wrap" >
                <div className="std-chips">
                    {CHIP_LABELS.map((chip, i) => (
                        <span
                            key={chip}
                            className={`std-chip${currentIdx === i ? ' on' : ''}`}
                            onClick={() => swiperRef.current?.slideToLoop(i)}
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            </div >

            {/* 제품 상세 설명 패널 */}
            <section section className="std-product-detail" >
                <div className="bc-inner">
                    <div className="std-detail-header">
                        <div className="std-detail-label">{current.label}</div>
                        <h3>{current.title.split('\n').join(' ')}</h3>
                        <p>{current.desc}</p>
                        <button
                            className="std-detail-cta"
                            onClick={() => navigate(current.link)}
                        >
                            {current.label} 전체보기 →
                        </button>
                    </div>
                    <div className="std-detail-features">
                        {SLIDE_DETAILS[currentIdx]?.features.map((f) => (
                            <div key={f.title} className="std-detail-feature-card">
                                <div className="std-detail-feature-icon">{f.icon}</div>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* 100% 만족 보장 */}
            <section section className="std-warranty" >
                <div className="bc-inner">
                    <div className="std-warranty-wrap">
                        <div className="std-warranty-left">
                            <p className="bc-intro-eyebrow">100% SATISFACTION</p>
                            <h4>고객님의 만족이<br />저희의 최우선 입니다</h4>
                            <p>구매하신 모든 CASETiFY 제품에 대해 다음과 같은 품질 보증 및 만족 보장 계획을 도입하고 있습니다. 마음에 들지 않으시다면 망설이지 마세요.</p>
                        </div>
                        <div className="std-warranty-badge">
                            <div className="std-badge-pct">100%</div>
                            <div className="std-badge-lbl">SATISFACTION</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 보증 카드 */}
            <section section className="std-guarantee" >
                <div className="bc-inner">
                    <div className="std-guarantee-head">
                        <p className="bc-intro-eyebrow">PRODUCT WARRANTY</p>
                        <h3>제품 보증 기간</h3>
                    </div>
                    <div className="std-guarantee-grid">
                        {warrantyCards.map((card) => (
                            <div key={card.period} className={`std-card ${card.color}`}>
                                <div className="std-card-top">
                                    <div className="std-card-period">{card.period}</div>
                                    <div className={`std-card-tag${card.tagGold ? ' gold' : ''}`}>{card.tag}</div>
                                </div>
                                {card.body}
                                <ol>{card.list.map((item, i) => <li key={i}>{item}</li>)}</ol>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* 케어 팁 */}
            <section section className="std-care" >
                <div className="bc-inner">
                    <p className="std-care-sub">다음은 CASETiFY 제품의 사용 수명을 보장하기 위한 소재별 관리 팁입니다.</p>
                    <h3>제품 케어 팁</h3>
                    <div className="std-care-grid">
                        {[
                            { num: '01', icon: '🧽', desc: '깨끗하고 부드러운 천을 물에 약간 적셔 케이스를 청소해 주십시오.' },
                            { num: '02', icon: '🚫', desc: '알코올 성분이 함유된 소독제 사용을 삼가 주십시오.' },
                            { num: '03', icon: '⚠️', desc: '표백 제품이나 유사 화학 물질을 사용하여 케이스를 청소하지 마십시오.' },
                        ].map((card) => (
                            <div key={card.num} className="std-care-card">
                                <div className="std-care-num">{card.num}</div>
                                <div className="std-care-icon">{card.icon}</div>
                                <p>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    )
}

// ─── RE:CASTiFY 탭 ───────────────────────────────────
function RecastifyTab() {
    const navigate = useNavigate()

    const goalCards = [
        { cls: 'c1', tag: 'ENERGY', num: '−6.42', unit: '%', title: '에너지 집중도 감축', desc: '홍콩 리테일 매장 및 사무실\n연면적(GFA)당 생산량 기준' },
        { cls: 'c2', tag: 'EMISSION', num: '−22', unit: '%', title: '온실가스 배출량 감축', desc: '홍콩 리테일 매장 및 사무실\n연면적(GFA)당 생산량 기준' },
        { cls: 'c3', tag: 'RECYCLE', num: '100', unit: '%', title: '생산 폐기물 재활용', desc: '홍콩 생산 기지에서 배출되는\n모든 생산 폐기물 대상' },
    ]
    const statsData = [
        { idx: '01', num: '2.1', unit: 'M+', title: '재활용된 폰케이스', desc: '2021년부터 지금까지 210만 개 이상의 폰케이스를 재활용했습니다.' },
        { idx: '02', num: '105', unit: 'K kg', title: '매립을 막은 플라스틱', desc: '10만 5천 킬로그램이 넘는 플라스틱이 매립지로 가는 것을 막았습니다.' },
        { idx: '03', num: '503', unit: 'K+', title: '새로 심은 나무', desc: 'Earthday.org 팀과 함께 503,000그루가 넘는 나무를 심었습니다.' },
        { idx: '04', num: 'CO', unit: '₂↓', title: '탄소 배출량 절감', desc: '제조 공정과 물류 전반에서 탄소 배출량을 지속적으로 절감하고 있습니다.' },
    ]
    const processSteps = [
        { n: '01', lbl: 'COLLECT', img: '/images/brand/recastify-collect.png', title: '낡은 케이스를 보내주세요', desc: '더 이상 사용하지 않는 케이스를 케이스티파이로 보내주시면, 순환 여정의 출발점이 됩니다.' },
        { n: '02', lbl: 'PROCESS', img: '/images/brand/recastify-process.png', title: '전문 파트너와 함께 처리', desc: '독립된 재활용 파트너와 협력하여 케이스를 안전하게 분해·세척·처리합니다.' },
        { n: '03', lbl: 'EXTRACT', img: '/images/brand/recastify-extract.png', title: '재활용 소재로 재탄생', desc: '추출된 소재는 새로운 케이스, 액세서리, 그리고 아티스트 작품으로 다시 태어납니다.' },
    ]
    const artistCards = [
        { cls: 'c1', tag: 'SEOUL', img: '/images/brand/artist-cha-incheol.png', name: '차인철', desc: '서울의 도시 거리에서 영감을 받은 거리 예술가. 케이스티파이와 함께 도시의 음영을 담은 친환경 폰케이스를 선보였습니다.' },
        { cls: 'c2', tag: 'BROOKLYN', img: '/images/brand/artist-cody-hoyt.png', name: '코디 호이트 (Cody Hoyt)', desc: '브루클린을 기반으로 활동하는 아티스트. 금속 폐자재와 협력적 작업에 영향을 받아 재해석된 폰케이스를 재탄생시켰습니다.' },
        { cls: 'c3', tag: 'K11 MUSEA', img: '/images/brand/artist-reclaimed.png', name: 'RE/CLAIMED 설치물', desc: 'K11 MUSEA에 설치된 대형 벤치 작품은 지속가능성이 아름다움과 영향력을 동시에 거둘 수 있음을 보여줍니다.' },
        { cls: 'c4', tag: 'ACCESSORY', img: '/images/brand/artist-reimagined.png', name: 'RE/IMAGINED 스마트폰 스탠드', desc: '100% 재활용 소재로 제작된 데일리 액세서리. 지속가능한 스타일에 분명한 목적을 담았습니다.' },
    ]

    return (
        <div className="bc-recastify">
            {/* Hero */}
            <div className="bc-hero rc-hero-bg">
                <div className="bc-hero-text">
                    <p className="bc-hero-eyebrow">SUSTAINABILITY · CIRCULAR FUTURE</p>
                    <h2 className="bc-hero-title">RE:CASTiFY</h2>
                    <div className="bc-hero-line" />
                    <p className="bc-hero-desc">지속 가능한 미래를 향한 케이스티파이의 약속</p>
                </div>
            </div>

            {/* 인트로 */}
            <section className="bc-intro">
                <span className="bc-intro-eyebrow" style={{ color: '#7eb450' }}>SUSTAINABILITY</span>
                <h3>지속 가능한 미래를 향한,<br /><b style={{ color: '#5a8a3a' }}>케이스티파이의 약속</b></h3>
                <p>우리는 보다 친환경적인 미래에 대한 명확한 비전을 가지고, 버진 플라스틱 사용을 줄이기 위해 전념하고 있습니다. 케이스티파이는 디자인과 지속가능성이 공존할 수 있음을 보여줍니다.</p>
            </section>

            {/* 2030 목표 */}
            <section className="rc-goal">
                <div className="bc-inner">
                    <div className="rc-goal-head">
                        <p className="bc-intro-eyebrow" style={{ color: '#7eb450' }}>RE:CASTiFY · 2030 GOAL</p>
                        <h3>2030년까지의 <b>세 가지 목표</b></h3>
                        <p>홍콩 리테일 매장 및 사무실 연면적(GFA)당 생산량과 생산 폐기물을 기준으로, 측정 가능한 지속가능성 목표를 설정했습니다.</p>
                    </div>
                    <div className="rc-goal-grid">
                        {goalCards.map((card) => (
                            <div key={card.tag} className={`rc-goal-card ${card.cls}`}>
                                <span className="rc-goal-tag">{card.tag}</span>
                                <div className="rc-goal-num">{card.num}<small>{card.unit}</small></div>
                                <div>
                                    <h4>{card.title}</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 플라스틱 위기 */}
            <section className="rc-crisis">
                <div className="bc-inner">
                    <div className="rc-crisis-grid">
                        <img
                            src="/images/brand/recastify-plastic-ocean.png"
                            alt="플라스틱 위기 · 바다 속 플라스틱"
                            className="rc-crisis-ph"
                        />
                        <div className="rc-crisis-meta">
                            <p className="bc-intro-eyebrow" style={{ color: '#3a7fb5', fontWeight: 700 }}>THE PLASTIC CRISIS</p>
                            <h2>전 세계가 마주한,<br /><b>플라스틱 위기</b></h2>
                            <div className="rc-crisis-big">460<small>M</small></div>
                            <div className="rc-crisis-cap">전 세계 연간 플라스틱 생산량 (단위: 톤)</div>
                            <p>전 세계에서는 매년 <b>4억 6천만 톤</b>에 달하는 플라스틱이 생산되고 있습니다. 이는 세상에서 가장 큰 포유류인 대왕고래 <b>320만 마리</b>와 맞먹는 무게이죠. 친환경 기술로 플라스틱 사용을 줄이고, 다시 쓰고, 재활용한다면 이 거대한 숫자도 바꿔나갈 수 있습니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 임팩트 통계 */}
            <section className="rc-stats">
                <div className="bc-inner">
                    <div className="rc-stats-head">
                        <p className="bc-intro-eyebrow">OUR IMPACT · SINCE 2021</p>
                        <h3>지금까지 만들어 온 변화</h3>
                    </div>
                    <div className="rc-stats-grid">
                        {statsData.map((s) => (
                            <div key={s.idx} className="rc-stats-cell">
                                <div className="rc-stats-idx">{s.idx}</div>
                                <div className="rc-stats-num">{s.num}<small>{s.unit}</small></div>
                                <h4>{s.title}</h4>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3-step */}
            <section className="rc-process">
                <div className="bc-inner">
                    <div className="rc-process-head">
                        <p className="bc-intro-eyebrow" style={{ color: 'var(--gold)' }}>RE/CASETiFY™</p>
                        <h3>폐기물을 <b>re/IMAGINE</b> 하다</h3>
                        <p>낡은 케이스를 새로운 가능성으로 다시 태어나게 합니다. 케이스티파이의 순환 프로그램은 단 세 단계로 작동합니다.</p>
                    </div>
                    <div className="rc-process-steps">
                        {processSteps.map((step) => (
                            <div key={step.n} className="rc-process-step">
                                <div className="rc-process-n">{step.n}</div>
                                <div className="rc-process-ph">
                                    <img src={step.img} alt={step.title} className="rc-process-img" />
                                    <div className="rc-process-lbl">{step.lbl}</div>
                                </div>
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 아티스트 협업 */}
            <section className="rc-artist">
                <div className="bc-inner">
                    <div className="rc-artist-head">
                        <p className="bc-intro-eyebrow">ARTIST COLLABORATIONS</p>
                        <h3>폐기물에 새로운 시선,<br />창작자에게는 <b>새로운 가능성</b></h3>
                    </div>
                    <div className="rc-artist-grid">
                        {artistCards.map((card) => (
                            <div key={card.name} className={`rc-artist-card ${card.cls}`}>
                                <div className="rc-artist-ph">
                                    <img src={card.img} alt={card.name} className="rc-artist-img" />
                                    <div className="rc-artist-tag">{card.tag}</div>
                                </div>
                                <div className="rc-artist-name">{card.name}</div>
                                <div className="rc-artist-desc">{card.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="rc-cta">
                <div className="bc-inner">
                    <p className="bc-intro-eyebrow" style={{ color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>JOIN THE MOVEMENT</p>
                    <h3>당신의 낡은 케이스가,<br />새로운 시작이 됩니다</h3>
                    <p>지금 RE/CASETiFY 프로그램에 참여하고, 더 나은 미래를 함께 만들어 주세요.</p>
                </div>
            </section>
        </div>
    )
}

// ─── CLUB 탭 ────────────────────────────────────────
function ClubTab() {
    const [openFaq, setOpenFaq] = useState(null)
    const navigate = useNavigate()

    // QnaData에서 club 카테고리 FAQ만 필터링
    const faqs = FAQ_LIST
        .filter(f => f.category === 'club')
        .map(f => ({ q: f.question, a: f.answer }))

    const benefits = [
        { label: '등급 할인 바우처', bronze: '15%', silver: '20%', gold: '30%' },
        { label: '웰컴 쿠폰', bronze: <CheckDot on />, silver: <CheckDot on />, gold: <CheckDot on /> },
        { label: '신제품 사전 주문', bronze: <CheckDot />, silver: <CheckDot on />, gold: <CheckDot on /> },
        { label: '비공개 세일 초대', bronze: <CheckDot />, silver: <CheckDot on />, gold: <CheckDot on /> },
        { label: '생일 기프트 바우처', bronze: <CheckDot />, silver: <CheckDot on />, gold: <CheckDot on /> },
        { label: '제품 보증 기간', bronze: '6개월', silver: '6개월', gold: '12개월' },
        { label: '한정판 우선 구매', bronze: <CheckDot />, silver: <CheckDot />, gold: <CheckDot on /> },
        { label: '전용 고객지원', bronze: <CheckDot />, silver: <CheckDot />, gold: <CheckDot on /> },
    ]

    const tiers = [
        {
            cls: 'bronze', tag: 'TIER 01', coin: 'B', name: 'BRONZE',
            req: <p className="bc-club-tier-req">연간 누적 <b>100,000원+</b> · 100P</p>,
            items: ['등급 할인 바우처', '신규 가입 웰컴 쿠폰', '회원 전용 뉴스레터', '주문 추적 우선 알림'],
        },
        {
            cls: 'silver', tag: 'TIER 02', coin: 'S', name: 'SILVER',
            req: <p className="bc-club-tier-req">연간 누적 <b>250,000원+</b> · 250P</p>,
            items: ['20% 할인 바우처', '신제품 사전 주문 권한', '비공개 세일 우선 초대', '생일 기프트 바우처', 'Bronze 등급의 모든 혜택'],
        },
        {
            cls: 'gold', tag: 'TIER 03 · TOP', coin: 'G', name: 'GOLD',
            req: <p className="bc-club-tier-req">연간 누적 <b>500,000원+</b> · 500P</p>,
            items: ['30% 할인 바우처', '12개월 연장 제품 보증', '한정판 컬렉션 우선 구매', '전용 고객지원 라인', 'Silver 등급의 모든 혜택'],
        },
    ]

    return (
        <div className="bc-club">
            {/* Hero */}
            <div className="bc-hero club-bg">
                <div className="bc-hero-text">
                    <p className="bc-hero-eyebrow">MEMBERSHIP PROGRAM · MEMBER ONLY</p>
                    <h2 className="bc-hero-title">CASETiFY CLUB</h2>
                    <div className="bc-hero-line" />
                    <p className="bc-hero-desc">회원 전용 혜택과 특별한 경험</p>
                </div>
            </div>

            {/* 인트로 */}
            <section className="bc-club-intro">
                <div className="bc-inner">
                    <p className="bc-club-eyebrow">CASETiFY CLUB</p>
                    <h3>케이스티파이의 새로운 일상,<br />지금 <b>클럽</b>에서 시작하세요</h3>
                    <p className="bc-club-lead">
                        CASETiFY Club은 <b style={{ color: '#111', fontWeight: 700 }}>무료로 가입할 수 있는 멤버십 프로그램</b>입니다.<br />
                        쇼핑하며 적립한 포인트로 등급을 올리고, 등급에 따라 다양한 혜택을 누려보세요.<br />
                        선주문 권한, 비공개 세일 초대, 생일 기프트, 연장 보증까지 — 케이스티파이만의 특별한 경험이 시작됩니다.
                    </p>
                    <div className="bc-club-stats">
                        <div className="bc-club-stat"><span className="bc-club-stat-num">3<em>단계</em></span><span className="bc-club-stat-lbl">BRONZE / SILVER / GOLD 등급</span></div>
                        <div className="bc-club-stat"><span className="bc-club-stat-num">1,000<em>원 = 1P</em></span><span className="bc-club-stat-lbl">구매 금액 1,000원당 1포인트 적립</span></div>
                        <div className="bc-club-stat"><span className="bc-club-stat-num">12<em>개월</em></span><span className="bc-club-stat-lbl">멤버십 유효 기간</span></div>
                        <div className="bc-club-stat"><span className="bc-club-stat-num">0<em>원</em></span><span className="bc-club-stat-lbl">평생 무료 가입</span></div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bc-club-how">
                <div className="bc-inner">
                    <div className="bc-club-how-head">
                        <div>
                            <p className="bc-club-eyebrow">HOW IT WORKS</p>
                            <h3>간단한 세 단계,<br />지금 바로 시작하세요</h3>
                        </div>
                        <p>별도의 멤버십 비용 없이,<br />누구나 케이스티파이 회원이 되는 순간 자동으로 클럽에 가입됩니다.</p>
                    </div>
                    <div className="bc-club-steps">
                        {[
                            { n: 'STEP 01', title: '무료로 가입하기', desc: 'CASETiFY 계정을 만들면 자동으로 CLUB 멤버가 됩니다. 등급에 따라 다양한 할인 혜택과 단독 혜택을 누릴 수 있습니다.', glyph: '＋' },
                            { n: 'STEP 02', title: '포인트 적립하기', desc: '구매 금액 1,000원당 1포인트가 자동 적립됩니다. 결제 후 10일이 지난 시점에 적립이 확정되며, 누적 포인트에 따라 등급이 결정됩니다.', glyph: '₩' },
                            { n: 'STEP 03', title: '등급별 혜택 누리기', desc: 'Bronze → Silver → Gold 순으로 등급이 올라갈 때마다 더 큰 할인과 단독 혜택이 열립니다. 마지막 구매일 기준 12개월 동안 유지됩니다.', glyph: '★' },
                        ].map((step) => (
                            <div key={step.n} className="bc-club-step">
                                <span className="bc-club-step-num">{step.n}</span>
                                <p className="bc-club-step-title">{step.title}</p>
                                <p>{step.desc}</p>
                                <span className="bc-club-step-glyph">{step.glyph}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TIERS */}
            <section className="bc-club-tiers">
                <div className="bc-inner">
                    <p className="bc-club-eyebrow">MEMBERSHIP TIERS</p>
                    <h3>세 가지 등급, 점점 커지는 즐거움</h3>
                    <p className="bc-club-tier-sub">연간 누적 구매 금액에 따라 자동으로 등급이 변경됩니다.<br />상위 등급으로 올라갈수록 더 많은 혜택을 만나보실 수 있습니다.</p>
                    <div className="bc-club-tier-grid">
                        {tiers.map((tier) => (
                            <div key={tier.name} className={`bc-club-tier bc-club-tier--${tier.cls}`}>
                                <div className="bc-club-tier-ribbon" />
                                <p className="bc-club-tier-tag">{tier.tag}</p>
                                <div className="bc-club-tier-coin">{tier.coin}</div>
                                <p className="bc-club-tier-name">{tier.name}</p>
                                {tier.req}
                                <ul>{tier.items.map((item) => <li key={item}>{item}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMPARE */}
            <section className="bc-club-compare">
                <div className="bc-inner">
                    <div className="bc-club-compare-head">
                        <p className="bc-club-eyebrow" style={{ color: '#c8a24c' }}>BENEFITS AT A GLANCE</p>
                        <h3>한눈에 보는 등급별 혜택</h3>
                    </div>
                    <table className="bc-club-table">
                        <thead>
                            <tr>
                                <th>혜택</th>
                                <th className="bronze">BRONZE</th>
                                <th className="silver">SILVER</th>
                                <th className="gold">GOLD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {benefits.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.label}</td>
                                    <td>{row.bronze}</td>
                                    <td>{row.silver}</td>
                                    <td className="gold">{row.gold}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr><td colSpan={4}>* 모든 혜택은 유효한 멤버십 기간 동안 적용되며, 일부 컬래버레이션 / 아카이브 / 세일 컬렉션은 제외될 수 있습니다.</td></tr>
                        </tfoot>
                    </table>
                </div>
            </section>

            {/* EARN */}
            <section className="bc-club-earn">
                <div className="bc-inner">
                    <p className="bc-club-eyebrow">EARN POINTS</p>
                    <h3>포인트는 이렇게 쌓여요</h3>
                    <p className="bc-club-earn-sub">쇼핑할 때마다 자동으로 포인트가 적립됩니다.<br />마지막 구매일로부터 12개월 동안의 누적 포인트가 등급을 결정합니다.</p>
                    <div className="bc-club-earn-grid">
                        {[
                            { ico: '₩', icoClass: '', title: '구매 금액 적립', desc: '온라인 / 오프라인 매장에서의 정상가 구매 금액 1,000원당 1포인트가 자동 적립됩니다.', pts: '+1 POINT / 1,000원', },
                            { ico: '✦', icoClass: '', title: '신규 회원 보너스', desc: '처음 가입하시면 첫 구매에 사용 가능한 웰컴 쿠폰을 즉시 받으실 수 있어요.', pts: 'WELCOME COUPON', },
                            { ico: '🎂', icoClass: '', title: '생일 기프트', desc: 'SILVER · GOLD 등급 회원분께는 매년 생일 달에 단독 기프트 바우처가 발급됩니다.', pts: 'SILVER · GOLD ONLY', },
                            { ico: '↻', icoClass: '', title: '자동 등급 갱신', desc: '새 주문이 발생할 때마다 멤버십 유효 기간이 12개월 자동 연장됩니다.', pts: 'AUTO RENEWAL · 12M', },
                        ].map((card) => (
                            <div key={card.title} className="bc-club-earn-card">
                                <div className={`bc-club-earn-ico${card.icoClass ? ' ' + card.icoClass : ''}`}>{card.ico}</div>
                                <div>
                                    <h4>{card.title}</h4>
                                    <p>{card.desc}</p>
                                    <span className="bc-club-earn-pts">{card.pts}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div className="bc-club-duo">
                        <div className="bc-club-duo-blk bc-club-duo-blk--welcome">
                            <div><p className="bc-club-duo-lbl">WELCOME GIFT</p><p className="bc-club-duo-title">신규 가입 즉시 받는 첫 쇼핑 쿠폰</p></div>
                            <p className="bc-club-duo-big">WELCOME</p>
                            <p>CASETiFY Club에 처음 합류하신 분께 드리는 단 한 번의 첫 구매 혜택입니다.</p>
                        </div>
                        <div className="bc-club-duo-blk bc-club-duo-blk--bday">
                            <div><p className="bc-club-duo-lbl">BIRTHDAY GIFT</p><p className="bc-club-duo-title">생일 달, 케이스티파이가 드리는 선물</p></div>
                            <p className="bc-club-duo-big">매년 ₩</p>
                            <p>SILVER 이상 등급 회원께 매년 생일 달 첫째 날 자동으로 발급됩니다.</p>
                        </div>
                    </div> */}
                </div>
            </section>

            {/* FAQ */}
            <section className="bc-club-faq">
                <div className="faq-inner">
                    <h2 className="section-heading">자주 묻는 질문(FAQ)</h2>
                    <div className="faq-accordion">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                                <button type="button" className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                                {openFaq === i && (
                                    <div className="faq-answer"><p>{faq.a}</p></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bc-club-cta">
                <div className="bc-inner">
                    <p className="bc-club-eyebrow">JOIN CASETiFY CLUB</p>
                    <h3>지금 바로,<br />CLUB의 일원이 되세요</h3>
                    <p>지금 바로 무료로 가입하고 등급별 다양한 혜택을 누려보세요.</p>
                    <div className="bc-club-cta-btns">
                        <button className="bc-club-cta-primary" onClick={() => navigate('/join')}>무료로 가입하기 →</button>
                        <button 
                        className="bc-club-cta-ghost" 
                            onClick={() => {
                                // 1. 페이지 이동 및 데이터(state) 전달
                                navigate('/brand/qna', { state: { activeTab: 'terms' } });
                                
                                // 2. 상단으로 스크롤 이동
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            >
                            멤버십 약관 보기
                        </button>
                    </div>
                    <p className="bc-club-cta-legal">* 본 페이지의 혜택 내용은 운영 정책에 따라 사전 고지 없이 변경될 수 있습니다.</p>
                </div>
            </section>
        </div>
    )
}

// ─── 체크 도트 (비교표용) ──────────────────────────────
function CheckDot({ on = false }) {
    return (
        <span className={`check${on ? ' on' : ''}`}>
            {on && (
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="2,6 5,9 10,3" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </span>
    )
}

// ─── 탭 정의 ─────────────────────────────────────────
const TABS = [
    { id: 'story', label: 'STORY' },
    { id: 'standard', label: 'STANDARD' },
    { id: 'recastify', label: 'RE:CASTiFY' },
    { id: 'club', label: 'CLUB' },
]

// ─── 메인 페이지 ─────────────────────────────────────
export default function BrandCasetify() {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'story')

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab)
            window.scrollTo({ top: 0, behavior: 'instant' })
        }
    }, [location.state?.tab])

    const handleTabChange = (id) => {
        setActiveTab(id)
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 0)
    }

    return (
        <div className="bc-page">
            <nav className="bc-tab-nav">
                <div className="bc-inner">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`bc-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>
            <div className="bc-tab-content">
                {activeTab === 'story' && <StoryTab />}
                {activeTab === 'standard' && <StandardTab />}
                {activeTab === 'recastify' && <RecastifyTab />}
                {activeTab === 'club' && <ClubTab />}
            </div>
        </div>
    )
}