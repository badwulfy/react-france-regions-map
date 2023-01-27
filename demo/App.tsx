import FranceMap, { RegionKey } from "../src/FranceMap";
import React from "react";

const App = () => {
  const [selectedRegions, setSelectedRegions] = React.useState<RegionKey[]>([]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FranceMap
        initialSelection={selectedRegions}
        onChange={(regions) => {
          console.log(regions);
          setSelectedRegions(regions);
        }}
        style={{ flex: 1, width: "100%" }}
        map="france-drom"
        colors={{
          default: {
            color: "#4f34eb",
            fillColor: "#4f34eb",
            weight: 1,
          },
          hover: {
            color: "#23badb",
            fillColor: "#23badb",
            weight: 2,
          },
          selected: {
            color: "#1b00b5",
            fillColor: "#1b00b5",
            weight: 2,
          },
        }}
      />
      <div>
        Régions sélectionnées :{" "}
        {selectedRegions.join(", ") || "Aucune région sélectionnée"}
      </div>
    </div>
  );
};
export default App;
