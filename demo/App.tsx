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
        selectColor="#4f34eb"
        style={{ flex: 1, width: "100%" }}
      />
      <div>
        Régions sélectionnées :{" "}
        {selectedRegions.join(", ") || "Aucune région sélectionnée"}
      </div>
    </div>
  );
};
export default App;
