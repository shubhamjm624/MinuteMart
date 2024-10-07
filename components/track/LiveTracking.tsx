import Map from '@/components/map';
import { LatLngTuple } from 'leaflet';

const LiveTracking = () => {
  const routeCoordinates: LatLngTuple[] = [
    [48.8566, 2.3522],
    [48.8588443, 2.2943506],
    [48.8606111, 2.337644],
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="w-full max-w-4xl h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-lg overflow-hidden">
        <Map routeCoordinates={routeCoordinates} />
      </div>
    </div>
  );
};

export default LiveTracking;
