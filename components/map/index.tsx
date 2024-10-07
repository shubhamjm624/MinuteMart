/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { LatLngTuple, LatLngBounds } from "leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useSocket } from '@/hooks/useSocket';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface Position {
  lat: number;
  lng: number;
}

interface MapProps {
  routeCoordinates: LatLngTuple[];
}

const Map = ({ routeCoordinates }: MapProps) => {
  const [route, setRoute] = useState<Position[]>([]);
  const { routePosition } = useSocket();
  const [startPoint, setStartPoint] = useState({ lat: 18.5196, lng: 73.8554 });
  const [endPoint, setEndPoint] = useState({ lat: 18.5295, lng: 73.8566 });

  const handleButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartPoint({ lat: 18.5196, lng: 73.8554 });
    setEndPoint({ lat: 18.5295, lng: 73.8566 });

    const response = await fetch('/api/send-coordinates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startPoint, endPoint }),
    });

    if (!response.ok) {
      console.error('Failed to send coordinates');
    }

    const data = await response.json();
    setRoute(data);
  };

  const center: LatLngTuple = routePosition
    ? [routePosition.lat, routePosition.lng]
    : [startPoint.lat, startPoint.lng];

  const MapControl = ({ route }: { route: Position[] }) => {
    const map = useMap();

    useEffect(() => {
      if (route.length > 0) {
        const bounds = new LatLngBounds(
          route.map(pos => [pos.lat, pos.lng] as LatLngTuple)
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, route]);

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white p-4">
      <div className="w-full h-[70vh] lg:h-[80vh] rounded-lg overflow-hidden shadow-xl border-4 border-white">
        <MapContainer
          center={center}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[startPoint.lat, startPoint.lng]}>
            <Popup>Start: Pune</Popup>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white" />
          </Marker>

          <Marker position={[endPoint.lat, endPoint.lng]}>
            <Popup>Destination: Mumbai</Popup>
          </Marker>

          {routePosition && (
            <Marker position={[routePosition.lat, routePosition.lng]}>
              <Popup>Current Location</Popup>
            </Marker>
          )}

          {route.length > 0 && (
            <>
              <Polyline positions={route.map(pos => [pos.lat, pos.lng])} color="white" weight={4} />
              <MapControl route={route} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
