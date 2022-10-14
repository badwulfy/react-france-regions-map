# React clickable france map

## Installation

```bash
npm install react-clickable-france-map
```

## Usage

```jsx
import React from "react";
import FranceMap from "react-france-regions-map";

const App = () => {
  const [selectedRegions, setSelectedRegions] = React.useState([]);

  return (
    <FranceMap
      initialSelection={selectedRegions}
      onChange={(regions) => {
        console.log("Selected regions", regions);
        setSelectedRegions(regions);
      }}
      selectColor="#4f34eb"
      style={{ width: "500px", height: "500px" }}
    />
  );
};

export default App;
```
