import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Note: User needs to add Mapbox token
    // For now, we'll show a placeholder message
    const needsToken = !mapboxgl.accessToken || mapboxgl.accessToken === '';

    if (needsToken) {
      return;
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe' as any,
      zoom: 2,
      center: [0, 20],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(30, 41, 59)',
        'high-color': 'rgb(51, 65, 85)',
        'horizon-blend': 0.1,
      });
    });

    // Sample flight markers (demo)
    const flights = [
      { coords: [-74.006, 40.7128], name: 'JFK - New York' },
      { coords: [-0.1276, 51.5074], name: 'LHR - London' },
      { coords: [139.6917, 35.6762], name: 'NRT - Tokyo' },
      { coords: [2.3522, 48.8566], name: 'CDG - Paris' },
    ];

    flights.forEach(flight => {
      const el = document.createElement('div');
      el.className = 'flight-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = 'hsl(199, 89%, 48%)';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 10px hsl(199, 89%, 48%)';
      el.style.cursor = 'pointer';

      new mapboxgl.Marker(el)
        .setLngLat(flight.coords as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div style="color: white; background: hsl(220, 20%, 12%); padding: 8px; border-radius: 4px;">${flight.name}</div>`)
        )
        .addTo(map.current!);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border/50">
      {!mapboxgl.accessToken ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm z-10 p-8 text-center">
          <MapPin className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">Map Requires API Key</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            To display the interactive flight map, please add your Mapbox public token.
          </p>
          <div className="bg-muted/30 p-4 rounded-lg max-w-md">
            <p className="text-sm text-muted-foreground">
              Get your free token at{' '}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      ) : null}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapView;
