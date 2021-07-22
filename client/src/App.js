import Map from "./Map";
import { StateProvider } from "./state";

function App() {
  return (
    <div>
      <StateProvider>
        <Map
          zoom={11}
          center={{
            lat: 52.3558,
            lng: 4.8884
          }}
        />
      </StateProvider>
    </div>
  );
}

export default App;
