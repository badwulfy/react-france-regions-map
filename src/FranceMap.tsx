import React, { useEffect } from "react";
// import leaflet css and js
import { Feature } from "geojson";
import L, { Layer, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer } from "react-leaflet";

// @ts-ignore
import geojsonURL from "url:./france.geojson";
import { useStableCallback } from "./util";

export type RegionKey =
  | "Auvergne-Rhône-Alpes"
  | "Hauts-de-France"
  | "Provence-Alpes-Côte d'Azur"
  | "Grand-Est"
  | "Occitanie"
  | "Normandie"
  | "Nouvelle Aquitaine"
  | "Centre-Val de Loire"
  | "Bourgogne-Franche-Comté"
  | "Bretagne"
  | "Corse"
  | "Pays de la Loire"
  | "Île-de-France"
  | "Guadeloupe"
  | "Martinique"
  | "Guyane"
  | "La Réunion"
  | "Mayotte";

export interface FranceMapProps {
  initialSelection?: RegionKey[];
  onChange?: (region: RegionKey[]) => void;
  selectColor?: string;
  style?: React.CSSProperties;
}

const FranceMap = ({
  initialSelection = [],
  onChange = () => {},
  selectColor = "#fff494",
  style = {},
}: FranceMapProps) => {
  const LayerInitialStyle: PathOptions = {
    fillColor: selectColor,
    fillOpacity: 0.1,
    color: selectColor,
    weight: 2,
  };
  const LayerHoverStyle: PathOptions = {
    fillColor: selectColor,
    fillOpacity: 0.5,
    color: selectColor,
    weight: 2,
  };
  const LayerSelectedStyle: PathOptions = {
    fillColor: selectColor,
    fillOpacity: 0.8,
    color: selectColor,
    weight: 4,
  };

  const [franceRegions, setFranceRegions] = React.useState(null);
  const mapRef = React.useRef<L.Map>(null);

  const [selectedRegions, setSelectedRegions] =
    React.useState<RegionKey[]>(initialSelection);

  useEffect(() => {
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => {
        setFranceRegions(data);
      });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!franceRegions || !map) return;

    map.fitBounds(L.geoJSON(franceRegions).getBounds(), {
      padding: [10, 10],
    });
  }, [franceRegions, mapRef]);

  const getFeaureKey = (e: L.LeafletEvent) => {
    const layer = e.target as L.GeoJSON;
    if (!layer.feature) return "" as RegionKey;
    const feature = layer.feature as Feature;
    const key = feature.properties?.key;
    if (!key) return "" as RegionKey;
    return key as RegionKey;
  };

  const handleAdd = useStableCallback((e: L.LeafletEvent): void => {
    const key = getFeaureKey(e);
    // add or remove layer from selected regions
    if (selectedRegions.includes(key)) e.target.setStyle(LayerSelectedStyle);
    else e.target.setStyle(LayerInitialStyle);
  });

  const handleMouseHover = useStableCallback((e: L.LeafletMouseEvent): void => {
    const key = getFeaureKey(e);

    if (selectedRegions.includes(key)) return;
    (e.target as L.GeoJSON).setStyle(LayerHoverStyle);
  });

  const handleMouseOut = useStableCallback((e: L.LeafletMouseEvent): void => {
    const key = getFeaureKey(e);

    if (selectedRegions.includes(key)) return;
    (e.target as L.GeoJSON).setStyle(LayerInitialStyle);
  });

  const handleClick = useStableCallback((e: L.LeafletMouseEvent): void => {
    const key = getFeaureKey(e);

    // add or remove layer from selected regions
    if (selectedRegions.includes(key)) {
      const newSelectedRegions = selectedRegions.filter((r) => r !== key);
      setSelectedRegions(newSelectedRegions);
      e.target.setStyle(LayerHoverStyle);
      onChange(newSelectedRegions);
    } else {
      const newSelectedRegions = [...selectedRegions, key];
      setSelectedRegions(newSelectedRegions);
      e.target.setStyle(LayerSelectedStyle);
      onChange(newSelectedRegions);
    }
  });

  // colorize regions on hover
  const onEachFeature = (_: Feature, layer: Layer) => {
    layer.on({
      add: handleAdd,
      mouseover: handleMouseHover,
      mouseout: handleMouseOut,
      click: handleClick,
    });
  };

  return (
    <MapContainer
      style={{
        userSelect: "none",
        background: "transparent",
        ...style,
      }}
      center={[0, 0]}
      zoom={6}
      zoomSnap={0.1}
      scrollWheelZoom={false}
      ref={mapRef}
      // disable drag and zoom handlers
      dragging={false}
      zoomControl={false}
      touchZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      attributionControl={false}
    >
      <>
        {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}

        {/* add the geojson layer to the map */}
        {franceRegions && (
          <GeoJSON data={franceRegions} onEachFeature={onEachFeature} />
        )}
      </>
    </MapContainer>
  );
};

export default FranceMap;
