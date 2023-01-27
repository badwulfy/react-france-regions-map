import React, { useEffect } from "react";
// import leaflet css and js
import { Feature } from "geojson";
import L, { Layer, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer } from "react-leaflet";

const franceDROMUrl = new URL("./france-drom.geojson", import.meta.url).href;
const franceUrl = new URL("./france.geojson", import.meta.url).href;
import { useStableCallback } from "./util";
import _ from "lodash";

// All France regions keys
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
  initialSelection?: RegionKey[]; // Initial selected regions
  onChange?: (region: RegionKey[]) => void; // Callback when selected regions change
  style?: React.CSSProperties; // Style of the map container
  colors?: {
    selected?: PathOptions;
    hover?: PathOptions;
    default?: PathOptions;
  };
  map?: "france" | "france-drom"; // Map to display
}

const FranceMap = ({
  initialSelection = [],
  onChange = () => {},
  colors = {},
  style = {},
  map = "france",
}: FranceMapProps) => {
  colors = _.merge(
    {
      default: {
        fillColor: "#fff494",
        color: "#fff494",
        fillOpacity: 0.1,
        weight: 2,
      },
      hover: {
        fillColor: "#fff494",
        color: "#fff494",
        fillOpacity: 0.5,
        weight: 2,
      },
      selected: {
        fillColor: "#fff494",
        color: "#fff494",
        fillOpacity: 0.8,
        weight: 4,
      },
    },
    colors
  );

  // style of unselected regions
  const LayerInitialStyle = colors.default as PathOptions;
  // style of on hover regions
  const LayerHoverStyle = colors.hover as PathOptions;
  // style of selected regions
  const LayerSelectedStyle = colors.selected as PathOptions;

  // ref of leaflet map instance
  const mapRef = React.useRef<L.Map>(null);

  const [franceRegions, setFranceRegions] = React.useState(null);
  const [selectedRegions, setSelectedRegions] =
    React.useState<RegionKey[]>(initialSelection);

  useEffect(() => {
    const url = map === "france" ? franceUrl : franceDROMUrl;

    // load france regions geojson
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setFranceRegions(data);
      });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!franceRegions || !map) return;

    // function to fit map to france regions
    const fitMap = () =>
      map.fitBounds(L.geoJSON(franceRegions).getBounds(), {
        padding: [10, 10],
      });

    // fit after map is loaded
    fitMap();

    // fit after window is resized
    window.addEventListener("resize", fitMap);
    // remove listener on unmount
    return () => window.removeEventListener("resize", fitMap);
  }, [franceRegions, mapRef]);

  // get region key from event on geojson layer
  const getFeaureKey = (e: L.LeafletEvent) => {
    const layer = e.target as L.GeoJSON;
    if (!layer.feature) return "" as RegionKey;
    const feature = layer.feature as Feature;
    const key = feature.properties?.key;
    if (!key) return "" as RegionKey;
    return key as RegionKey;
  };

  // callback when a region is added to map
  const handleAdd = useStableCallback((e: L.LeafletEvent): void => {
    const key = getFeaureKey(e);
    // add or remove layer from selected regions
    if (selectedRegions.includes(key)) e.target.setStyle(LayerSelectedStyle);
    else e.target.setStyle(LayerInitialStyle);
  });

  // callback when a mouse enter a region
  const handleMouseHover = useStableCallback((e: L.LeafletMouseEvent): void => {
    const key = getFeaureKey(e);

    if (selectedRegions.includes(key)) return;
    (e.target as L.GeoJSON).setStyle(LayerHoverStyle);
  });

  // callback when a mouse leave a region
  const handleMouseOut = useStableCallback((e: L.LeafletMouseEvent): void => {
    const key = getFeaureKey(e);

    if (selectedRegions.includes(key)) return;
    (e.target as L.GeoJSON).setStyle(LayerInitialStyle);
  });

  // callback when a region is clicked
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

  // add event listeners to geojson layer
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
      {/* add the geojson layer to the map */}
      {franceRegions && (
        <GeoJSON data={franceRegions} onEachFeature={onEachFeature} />
      )}
    </MapContainer>
  );
};

export default FranceMap;
