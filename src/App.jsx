import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { ImageOverlay } from "react-leaflet";
import grass from "/simplegrass.jpg";
import L from "leaflet";
import treeIconImg from "/tree.jpeg"; // put your tree.png in /public

const treeIcon = L.icon({
  iconUrl: treeIconImg,
  iconSize: [40, 40], // size in pixels
  iconAnchor: [20, 40] // anchor point
});

export default function App() {
  return (
    <div className="app-background">
      <div className="central-strip">
        <h2>Map of Transformer</h2>
        <div className = 'mapWrapper'>
          <MapContainer
            center={[0, 0]} // coordinates of the center
            zoom={10}
            crs={L.CRS.Simple}
            className="map-container"
          >
            <TileLayer
              // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url = ""
              attribution=""
            />
            <ImageOverlay
              url={grass}
              bounds={[[-1,-1],[1,1]]}
            />
            <Marker position={[0,0]}>
              <Popup>Hello from Leaflet!</Popup>
            </Marker>
            <Marker position={[0.1, 0.1]} icon={treeIcon}>
              <Popup>A tree 🌳</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}


// {/* Perhaps it's actually possible to make a MST using pure leaflet. */}
// {/* I'll attempt this today */}
