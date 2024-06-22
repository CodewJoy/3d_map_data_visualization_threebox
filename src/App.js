import "./App.css";
import Map from "./components/Map";

function App() {
  return (
    <div className="App">
      <h3 className="appBar">
        Earthquake data visualization with Threebox{" "}
        <a href="https://earthquake.usgs.gov/">Data Source</a>
      </h3>
      <main>
        <Map />
      </main>
    </div>
  );
}

export default App;
