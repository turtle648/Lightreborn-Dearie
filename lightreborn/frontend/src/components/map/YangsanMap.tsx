'use client'

import { colors } from '@/constants/colors';
import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '@/stores/useMapStore';
import { DongInfo } from '@/utils/dongCodeMap';

// 마커 데이터 타입 정의
export interface MarkerPoint {
  name: string;
  latitude: number;
  longitude: number;
  type?: string; // 마커 유형 (예: '홍보거점', '복지관' 등)
}

interface YangsanMapProps {
  points?: MarkerPoint[]; // 지도에 표시할 마커 포인트 데이터
  showMarkers?: boolean; // 마커 표시 여부
  markerColor?: string; // 마커 색상
  onMarkerClick?: (point: MarkerPoint) => void; // 마커 클릭 이벤트 핸들러
}

const YangsanMap = ({ 
  points = [], 
  showMarkers = true,
  markerColor = colors.primary.main,
  onMarkerClick
}: YangsanMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { selectedDongCode, setSelectedDongCode } = useMapStore();
  const [naverMap, setNaverMap] = useState<any>(null);

  // 마커 객체들을 관리하기 위한 ref
  const markersRef = useRef<any[]>([]);

  // 마커 생성 및 업데이트 함수
  const updateMarkers = (map: any, markerPoints: MarkerPoint[]) => {
    if (!map) return;
    
    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    if (!showMarkers || markerPoints.length === 0) return;
    
    const { naver } = window as any;
    
    // 새 마커 생성
    markerPoints.forEach((point, index) => {
      const position = new naver.maps.LatLng(point.latitude, point.longitude);
      
      // 마커 아이콘 설정
      const markerOptions = {
        position,
        map,
        icon: {
          content: `
            <div style="
              width: 12px;
              height: 12px;
              background-color: ${markerColor};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            "></div>
          `,
          anchor: new naver.maps.Point(6, 6) // 아이콘 중앙 위치 조정
        },
        zIndex: 100,
        title: point.name
      };
      
      const marker = new naver.maps.Marker(markerOptions);
      
      // 마커 클릭 이벤트
      if (onMarkerClick) {
        naver.maps.Event.addListener(marker, 'click', () => {
          onMarkerClick(point);
        });
      }
      
      // 마커에 툴팁 추가
      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding: 8px; font-size: 12px; background: white; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">${point.name}</div>`,
        borderWidth: 0,
        disableAnchor: true,
        backgroundColor: 'transparent',
      });
      
      // 마커 호버 이벤트
      naver.maps.Event.addListener(marker, 'mouseover', () => {
        infoWindow.open(map, marker);
      });
      
      naver.maps.Event.addListener(marker, 'mouseout', () => {
        infoWindow.close();
      });
      
      markersRef.current.push(marker);
    });
  };

  // 마커 데이터가 변경되면 마커 업데이트
  useEffect(() => {
    updateMarkers(naverMap, points);
  }, [naverMap, points, showMarkers, markerColor]);

  useEffect(() => {
    const initMap = async () => {
      const { naver } = window as any;

      // 지도 스타일 정의
      const mapOptions = {
        zoom: 11,
        center: new naver.maps.LatLng(35.39 , 129.04), // 양산시 중심 좌표
        mapTypeId: naver.maps.MapTypeId.TERRAIN,
        baseTileOpacity: 0.7,
        mapDataControl: false,
        scaleControl: false,
        logoControl: false,
        mapTypeControl: false,
        zoomControl: false,
        scrollWheel: false, // 확대/축소 비활성화
        draggable: true, // 드래그 이동 활성화
        keyboardShortcuts: false, // 키보드 이벤트 비활성화 (화살표 키로 이동 방지)
        disableDoubleClickZoom: true, // 더블클릭 확대 비활성화
        pinchZoom: false, // 핀치 줌 비활성화 (터치 디바이스)
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: {
              saturation: -80,
              lightness: 20
            }
          },
          {
            featureType: 'road',
            elementType: 'all',
            stylers: {
              visibility: 'simplified',
              saturation: -90
            }
          }
        ]
      };

      const map = new naver.maps.Map(mapRef.current, mapOptions);
      setNaverMap(map); // 지도 객체 저장

      // 전체 지도 범위
      const worldBounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(-90, -180),
        new naver.maps.LatLng(90, 180)
      );

      // 외부 오버레이
      const outerOverlay = new naver.maps.Rectangle({
        map: map,
        bounds: worldBounds,
        strokeOpacity: 0,
        fillColor: '#ffffff',
        fillOpacity: 0.50,
        zIndex: 1
      });

      // 툴팁 디자인
      const tooltip = document.createElement('div');
      tooltip.style.cssText = `
        position: absolute;
        z-index: 1000;
        padding: 10px 14px;
        background: ${colors.background.default};
        border-left: 4px solid ${colors.primary.main};
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        color: ${colors.text.primary};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        pointer-events: none;
        display: none;
        transition: all 0.2s ease;
      `;
      map.getPanes().floatPane.appendChild(tooltip);

      // 선택된 지역 정보를 저장할 변수
      let selectedFeature: any = null;

      const startDataLayer = (geojson: { features: any[] }) => {
        // 지역 코드와 이름을 저장할 객체
        const dongInfoMap: Record<string, DongInfo> = {};

        // 지역 스타일 함수
        const getRegionStyle = (isSelected: boolean = false, isHovered: boolean = false) => {
          const fillColor = colors.primary.main;
          
          let fillOpacity = 0.3;
          let strokeColor = colors.text.secondary;
          let strokeWeight = 1;
          
          if (isSelected) {
            fillOpacity = 0.8;
            strokeColor = colors.primary.main;
            strokeWeight = 2;
          } else if (isHovered) {
            fillOpacity = 0.5;
            strokeColor = colors.primary.main;
            strokeWeight = 1.5;
          }
          
          return {
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            strokeColor: strokeColor,
            strokeWeight: strokeWeight,
            strokeOpacity: 0.9,
            zIndex: isSelected ? 100 : (isHovered ? 50 : 10)
          };
        };

        // 지역 데이터를 미리 파싱
        geojson.features.forEach((feature) => {
          const fullRegionName = feature.properties.adm_nm || '';
          const regionName = fullRegionName.replace('경상남도 양산시 ', '');
          const regionCode = feature.properties.adm_cd2 || '';
          
          dongInfoMap[regionName] = {
            name: regionName,
            code: regionCode,
            fullName: fullRegionName
          };
        });

        // 기본 스타일 설정
        map.data.setStyle((feature: any) => {
          const fullRegionName = feature.getProperty('adm_nm') || '';
          const regionName = fullRegionName.replace('경상남도 양산시 ', '');
          const isSelected = regionName === selectedRegion;
          return getRegionStyle(isSelected, false);
        });

        // GeoJSON 데이터 추가
        map.data.addGeoJson(geojson);

        // store에서 선택된 지역이 있을 경우 지도에 반영
        if (selectedDongCode) {
          const regionToSelect = Object.values(dongInfoMap).find(info => 
            info.code === selectedDongCode || info.name === selectedDongCode
          );
          
          if (regionToSelect) {
            setSelectedRegion(regionToSelect.name);
            
            // 해당 지역 찾아서 스타일 적용
            map.data.forEach((feature: any) => {
              const fullRegionName = feature.getProperty('adm_nm') || '';
              const regionName = fullRegionName.replace('경상남도 양산시 ', '');
              
              if (regionName === regionToSelect.name) {
                selectedFeature = feature;
                map.data.overrideStyle(feature, getRegionStyle(true, false));
              }
            });
          }
        }

        // 마우스 오버 이벤트
        map.data.addListener('mouseover', (e: any) => {
          const feature = e.feature;
          const fullRegionName = feature.getProperty('adm_nm') || '';
          const regionName = fullRegionName.replace('경상남도 양산시 ', '');
          
          tooltip.innerHTML = `<div>${regionName}</div>`;
          tooltip.style.display = 'block';
          tooltip.style.left = `${e.offset.x}px`;
          tooltip.style.top = `${e.offset.y}px`;
          
          if (regionName !== selectedRegion) {
            map.data.overrideStyle(feature, getRegionStyle(false, true));
          }
        });

        // 마우스 아웃 이벤트
        map.data.addListener('mouseout', (e: any) => {
          tooltip.style.display = 'none';
          
          const feature = e.feature;
          const fullRegionName = feature.getProperty('adm_nm') || '';
          const regionName = fullRegionName.replace('경상남도 양산시 ', '');
          
          if (regionName !== selectedRegion) {
            map.data.overrideStyle(feature, getRegionStyle(false, false));
          }
        });

        // 클릭 이벤트
        map.data.addListener('click', (e: any) => {
          const feature = e.feature;
          const fullRegionName = feature.getProperty('adm_nm') || '';
          const regionName = fullRegionName.replace('경상남도 양산시 ', '');
          const regionCode = feature.getProperty('adm_cd2') || '';
          
          if (regionName === selectedRegion) {
            // 선택 해제
            setSelectedRegion(null);
            setSelectedDongCode(null); // 스토어에도 반영
            selectedFeature = null;
            
            map.data.forEach((f: any) => {
              map.data.overrideStyle(f, getRegionStyle(false, false));
            });
          } else {
            // 새 지역 선택
            setSelectedRegion(regionName);
            setSelectedDongCode(regionCode); // 스토어에 코드 값 저장
            
            if (selectedFeature) {
              map.data.overrideStyle(selectedFeature, getRegionStyle(false, false));
            }
            
            map.data.overrideStyle(feature, getRegionStyle(true, false));
            selectedFeature = feature;
          }
          
          console.log(`선택된 지역: ${regionName}, 코드: ${regionCode}`);
        });
      };

      // 양산시 구 경계 데이터 로드
      try {
        const response = await fetch('/data/yangsan_districts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const geojson = await response.json();
        startDataLayer(geojson);
        
        // 마커 초기화
        if (points.length > 0 && showMarkers) {
          updateMarkers(map, points);
        }
      } catch (error) {
        console.error('양산시 구 경계 데이터 로드 실패:', error);
      }
    };

    // 네이버 지도 API 로드
    if ((window as any).naver) {
      initMap();
    } else {
      const script = document.createElement('script');
      const YOUR_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${YOUR_CLIENT_ID}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [selectedRegion, selectedDongCode, setSelectedDongCode]);

  return (
    <div className="map-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} id="map" style={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }} />
      <div className="map-info" style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        background: colors.background.default,
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 500,
        minWidth: '180px'
      }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: colors.text.primary }}>
          양산시 지역 지도
        </div>
        <div style={{ fontSize: '13px', color: colors.text.secondary }}>
          {selectedRegion ? `선택된 지역: ${selectedRegion}` : '지역을 클릭하여 선택하세요'}
        </div>
        {points.length > 0 && (
          <div style={{ fontSize: '13px', color: colors.text.secondary, marginTop: '4px' }}>
            표시된 마커: {points.length}개
          </div>
        )}
      </div>
    </div>
  );
};

export default YangsanMap;