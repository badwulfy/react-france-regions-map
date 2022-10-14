# React clickable france map

## Demo

![demo](https://github.com/badwulfy/react-france-regions-map/blob/main/demo.gif?raw=true)

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

## Run demo

```bash
git clone https://github.com/badwulfy/react-france-regions-map.git
cd react-france-regions-map
npm install
npm run demo
```
