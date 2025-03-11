import { useMapEvents } from 'react-leaflet';

type Props = {
  setZoomLevel: (zoomLevel: number) => void;
};

export const ZoomChild = ({ setZoomLevel }: Props) => {
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  return <></>;
};
