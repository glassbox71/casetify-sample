import { useEffect, useRef } from "react";
import "../scss/maintravel.scss";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle";
import FadeInSection from "../FadeInSection";

export default function MainTravel() {

    const videoRef = useRef(null);

    useEffect(() => {

        const handleScroll = () => {
            const rect = videoRef.current.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (
        <section className="travel">
            <div>
                <div className="travel-video">
                    <div className="logo-wrap">
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                    </div>
                    <Link to="/travel/suitcase">
                        <video
                            ref={videoRef}
                            className="travel-player"
                            src="./video/main-travel.mp4"
                            muted
                            loop
                            playsInline
                            poster="./images/main/travel.png"
                        />
                        <div className="travel-text">
                            {/* <FadeInSection direction="up" delay={0.2}> */}
                                <SectionTitle title={"Travel"} subtitle={"발걸음마다 예술이 되는 나만의 움직이는 캔버스"} />
                            {/* </FadeInSection> */}
                        </div>
                    </Link>
                    <div className="logo-wrap">
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                        <p>CASETiFY</p>
                    </div>
                </div>
            </div>
        </section>
    );
}