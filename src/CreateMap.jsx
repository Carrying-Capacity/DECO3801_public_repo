import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, Polyline } from "react-leaflet";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

import grass from "/simplegrass.jpg";
import houseIconImg from "/house.png";
import solarHouseIconImg from "/solarhouse.jpeg";
import transformerIconImg from "/transformer.jpg";

const HouseIcon = (houseID, isSolar = false, Phase) =>
  L.divIcon({
    className: "house-label-icon",
    html: `
      <div style="position: relative; text-align: center;">
        <img src="${isSolar ? solarHouseIconImg : houseIconImg}" width="40" height="40" />
        <div class="house-label">${houseID} (${Phase})</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

const TransformerIcon = L.icon({
  iconUrl: transformerIconImg,
  iconSize: [40, 40], // size in pixels
  iconAnchor: [20, 40] // anchor point
});

export default function TransformerMap({trees}) {
  const [selectedTree, setSelectedTree] = useState(null); // track clicked tree

  return (
    <div className = 'map-wrapper'>
      <MapContainer
        center={[0, 0]} // coordinates of the center
        zoom={10}
        crs={L.CRS.Simple}
        className="map-container"
      >
        <TileLayer
          url={grass}            // your image file
          tileSize={256}         // size of each tile
          noWrap={false}         // allow repeating
          continuousWorld={true} // repeat infinitely
        />

        {trees.map((tree) => (
          <Marker
            key={tree.id}
            position={[tree.y_meters, tree.x_meters]} // Leaflet expects [lat, lng]
            eventHandlers={{
              click: () => setSelectedTree(tree) // save clicked tree
            }}
            icon = {tree.type === "house"
              ? tree.solar 
                ? HouseIcon(tree.HouseID, true, tree.predicted_phase)
                :HouseIcon(tree.HouseID, false, tree.predicted_phase)
              : TransformerIcon}>
            {tree.type === "house" ? (
              <Popup>House Number: {tree.HouseID}</Popup>
            ) : (
              <Popup>Transformer: {tree.id}</Popup>
            )}
          </Marker>
        ))}
        {/* Interonnecting lines for each house. We should make it so the JSON code specifies distance */}
        {trees.map((node) =>
          node.next_nodes?.map((nextId) => {
            const target = trees.find((n) => n.id === nextId);
            if (!target) return null; // skip if target not found
            return (
              <Polyline
                key={`${node.id}-${nextId}`}
                positions={[
                  [node.y_meters, node.x_meters],
                  [target.y_meters, target.x_meters]
                ]}
                color="blue"
              />
            );
          })
        )}
      </MapContainer>

      <div className="sidebar">
        <h3>Information</h3>
        {selectedTree ? (
            <div>
              <p><b>Type:</b> {selectedTree.type}</p>
              <p><b>X:</b> {selectedTree.x_meters.toFixed(2)}</p>
              <p><b>Y:</b> {selectedTree.y_meters.toFixed(2)}</p>
              {selectedTree.type=='house' ?(
                <>
                  <p><b>HouseID:</b> {selectedTree.HouseID}</p>
                  <p><b>Generates Solar Power:</b> {selectedTree.solar ? "Yes" : "No"}</p>
                  <p><b>Predicted Phase:</b> {selectedTree.predicted_phase || "Unknown"}</p>
                </>
              ):(<></>)}
              <p><b>ID:</b> {selectedTree.id}</p>
            </div>
          ) : (
            <p>Click on an object to see details.</p>
          )}
      </div>
    </div>
  );
}