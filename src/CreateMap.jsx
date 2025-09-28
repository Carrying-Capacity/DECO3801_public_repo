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
    className: "item-label-icon",
    html: `
      <div style="position: relative; text-align: center;">
        <img src="${isSolar ? solarHouseIconImg : houseIconImg}" width="40" height="40" />
        <div class="item-label">${houseID} (${Phase})</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]  // move popup upwards
  });

const TransformerIcon = () =>
  L.divIcon({
    className: "item-label-icon",
    html: `
      <div style="position: relative; text-align: center;">
        <img src="${transformerIconImg}" width="40" height="40" />
        <div class="item-label">Transformer</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]  // move popup upwards
  });

// const TransformerIcon = L.icon({
//   iconUrl: transformerIconImg,
//   iconSize: [40, 40], // size in pixels
//   iconAnchor: [20, 40] // anchor point
// });

export default function TransformerMap({trees}) {
  const [selectedItem, setSelectedTree] = useState(null); // track clicked tree

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
              : TransformerIcon()}>
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
        {selectedItem ? (
            <div>
              <p><b>Type:</b> {selectedItem.type}</p>
              <p><b>X:</b> {selectedItem.x_meters.toFixed(2)}</p>
              <p><b>Y:</b> {selectedItem.y_meters.toFixed(2)}</p>
              {selectedItem.type=='house' ?(
                <>
                  <p><b>HouseID:</b> {selectedItem.HouseID}</p>
                  <p><b>Generates Solar Power:</b> {selectedItem.solar ? "Yes" : "No"}</p>
                  <p><b>Predicted Phase:</b> {selectedItem.predicted_phase || "Unknown"}</p>
                  {/* Parent */}
                  <p><b>Parent: </b> 
                    {selectedItem.prev_nodes.length > 0
                      ? selectedItem.prev_nodes.map(pid => {
                          const parentNode = trees.find(t => t.id === pid);
                          if (!parentNode) return "Unknown";
                          return parentNode.type === "house"
                            ? `House ${parentNode.HouseID}`
                            : `Transformer ${parentNode.id}`;
                        }).join(", ")
                      : "None"}
                  </p>
                </>):(<></>)}
                {/* Children */}
                  <p><b>Children: </b> 
                    {selectedItem.next_nodes.length > 0
                      ? selectedItem.next_nodes.map(cid => {
                          const childNode = trees.find(t => t.id === cid);
                          if (!childNode) return "Unknown";
                          return childNode.type === "house"
                            ? `House ${childNode.HouseID}`
                            : `Transformer ${childNode.id}`;
                        }).join(", ")
                      : "None"}
                  </p>
              <p><b>ID:</b> {selectedItem.id}</p>
            </div>
          ) : (
            <p>Click on an object to see details.</p>
          )}
      </div>
    </div>
  );
}