# React France Regions Map

## Demo

![demo](https://github.com/badwulfy/react-france-regions-map/blob/main/demo.gif?raw=true)

## Installation

```bash
npm i react-france-regions-map
```

## Usage

See `demo/App.tsx`

```javascript
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
        color: "#82db23",
        fillColor: "#82db23",
        weight: 2,
      },
    }}
  />
  <div>
    Régions sélectionnées :{" "}
    {selectedRegions.join(", ") || "Aucune région sélectionnée"}
  </div>
</div>
```

## Run demo

```bash
git clone https://github.com/badwulfy/react-france-regions-map.git
cd react-france-regions-map
npm install
npm run demo
```
