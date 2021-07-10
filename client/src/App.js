import Map from "./Map";

function App() {
  return (
    <div>
      <Map
        zoom={13}
        center={{
          lat: 52.3558,
          lng: 4.8884
        }}
      ></Map>
    </div>
  );
}

export default App;
