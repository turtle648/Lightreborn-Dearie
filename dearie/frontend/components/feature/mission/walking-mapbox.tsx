import React, { forwardRef, useState, useEffect, useRef } from "react";
import Map, { type MapRef, Source, Layer } from "react-map-gl/maplibre";
import type { Feature, GeoJsonProperties, LineString, Point, FeatureCollection } from "geojson";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from 'maplibre-gl';
import type { MapDataEvent } from 'maplibre-gl';

interface CustomMapDataEvent extends MapDataEvent {
  sourceId?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface WalkingMapBoxProps {
  currentPosition: LatLng | null;
  path: LatLng[];
  isTracking: boolean;
  isCompleted?: boolean;
  onMapLoad?: () => void;
}

export const WalkingMapBox = forwardRef<MapRef, WalkingMapBoxProps>(
  ({ currentPosition, path, isTracking, isCompleted, onMapLoad }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Map viewstate: pan during tracking
    const [viewState, setViewState] = useState({
      longitude: currentPosition?.lng ?? 127.024612,
      latitude: currentPosition?.lat ?? 37.5326,
      zoom: 16,
    });

    // Blink state for pulsing effect
    const [blink, setBlink] = useState(false);
    useEffect(() => {
      const id = setInterval(() => setBlink(b => !b), 600);
      return () => clearInterval(id);
    }, []);

    // 부드러운 깜박임을 위한 opacity 계산
    const getOpacity = (baseOpacity: number) => {
      return blink ? baseOpacity : baseOpacity * 0.4;
    };

    // 맵 로딩 상태 추적
    const [mapLoaded, setMapLoaded] = useState(false);

    // 간단한 OpenStreetMap 스타일 사용 (모든 환경에서 동일하게)
    const mapStyle: StyleSpecification = {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [`https://tile.openstreetmap.org/{z}/{x}/{y}.png`],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap Contributors',
        }
      },
      layers: [{
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 19
      }]
    };

    // 맵 이벤트 처리 및 디버깅 향상
    useEffect(() => {
      const map = (ref as React.MutableRefObject<MapRef | null>).current?.getMap();
      if (!map) return;
      
      // 스타일 이미지 누락 오류 무시
      map.on("styleimagemissing", (e) => {
        console.log("스타일 이미지 누락 무시:", e.id);
      });
      
      // 맵 로드 완료 이벤트
      map.on('load', () => {
        console.log("맵 로드 완료");
        setMapLoaded(true);
        if (onMapLoad) onMapLoad();
      });
      
      // 맵 에러 처리
      map.on('error', (e) => {
        console.error("맵 에러:", e.error);
      });
      
      // 맵 렌더링 완료 이벤트 추가
      map.on('idle', () => {
        console.log("맵 렌더링 완료 (idle 이벤트)");
      });
      
      // 타일 로드 이벤트 추가
      map.on('data', (e: CustomMapDataEvent) => {
        if (e.dataType === 'source' && e.sourceId === 'raster-tiles') {
          console.log("타일 데이터 업데이트");
        }
      });
      
    }, [ref, onMapLoad]);

    // Pan to current position during tracking
    useEffect(() => {
      if (!isCompleted && currentPosition) {
        setViewState(vs => ({
          ...vs,
          longitude: currentPosition.lng,
          latitude: currentPosition.lat,
        }));
      }
    }, [currentPosition, isCompleted]);

    // Prepare GeoJSON features
    const pathGeoJSON: Feature<LineString, GeoJsonProperties> = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: path.map(p => [p.lng, p.lat]),
      },
      properties: {},
    };

    // 모든 포인트를 하나의 소스로 통합하여 렌더링 부하 감소
    const pointsGeoJSON: FeatureCollection<Point, { type: string }> = {
      type: "FeatureCollection" as const,
      features: [
        ...(path[0] ? [{
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [path[0].lng, path[0].lat] },
          properties: { type: "start" }
        }] : []),
        ...(path.length > 1 ? [{
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [path[path.length-1].lng, path[path.length-1].lat] },
          properties: { type: "end" }
        }] : []),
        ...(currentPosition ? [{
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [currentPosition.lng, currentPosition.lat] },
          properties: { type: "current" }
        }] : [])
      ]
    };

    return (
      <>
        <Map
          ref={ref}
          {...viewState}
          onMove={e => setViewState(e.viewState)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            visibility: "visible",
            display: "block"
          }}
          mapStyle={mapStyle}
        >
          {/* 경로 라인 */}
          {path.length > 1 && (
            <Source id="route" type="geojson" data={pathGeoJSON}>
              <Layer
                id="route-main"
                type="line"
                layout={{ "line-cap": "round" }}
                paint={{ 
                  "line-color": "#ff5555", 
                  "line-width": 4,
                  "line-opacity": 0.9  // 고정 opacity
                }}
              />
            </Source>
          )}

          {/* 모든 포인트를 하나의 소스로 통합 */}
          <Source id="points" type="geojson" data={pointsGeoJSON}>
            {/* 시작 포인트 (녹색) */}
            <Layer
              id="start-point"
              type="circle"
              filter={["==", ["get", "type"], "start"]}
              paint={{
                "circle-radius": 8,
                "circle-color": "#22c55e",
                "circle-opacity": getOpacity(0.9),
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
            
            {/* 종료 포인트 (빨간색) */}
            <Layer
              id="end-point"
              type="circle"
              filter={["==", ["get", "type"], "end"]}
              paint={{
                "circle-radius": 8,
                "circle-color": "#ef4444",
                "circle-opacity": getOpacity(0.9),
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
            
            {/* 현재 위치 (파란색) */}
            <Layer
              id="current-point"
              type="circle"
              filter={["==", ["get", "type"], "current"]}
              paint={{
                "circle-radius": 6,
                "circle-color": "#2563eb",
                "circle-opacity": getOpacity(0.9),
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>
        </Map>
        
        {/* 백업 캔버스 (숨김) - 경로 이미지 생성용 */}
        <canvas 
          ref={canvasRef} 
          width="600" 
          height="600" 
          style={{ display: 'none', position: 'absolute', top: -9999 }}
        />
      </>
    );
  }
);

WalkingMapBox.displayName = "WalkingMapBox";