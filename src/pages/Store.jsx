import React, { useEffect, useState } from 'react'
import "./scss/Store.scss"
import "../components/sub/scss/storeMap.scss"
import StoreMap from '../components/sub/StoreMap'
import { studioPosData } from '../data/studioPosData'
import MapAddress from '../components/MapAddress'
import { useMapStore } from '../store/useMapStore'
import { useProductStore } from '../store/useProductStore'
import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Store() {
  const [show, setShow] = useState(false);
  const [areas, setArea] = useState([])
  // const [areaList, setAreaList] = useState([])

  // cleanup 매장정보 팝업
  const { clearSelectedLocation } = useMapStore();
  useEffect(() => {
    return () => {
      clearSelectedLocation();
    };
  }, [])

  const selectAllCity = "ALL";
  const [selectCity, setSelectCity] = useState(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  //########## 현재 위치 체크할 변수
  const [currentPos, setCurrentPos] = useState(null);

  // 매장 리스트 페이지 상태 변수
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { setSelectedLocation } = useMapStore();

  //######################## 거리
  const handleSelectArea = (area) => {
    const select = studioPosData
      .filter(item => item.storeArea === area)
      .map(item => {
        if (!currentPos) return item;

        const distance = getDistance(
          currentPos.lat,
          currentPos.lng,
          item.lat,
          item.lng
        );

        return {
          ...item,
          distance
        };
      });

    // setAreaList(select);

    // if (select.length > 0) {
    //   setSelectedLocation({
    //     name: select[0].storeName,
    //     lat: select[0].lat,
    //     lng: select[0].lng,
    //     address: select[0].storeAddress,
    //     hours: select[0].openHour,
    //     img: select[0].storeImg
    //   });
    // }  //지역 선택 시 setSelectedLocation 실행됨

    setShow(false);
    setSelectCity(area);
    setSortByDistance(false);
  };

  useEffect(() => {
    setArea(["전체", ...new Set(studioPosData.map(item => item.storeArea))])
    // console.log("지도내역", areas)
  }, [])

  // ############## 현 위치값 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        console.log("위치 실패", err);
      }
    );
  }, []);


  //############## 현 위치에서 매장까지의 거리 구하기
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  const handleShow = () => {
    setShow((prev) => !prev)
  }

  // 검색관련 변수
  const { searchWord, onSetSearchWord } = useProductStore();

  // const filteredList = searchWord ?
  //   areaList.filter((list) => list.storeName.toLowerCase().includes(searchWord.toLowerCase()))
  //   : areaList;

  const filteredList = studioPosData
    .map((store) => {
      if (!currentPos) return store;

      const distance = getDistance(
        currentPos.lat,
        currentPos.lng,
        store.lat,
        store.lng
      );

      return {
        ...store,
        distance
      };
    })
    .filter((store) => {
      const matchCity =
        !selectCity || selectCity === "전체" || store.storeArea === selectCity;

      const matchSearch =
        searchWord === "" ||
        store.storeName.toLowerCase().includes(searchWord.toLowerCase());

      return matchCity && matchSearch;
    })
    .sort((a, b) => {
      if (!sortByDistance) return 0;
      if (!a.distance || !b.distance) return 0;
      return a.distance - b.distance;
    });

  // 매장 리스트 페이지 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentList = filteredList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // 버튼 상태 조건
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // 필터 변경시 매장 리스트 페이지 처음으로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchWord, selectCity, sortByDistance]);

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className="sub-page-wrap store-page">
        <div className="store-map-wrap">
          <StoreMap />
          <div className="store-info-wrap">
            <div className="store-info-innerWrap">
              <div className="store-search-wrap">
                <label>
                  <input type="text" placeholder="매장지역 검색" value={searchWord} onChange={(e) => onSetSearchWord(e.target.value)} />
                </label>
                <div className="btn-search">
                  <img src="/images/icon/search_var.svg" alt="검색" />
                </div>
              </div>
              <div className="store-select-wrap">
                <div className='city-select'>
                  <button className="select-btn" onClick={handleShow}>
                    {/* <span>{selectCity}</span> */}
                    <span>
                      {!selectCity ? "지역을 선택하세요" : selectCity === selectAllCity ? "전체" : selectCity}
                    </span>
                    <span className={`arrow ${show ? "active" : ""}`}>
                      <img src="/images/icon/icon-arrow-down.svg" alt="arrow-icon" />
                    </span>
                  </button>
                  {show && <ul className='city-list'>
                    {areas.map((area, id) => (
                      <li key={id}><button
                        onClick={() => handleSelectArea(area)}>{area}</button></li>
                    ))}
                  </ul>
                  }
                </div>
                <div className={`near-list ${sortByDistance ? "active" : ""}`}>
                  <button className="select-btn" onClick={() => setSortByDistance(prev => !prev)}>
                    {/* <span>{sortByDistance ? "가까운 지점 정렬 ON" : "가까운 지점 정렬 OFF"}</span> */}
                    <span>가까운 지점 정렬</span>
                    {/* <span className="arrow"><img src="/images/icon/icon-arrow-down.svg" alt="arrow-icon" /></span> */}
                  </button>
                </div>
              </div>
              <div>
                {/* ############### <p>현재위치 사용</p>          
          (매장 리스트) */}
                <ul className="store-city-list">
                  {currentList.map((list, id) => (
                    <MapAddress sendList={list} key={id}
                    />
                  ))}
                </ul>
              </div>

              <div className="store-list-pager">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={isPrevDisabled}
                  className={isPrevDisabled ? "disabled" : ""}
                >
                  <img src="/images/store/Pager-Arrow_Prev.svg" alt="이전" />
                </button>
                <div className="pager-btn-area">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? "active" : ""}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={isNextDisabled}
                  className={isNextDisabled ? "disabled" : ""}
                >
                  <img src="/images/store/Pager-Arrow_Next.svg" alt="다음" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </motion.div>
  )
}