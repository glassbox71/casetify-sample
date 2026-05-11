import React, { useEffect, useState, useRef } from 'react';
import { useMapStore } from '../store/useMapStore';
import "./scss/MapPopup.scss"

export default function MapPopup({ onClose }) {
  const { selectedLocation } = useMapStore();

  if (!selectedLocation) return null;

  const popupRef = useRef(null);

  // 매장 정보 팝업 위치 상태관리
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDrag, setIsDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 초기 중앙 위치 계산

  const mapWrapRef = useRef(null);

  useEffect(() => {
    mapWrapRef.current = document.querySelector(".store-map-wrap");
  }, []);

  useEffect(() => {
    if (!popupRef.current || !mapWrapRef.current) return;

    requestAnimationFrame(() => {
      const rect = popupRef.current.getBoundingClientRect();
      const mapRect = mapWrapRef.current.getBoundingClientRect();

      setPosition({
        x: mapRect.width / 2 - rect.width / 2,
        // y: mapRect.height / 2 - rect.height / 2 - 16
        y: 16
      });
    });
  }, [selectedLocation]);

  // 드래그 이동
  useEffect(() => {
    const move = (e) => {
      if (!isDrag) return;
      if (!popupRef.current || !mapWrapRef.current) return;

      const popupWidth = popupRef.current.offsetWidth;
      const popupHeight = popupRef.current.offsetHeight;

      // 지도 영역 가져오기
      const mapRect = mapWrapRef.current.getBoundingClientRect();

      let newX = e.clientX - mapRect.left - offset.x;
      let newY = e.clientY - mapRect.top - offset.y;

      // 화면 범위 제한
      const maxX = mapRect.width - popupWidth;
      const maxY = mapRect.height - popupHeight;

      const mapPadding = 16

      newX = Math.max(mapPadding, Math.min(newX, maxX - mapPadding));
      newY = Math.max(mapPadding, Math.min(newY, maxY - mapPadding));

      setPosition({
        x: newX,
        y: newY
      });
    };

    const up = () => setIsDrag(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

  }, [isDrag, offset])

  // 마우스 이벤트 - 드래그 시작
  const handleMouseDown = (e) => {
    if (!mapWrapRef.current) return;

    setIsDrag(true);

    const mapRect = mapWrapRef.current.getBoundingClientRect();

    setOffset({
      x: e.clientX - mapRect.left - position.x,
      y: e.clientY - mapRect.top - position.y
    });
  };

  return (
    <div
      ref={popupRef}
      className='MapPopup'
      style={{ top: position.y, left: position.x }}
    >
      <div className="drag-area" onMouseDown={handleMouseDown}>
        {/* <div className="map-popup-title">
        <p>매장 상세정보</p>
        <button onClick={onClose}>
          <img src="../images/icon/close-24dp.svg" alt="닫기" />
        </button>
      </div> */}

        <button onClick={onClose}>
          <img src="../images/icon/close-24dp.svg" alt="닫기" />
        </button>

        <h2>{selectedLocation.name}</h2>

        <div className="store-img-area">
          <img src={selectedLocation.img} alt="" />
        </div>

        <div className="store-address-area">
          <span>주소</span>
          <p>{selectedLocation.address}</p>
        </div>
        <div className="store-hours-area">
          <span>영업시간</span>
          <div className="store-hours-info-area">
            <p>{selectedLocation.hours?.[0]}</p>
            <p>{selectedLocation.hours?.[1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}