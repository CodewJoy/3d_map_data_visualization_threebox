import "./App.css";
import Map from "./components/Map";

export const magnitudeConfig = [
  { max: 2.5, color: "green" },
  { min: 2.5, max: 4.0, color: "yellow" },
  { min: 4.0, max: 5.5, color: "orange" },
  { min: 5.5, max: 7.0, color: "red" },
  { min: 7.0, color: "darkred" },
];

function App() {
  return (
    <div className="App">
      <h3 className="appBar">
        Earthquake data visualization with Threebox{" "}
        <a href="https://earthquake.usgs.gov/">Data Source</a>
      </h3>
      <div className="magnitude">
        <b>Magnitude</b>
        {magnitudeConfig.map((el) => (
          <div className="magnitudeRow">
            <div
              className="magnitudeColor"
              style={{ backgroundColor: el.color }}
            />
            {`${el.min || ""} ~ ${el.max || ""}`}
          </div>
        ))}
      </div>
      <main>
        <Map />
      </main>
    </div>
  );
}

export default App;
