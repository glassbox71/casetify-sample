import React, { useEffect, useState } from 'react'
import SectionTitle from '../SectionTitle'
import "../scss/NewArrival.scss"
import { Link } from 'react-router-dom';
import { StaggerContainer, StaggerItem } from '../StaggerList';
import FadeInSection from '../FadeInSection';

// new arrival 데이터
const newArrivalData = [
    { id: 1, icon: "./images/main/newArrival/charm-blue.png", bigImg: "./images/main/newArrival/bg-blue.png", bigItemImg: "./images/main/newArrival/item-blue.png", text: "DENIM MANIFESTO", itemColor: "denim", color: "#11419c", link: "/colab/fashion?mini=denim-manifesto" },
    { id: 2, icon: "./images/main/newArrival/charm-yellow.png", bigImg: "./images/main/newArrival/bg-yellow.png", bigItemImg: "./images/main/newArrival/item-yellow.png", text: "HI! FOREST", itemColor: "yellow", color: "#d2b452", link: "/colab/fashion?mini=hi-forest" },
    { id: 3, icon: "./images/main/newArrival/charm-red.png", bigImg: "./images/main/newArrival/bg-wine.png", bigItemImg: "./images/main/newArrival/item-wine.png", text: "PILLOW CASE", itemColor: "red", color: "#7F1D20", link: "/colab/fashion?mini=pillow-case" },
    { id: 4, icon: "./images/main/newArrival/charm-pink.png", bigImg: "./images/main/newArrival/bg-pink.png", bigItemImg: "./images/main/newArrival/item-pink.png", text: "SPRING IN BLOOM", itemColor: "pink", color: "#EACAD6", link: "/colab/fashion?mini=spring-in-bloom" },
]

export default function NewArrival() {
    // 현재 선택한 아이템
    const [activeTab, setActiveTab] = useState(newArrivalData[0].id);

    // fade 상태 파악
    const [fade, setFade] = useState(true);

    //현재 선택한 데이터
    const [activeItem, setActiveItem] = useState(newArrivalData.find(item => item.id === activeTab));

    // 이벤트 함수
    const handleChange = (id) => {
        if (id === activeTab) return;
        setFade(false);
        setActiveTab(id);
        setTimeout(() => {
            setFade(true);
            setActiveItem(newArrivalData.find(item => item.id === id));
        }, 400);
    };

    return (
        <section className="new-arrival">
            {/* <FadeInSection direction="up" delay={0.2}> */}
                <SectionTitle title={"New Arrival"} subtitle={"케이스티파이의 새로운 제품"} />
            {/* </FadeInSection> */}
            <div className="inner">
                <div className="new-arr-inner-wrap">
                    {/* <ul className="new-arr-list"> */}
                    <StaggerContainer className='new-arr-list'>
                        {newArrivalData.map((arridata) => (
                            <StaggerItem
                                key={arridata.id}
                                className={`arr-item ${activeTab === arridata.id ? "active" : ""}`}
                                onClick={() => handleChange(arridata.id)}
                                onMouseEnter={() => handleChange(arridata.id)}
                            >
                                {/* <li
                                key={arridata.id}
                                className={`arr-item ${activeTab === arridata.id ? "active" : ""}`}
                                onClick={() => handleChange(arridata.id)}
                                onMouseEnter={() => handleChange(arridata.id)}> */}
                                <Link to={arridata.link}>
                                    <img src={arridata.icon} alt={`icon_${arridata.itemColor}`} />
                                    <p className={`${arridata.itemColor}`}>{arridata.text}</p>
                                </Link>
                                {/* </li> */}
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                    {/* </ul> */}
                    <div className={`new-arr-img-box ${fade ? "fade-in" : "fade-out"}`}>
                        <Link to={activeItem.link}>
                            <img src={activeItem.bigImg} alt={`big_img_${activeItem.text}`} />
                            <span className={`bgitem-${activeItem.id}`}><img src={activeItem.bigItemImg} alt={`big_img_${activeItem.text}`} /></span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}