
import { Link } from 'react-router-dom'
import SectionTitle from '../SectionTitle'
import "../scss/maintravel.scss"
import { StaggerContainer, StaggerItem, StaggerItemInsta } from '../StaggerList'
import FadeInSection from '../FadeInSection'

export default function Instagram() {
    return (
        <section className='instagram'>
            <div className="inner">
                {/* <FadeInSection direction="up" delay={0.2}> */}
                    <SectionTitle
                        title="INSTAGRAM"
                        subtitle="@casetify"
                        subLink="https://www.instagram.com/casetify_kr/"
                    />
                {/* </FadeInSection> */}
                {/* <ul> */}
                <StaggerContainer>
                    <StaggerItemInsta>
                    {/* <li> */}
                        <p>#ILLIT_WONHEE</p>
                        <video
                            src="./video/main-instagram1.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    {/* </li> */}
                    </StaggerItemInsta>
                    <StaggerItemInsta>
                    {/* <li> */}
                        <p>#Murakami World</p>
                        <video
                            src="./video/main-instagram2.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    {/* </li> */}
                    </StaggerItemInsta>
                    <StaggerItemInsta>
                    {/* <li> */}
                        <p>#RISABAE</p>
                        <video
                            src="./video/main-instagram3.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    {/* </li> */}
                    </StaggerItemInsta>
                    <StaggerItemInsta>
                    {/* <li> */}
                        <p>#Dex</p>
                        <video
                            src="./video/main-instagram4.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    {/* </li> */}
                    </StaggerItemInsta>
                    <StaggerItemInsta>
                    {/* <li> */}
                        <p>#Girls Sweet Date</p>
                        <video
                            src="./video/main-instagram5.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    {/* </li> */}
                    </StaggerItemInsta>
                </StaggerContainer>
                {/* </ul> */}
            </div>
        </section>
    )
}
