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
        margin: 0,
        padding: 0,
      }}
    >
      <FranceMap
        initialSelection={selectedRegions}
        onChange={setSelectedRegions}
        selectColor="#4f34eb"
        style={{ flex: 1 }}
      />
    </div>
  );
};
export default App;
