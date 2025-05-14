import React, { forwardRef, useState, useEffect } from "react";
import Map, { type MapRef, Source, Layer } from "react-map-gl/maplibre";
import type { Feature, GeoJsonProperties, LineString, Point } from "geojson";

interface LatLng {
  lat: number;
  lng: number;
}

export interface WalkingMapBoxProps {
  currentPosition: LatLng | null;
  path: LatLng[];
  isTracking: boolean;
  isCompleted?: boolean;
}

export const WalkingMapBox = forwardRef<MapRef, WalkingMapBoxProps>(
  ({ currentPosition, path, isTracking, isCompleted }, ref) => {
    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY!;

    // Map viewstate: pan during tracking
    const [viewState, setViewState] = useState({
      longitude: currentPosition?.lng ?? 127.024612,
      latitude: currentPosition?.lat ?? 37.5326,
      zoom: 16,
    });

    // Blink state for pulsing effect
    const [blink, setBlink] = useState(false);
    useEffect(() => {
      const id = setInterval(() => setBlink(b => !b), 300);
      return () => clearInterval(id);
    }, []);

    // Ignore missing sprite/icon errors
    useEffect(() => {
      const map = (ref as React.MutableRefObject<MapRef | null>).current?.getMap();
      map?.on("styleimagemissing", () => {});
    }, [ref]);

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

    const startGeoJSON: Feature<Point, GeoJsonProperties> | null = path[0]
      ? {
          type: "Feature",
          geometry: { type: "Point", coordinates: [path[0].lng, path[0].lat] },
          properties: {},
        }
      : null;

    const endGeoJSON: Feature<Point, GeoJsonProperties> | null = path.length > 1
      ? {
          type: "Feature",
          geometry: { type: "Point", coordinates: [path.at(-1)!.lng, path.at(-1)!.lat] },
          properties: {},
        }
      : null;

    const currentGeoJSON: Feature<Point, GeoJsonProperties> | null = currentPosition
      ? {
          type: "Feature",
          geometry: { type: "Point", coordinates: [currentPosition.lng, currentPosition.lat] },
          properties: {},
        }
      : null;

    return (
      <Map
        ref={ref}
        {...viewState}
        onMove={e => setViewState(e.viewState)}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`}
      >
        {/* 1) 경로: outline + main, with rounded caps */}
        {path.length > 1 && (
          <Source id="route" type="geojson" data={pathGeoJSON}>
            <Layer
              id="route-outline"
              type="line"
              layout={{ "line-cap": "round" }}
              paint={{ "line-color": "#fff", "line-width": 12 }}
            />
            <Layer
              id="route-main"
              type="line"
              layout={{ "line-cap": "round" }}
              paint={{ "line-color": "#fbb6b6", "line-width": 6 }}
            />
          </Source>
        )}

        {/* 2) 시작 지점 (초록): pulsing opacity */}
        {startGeoJSON && (
          <Source id="start-point" type="geojson" data={startGeoJSON}>
            <Layer
              id="start-circle"
              type="circle"
              paint={{
                "circle-radius": 8,
                "circle-color": "#22c55e",
                "circle-opacity": blink ? 1 : 0.4,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>
        )}

        {/* 3) 종료 지점 (빨강): pulsing opacity */}
        {endGeoJSON && (
          <Source id="end-point" type="geojson" data={endGeoJSON}>
            <Layer
              id="end-circle"
              type="circle"
              paint={{
                "circle-radius": 8,
                "circle-color": "#ef4444",
                "circle-opacity": blink ? 1 : 0.4,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>
        )}

        {/* 4) 현재 위치 (파랑): pulsing ring + solid dot */}
        {currentGeoJSON && (
          <Source id="current-point" type="geojson" data={currentGeoJSON}>
            <Layer
              id="current-pulse"
              type="circle"
              paint={{
                "circle-radius": blink ? 16 : 8,
                "circle-color": "#2563eb",
                "circle-opacity": blink ? 0.3 : 0,
              }}
            />
            <Layer
              id="current-circle"
              type="circle"
              paint={{
                "circle-radius": 6,
                "circle-color": "#2563eb",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>
        )}
      </Map>
    );
  }
);

WalkingMapBox.displayName = "WalkingMapBox";
