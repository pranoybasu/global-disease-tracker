import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, LayerGroup } from 'react-leaflet';
import type { CountryData, DiseaseType } from '../types';
import { getDiseaseConfig } from '../config/diseases';
import { Users, Activity, Heart, HeartCrack, Shield } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export type MapStyle = 'light' | 'color' | 'dark';
export type ScaleMode = 'linear' | 'logarithmic';
export type MomentumMode = 'none' | 'last1' | 'last3' | 'last7';

interface DiseaseMapProps {
  data: CountryData[];
  disease: DiseaseType;
  center?: [number, number];
  zoom?: number;
  mapStyle?: MapStyle;
  scaleMode?: ScaleMode;
  populationNormalized?: boolean;
  momentumMode?: MomentumMode;
  showProjected?: boolean;
  markerSize?: number;
  onMarkerClick?: (country: CountryData) => void;
}
export function DiseaseMap({
  data,
  disease,
  center = [20, 0],
  zoom = 2,
  mapStyle = 'light',
  scaleMode = 'logarithmic',
  populationNormalized = false,
  momentumMode = 'none',
  showProjected = false,
  markerSize = 50,
  onMarkerClick,
}: DiseaseMapProps) {
  // Get disease-specific configuration
  const diseaseConfig = getDiseaseConfig(disease);
  
  // Disease-specific colors from config
  const colors = useMemo(() => ({
    primary: diseaseConfig.colors.marker,
    primaryLight: diseaseConfig.colors.secondary,
    recovered: '#10b981', // Keep green for recovered
    deaths: '#000000', // Keep black for deaths
  }), [diseaseConfig.colors.marker, diseaseConfig.colors.secondary]);

  // Map style URLs
  const mapStyleUrls: Record<MapStyle, string> = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    color: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };

  // Calculate marker size based on case numbers
  const getMarkerSize = (cases: number, maxCases: number): number => {
    if (cases === 0 || maxCases === 0) return 0;
    
    let normalized = cases / maxCases;
    
    // Apply logarithmic scaling if enabled
    if (scaleMode === 'logarithmic') {
      normalized = Math.log10(1 + cases * 9) / Math.log10(1 + maxCases * 9);
    }
    
    // Apply population normalization if enabled
    // This is a placeholder - will be enhanced when population data is integrated
    
    return Math.sqrt(normalized) * markerSize;
  };

  // Find max values for normalization
  const maxCases = Math.max(...data.map((d) => d.cases), 1);
  const maxDeaths = Math.max(...data.map((d) => d.deaths), 1);
  const maxRecovered = Math.max(...data.map((d) => d.recovered), 1);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={mapStyleUrls[mapStyle]}
        />

        {/* Render markers for each country */}
        {data.map((country) => {
          const position: [number, number] = [
            country.countryInfo.lat,
            country.countryInfo.long,
          ];

          const confirmedSize = getMarkerSize(country.cases, maxCases);
          const recoveredSize = getMarkerSize(country.recovered, maxRecovered);
          const deathsSize = getMarkerSize(country.deaths, maxDeaths);

          return (
            <React.Fragment key={country.country}>
              {/* Deaths marker (black, innermost) */}
              {deathsSize > 0 && (
                <CircleMarker
                  center={position}
                  radius={Math.sqrt(deathsSize) * 0.5}
                  pathOptions={{
                    fillColor: colors.deaths,
                    fillOpacity: 0.8,
                    color: 'transparent',
                    weight: 0,
                  }}
                  eventHandlers={{
                    click: () => onMarkerClick?.(country),
                  }}
                />
              )}

              {/* Recovered marker (green, middle layer) */}
              {recoveredSize > 0 && (
                <CircleMarker
                  center={position}
                  radius={Math.sqrt(recoveredSize + deathsSize) * 0.5}
                  pathOptions={{
                    fillColor: colors.recovered,
                    fillOpacity: 0.5,
                    color: 'transparent',
                    weight: 0,
                  }}
                  eventHandlers={{
                    click: () => onMarkerClick?.(country),
                  }}
                />
              )}

              {/* Confirmed cases marker (disease-specific color, outermost) */}
              {confirmedSize > 0 && (
                <CircleMarker
                  center={position}
                  radius={Math.sqrt(confirmedSize) * 0.5}
                  pathOptions={{
                    fillColor: colors.primary,
                    fillOpacity: 0.5,
                    color: 'transparent',
                    weight: 0,
                  }}
                  eventHandlers={{
                    click: () => onMarkerClick?.(country),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                    <div className="text-sm">
                      <div className="font-bold mb-1 flex items-center gap-2">
                        {country.country}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span style={{ color: colors.primary }}>●</span>
                          <span className="text-gray-600">Cases:</span>
                          <span className="font-semibold">
                            {country.cases.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: colors.primaryLight }}>●</span>
                          <span className="text-gray-600">Active:</span>
                          <span className="font-semibold">
                            {country.active.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">●</span>
                          <span className="text-gray-600">Recovered:</span>
                          <span className="font-semibold">
                            {country.recovered.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">●</span>
                          <span className="text-gray-600">Deaths:</span>
                          <span className="font-semibold">
                            {country.deaths.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 pt-1 border-t">
                          Population: {country.population.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}