import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { ImageOverlay } from "react-leaflet";
import L from "leaflet";

import grass from "/simplegrass.jpg";
import treeIconImg from "/tree.jpeg";

const treeIcon = L.icon({
  iconUrl: treeIconImg,
  iconSize: [40, 40], // size in pixels
  iconAnchor: [20, 40] // anchor point
});

export default function App() {
  const [trees, setTrees] = useState([]);
  useEffect(() => {
  fetch("map_data/graph.json")
    .then(res => res.text()) // read as text first
    .then(text => {
      console.log("Raw JSON text:", text);
      return JSON.parse(text); // parse manually
    })
    .then(data => {
      const coords = data.map(node => ({
        id: node.id,
        x: node.x_meters,
        y: node.y_meters
      }));
      setTrees(coords);
    })
    .catch(err => console.error("Failed to load graph.json", err));
  }, []);

  return (
    <div className="app-background">
      <div className="central-strip">
        <h2>Map of Transformer</h2>
        <div className = 'map-wrapper'>
          <MapContainer
            center={[0, 0]} // coordinates of the center
            zoom={10}
            crs={L.CRS.Simple}
            className="map-container"
          >
            {/* <ImageOverlay
              url={grass}
              bounds={[[-1,-1],[1,1]]}
            /> */}
            <TileLayer
              url={grass}            // your image file
              tileSize={256}         // size of each tile
              noWrap={false}         // allow repeating
              continuousWorld={true} // repeat infinitely
            />

            <Marker position={[0,0]}>
              <Popup>Hello from Leaflet!</Popup>
            </Marker>
            {trees.map((tree) => (
              <Marker
                key={tree.id}
                position={[tree.y, tree.x]} // Leaflet expects [lat, lng]
                icon={treeIcon}
              >
                <Popup>Transformer ID: {tree.id}</Popup>
              </Marker>
            ))}
          </MapContainer>
          <div
            className="sidebar"
          ><h3>Info Goes Here.</h3></div>
        </div>
      </div>
    </div>
  );
}


// {/* Perhaps it's actually possible to make a MST using pure leaflet. */}
// {/* I'll attempt this today */}
