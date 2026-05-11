import React, { useEffect, useRef } from 'react';
import { useMapStore } from '../../store/useMapStore';
import MapPopup from '../MapPopup';
import "./scss/storeMap.scss"

export default function StoreMap() {
    const { locations, selectedLocation, setSelectedLocation, clearSelectedLocation } = useMapStore();

    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {

                const container = document.getElementById("map");

                //  처음 서울 기준
                const defaultCenter = new window.kakao.maps.LatLng(
                    37.5259162,
                    126.9284926
                );

                const map = new window.kakao.maps.Map(container, {
                    center: defaultCenter,
                    level: 7,
                });

                mapRef.current = map;

                // 기존 마커 제거
                markersRef.current.forEach(m => m.setMap(null));
                markersRef.current = [];

                // 여러 마커 생성
                locations.forEach((loc) => {
                    const position = new window.kakao.maps.LatLng(loc.lat, loc.lng);

                    //  마커 이미지 생성
                    const imageSrc = "/images/store/app-icon-marker.png"; //  이미지 경로
                    const imageSize = new window.kakao.maps.Size(40, 40); // 크기
                    const imageOption = {
                        offset: new window.kakao.maps.Point(20, 40) // 중심 위치
                    };

                    const markerImage = new window.kakao.maps.MarkerImage(
                        imageSrc,
                        imageSize,
                        imageOption
                    );

                    const marker = new window.kakao.maps.Marker({
                        map,
                        position,
                        image: markerImage
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div class="storeinfo-window">${loc.storeName}</div>`
                    });

                    // 마우스 오버
                    window.kakao.maps.event.addListener(marker, "mouseover", () => {
                        infowindow.open(map, marker);
                    });

                    window.kakao.maps.event.addListener(marker, "mouseout", () => {
                        infowindow.close();
                    });

                    // 클릭
                    window.kakao.maps.event.addListener(marker, "click", () => {
                        setSelectedLocation({
                            name: loc.storeName,
                            lat: loc.lat,
                            lng: loc.lng,
                            address: loc.storeAddress,
                            hours: loc.openHour,
                            img: loc.storeImg
                        });
                    });

                    markersRef.current.push(marker);
                });
            });
        };

        document.head.appendChild(script);
    }, []);

    // 선택된 매장 이동
    useEffect(() => {
        if (!selectedLocation || !mapRef.current) return;

        const moveLatLng = new window.kakao.maps.LatLng(
            selectedLocation.lat,
            selectedLocation.lng
        );

        mapRef.current.setCenter(moveLatLng);
    }, [selectedLocation]);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div id="map" style={{ width: "100%", height: "100%" }} />

            {selectedLocation && (
                <MapPopup
                    onClose={clearSelectedLocation}
                />
            )}
        </div>
    );
}