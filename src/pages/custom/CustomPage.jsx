import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './scss/CustomPage.scss'

const DEVICE_VIDEOS = {
    phone: '/images/custom/phonecustom.mp4',
    laptop: '/images/custom/macbookcustom.mp4',
    tablet: '/images/custom/Tabletcustom.mp4',
}

// 임시 = 영상으로교체예정
const DEVICE_IMAGES = {
    tablet: '/images/custom/Tabletcustom.png',
}

export default function CustomPage() {
    const navigate = useNavigate()
    const [activeVideo, setActiveVideo] = useState('phone')

    // ✅ A/B 두 개의 video ref — 번갈아 사용해서 크로스페이드
    const videoA = useRef(null)
    const videoB = useRef(null)
    // 현재 보이는 레이어 ('a' or 'b')
    const currentLayer = useRef('a')
    // 전환 중 잠금
    const isTransitioning = useRef(false)
    // 전환 중 들어온 마지막 요청
    const pendingKey = useRef(null)

    const devices = [
        { key: 'phone', label: '핸드폰', img: '/images/category/mini/phone.png', desc: 'iPhone · Galaxy' },
        { key: 'laptop', label: '노트북', img: '/images/category/mini/laptop.png', desc: 'MacBook' },
        { key: 'tablet', label: '태블릿', img: '/images/category/mini/tablet.png', desc: 'iPad' },
    ]

    // ✅ 크로스페이드 전환
    const switchVideo = useCallback((key) => {
        const a = videoA.current
        const b = videoB.current
        if (!a || !b) return

        isTransitioning.current = true

        // 현재 레이어가 A면 → B에 새 영상 준비
        const isCurrentA = currentLayer.current === 'a'
        const incoming = isCurrentA ? b : a
        const outgoing = isCurrentA ? a : b

        // 새 영상 로드 (아직 숨긴 상태)
        incoming.src = DEVICE_VIDEOS[key]
        incoming.load()

        incoming.oncanplaythrough = () => {
            incoming.play().catch(() => { })

            // 새 영상 페이드인
            incoming.style.opacity = '1'
            // 기존 영상 페이드아웃
            outgoing.style.opacity = '0'

            currentLayer.current = isCurrentA ? 'b' : 'a'
            setActiveVideo(key)

            // transition 끝난 뒤 잠금 해제 + 펜딩 처리
            setTimeout(() => {
                outgoing.pause()
                outgoing.src = ''
                isTransitioning.current = false

                if (pendingKey.current) {
                    const next = pendingKey.current
                    pendingKey.current = null
                    switchVideo(next)
                }
            }, 600) // CSS transition 시간과 동일하게
        }
    }, [])

    // ✅ 호버 핸들러
    const handleVideoChange = useCallback((key) => {
        if (key === activeVideo && !isTransitioning.current) return
        if (key === activeVideo) return

        if (isTransitioning.current) {
            pendingKey.current = key
            return
        }
        switchVideo(key)
    }, [activeVideo, switchVideo])

    // ✅ 초기 마운트 — A레이어에 첫 영상 로드
    useEffect(() => {
        const a = videoA.current
        if (!a) return
        a.src = DEVICE_VIDEOS['phone']
        a.load()
        a.play().catch(() => { })
        a.style.opacity = '1'
    }, [])

    return (
        <div className="custom-page">
            <section className="custom-hero">

                {/* ✅ A 레이어 */}
                <video
                    ref={videoA}
                    className="custom-hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                />
                {/* ✅ B 레이어 */}
                <video
                    ref={videoB}
                    className="custom-hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                />

                <div className="custom-hero-overlay" />

                <div className="custom-hero-text">
                    <p className="custom-hero-sub" style={{ animationDelay: '0.1s' }}>MAKE IT YOURS</p>
                    <h2 style={{ animationDelay: '0.35s' }}>Customize</h2>
                    <p className="cus-title" style={{ animationDelay: '0.6s' }}></p>
                    <p style={{ animationDelay: '0.75s' }}>사진과 글귀들로 세상에 하나뿐인 케이스를 만들어보세요</p>
                </div>

                <div className="custom-content">
                    <div className="custom-section">
                        {/* <h2 className="fade-up" style={{ animationDelay: '0.9s' }}>
                            커스텀할 기종을 선택해주세요
                        </h2> */}
                    </div>
                    <div className="device-cards">
                        {devices.map((d, i) => (
                            <button
                                key={d.key}
                                className="device-card fade-up"
                                style={{ animationDelay: `${0.9 + i * 0.12}s` }}
                                onMouseEnter={() => handleVideoChange(d.key)}
                                onClick={() => navigate('/custom/studio', { state: { deviceType: d.key } })}
                            >
                                <div className="device-img-wrap">
                                    <img src={d.img} alt={d.label} loading="eager" />
                                </div>
                                <span className="device-label">{d.label}</span>
                                <span className="device-desc">{d.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    )
}