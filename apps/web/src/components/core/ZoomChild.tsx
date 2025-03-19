import { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

type Props = {
  setZoomLevel: (zoomLevel: number) => void;
  heading: number;
};

export const ZoomChild = ({ setZoomLevel, heading }: Props) => {
  const map = useMap();

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  useEffect(() => {
    map.invalidateSize();
    console.log('heading', heading);
  }, [heading]);

  return <></>;
};
