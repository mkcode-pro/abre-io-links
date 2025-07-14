import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MapboxMapProps {
  data: { country: string; clicks: number }[];
  className?: string;
}

export function MapboxMap({ data, className = '' }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [30, 15],
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(30, 30, 40)',
          'high-color': 'rgb(50, 50, 70)',
          'horizon-blend': 0.2,
        });

        // Add click data points
        data.forEach((item, index) => {
          // Simple country coordinate mapping (in a real app, use a proper geocoding service)
          const coordinates = getCountryCoordinates(item.country);
          if (coordinates) {
            // Create a marker with size based on clicks
            const size = Math.min(Math.max(item.clicks / 10, 10), 50);
            
            const marker = new mapboxgl.Marker({
              color: '#3b82f6',
              scale: size / 20,
            })
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  `<div class="p-2">
                    <h3 class="font-semibold">${item.country}</h3>
                    <p>${item.clicks} cliques</p>
                  </div>`
                )
              )
              .addTo(map.current!);
          }
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erro no Mapa",
        description: "Token do Mapbox inválido ou erro na inicialização",
        variant: "destructive",
      });
    }
  };

  const handleSaveToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setTokenSaved(true);
      initializeMap();
      toast({
        title: "Token Salvo",
        description: "Token do Mapbox salvo com sucesso!",
      });
    }
  };

  useEffect(() => {
    // Try to load token from localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setTokenSaved(true);
    }
  }, []);

  useEffect(() => {
    if (tokenSaved && mapboxToken) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [tokenSaved, mapboxToken, data]);

  // Simple country coordinates mapping
  const getCountryCoordinates = (country: string): [number, number] | null => {
    const coordinates: Record<string, [number, number]> = {
      'Brazil': [-14.2350, -51.9253],
      'United States': [39.8283, -98.5795],
      'United Kingdom': [55.3781, -3.4360],
      'Germany': [51.1657, 10.4515],
      'France': [46.2276, 2.2137],
      'Spain': [40.4637, -3.7492],
      'Italy': [41.8719, 12.5674],
      'Canada': [56.1304, -106.3468],
      'Australia': [-25.2744, 133.7751],
      'Japan': [36.2048, 138.2529],
      'India': [20.5937, 78.9629],
      'China': [35.8617, 104.1954],
      'Russia': [61.5240, 105.3188],
      'Mexico': [23.6345, -102.5528],
      'Argentina': [-38.4161, -63.6167],
    };
    
    return coordinates[country] || null;
  };

  if (!tokenSaved) {
    return (
      <div className={`bg-card/50 backdrop-blur-sm rounded-lg border p-6 ${className}`}>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Configurar Mapa Geográfico</h3>
          <p className="text-muted-foreground text-sm">
            Para visualizar o mapa de calor geográfico, você precisa de um token público do Mapbox.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Token Público do Mapbox</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveToken} disabled={!mapboxToken.trim()}>
              Salvar Token
            </Button>
            <p className="text-xs text-muted-foreground">
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Obtenha seu token gratuito no Mapbox
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
}